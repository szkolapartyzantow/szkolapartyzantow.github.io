import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { OutputAsset } from "rollup";
import { defineConfig, type Plugin } from "vite";

function offlinePwa(): Plugin {
  const bundledVtxDataUrl = "./vtx-data.csv";
  const vtxCatalogAssetPath = "assets/vtx-catalog/";
  const remoteDataSources = [
    {
      remoteUrl:
        "https://docs.google.com/spreadsheets/d/1pSce3OR-ZkvILul03hWvtaR-mHh861qv2u8pIxIHbWQ/export?format=csv",
      bundledUrl: bundledVtxDataUrl,
    },
  ];

  function getOriginalFileNames(asset: OutputAsset) {
    return asset.originalFileNames ?? [];
  }

  function isVtxCatalogSource(fileName: string) {
    return fileName.includes(vtxCatalogAssetPath);
  }

  return {
    name: "offline-pwa",
    apply: "build",
    generateBundle(_, bundle) {
      const bundledVtxDataPath = path.resolve(__dirname, "src/public/vtx-data.csv");
      const catalogCsvAsset = Object.values(bundle).find(
        (asset) =>
          asset.type === "asset" &&
          getOriginalFileNames(asset).some((fileName) =>
            fileName.endsWith(`${vtxCatalogAssetPath}catalog.csv`),
          ),
      );
      const bundledCatalogDataUrl = catalogCsvAsset ? `./${catalogCsvAsset.fileName}` : null;
      if (bundledCatalogDataUrl) {
        remoteDataSources.push({
          remoteUrl:
            "https://docs.google.com/spreadsheets/d/1NKE5B1u5A8hL-Flh942pD51NE_eiRQ-5NaSDGjM0-LM/export?format=csv",
          bundledUrl: bundledCatalogDataUrl,
        });
      }

      const bundledAssetUrls = Object.values(bundle)
        .map((asset) => `./${asset.fileName}`)
        .filter((fileName) => !fileName.endsWith(".map"));
      const vtxCatalogPrecacheUrls = Object.values(bundle)
        .filter(
          (asset) =>
            asset.type === "asset" && getOriginalFileNames(asset).some(isVtxCatalogSource),
        )
        .map((asset) => `./${asset.fileName}`)
        .filter((fileName) => !fileName.endsWith(".map"));
      const precacheFiles = [
        "./",
        "./index.html",
        "./manifest.webmanifest",
        "./icons/SZKP_logo_sigint.svg",
        "./icons/favicon.png",
        ...(fs.existsSync(bundledVtxDataPath) ? [bundledVtxDataUrl] : []),
        ...bundledAssetUrls,
      ];
      const uniquePrecacheFiles = [...new Set(precacheFiles)];
      const uniqueVtxCatalogPrecacheUrls = [...new Set(vtxCatalogPrecacheUrls)];

      this.emitFile({
        type: "asset",
        fileName: "service-worker.js",
        source: `
const CACHE_NAME = "szkolapartyzantow-tools-v${Date.now()}";
const DATA_CACHE_NAME = "szkolapartyzantow-tools-data-v1";
const BUNDLED_VTX_DATA_URL = ${JSON.stringify(bundledVtxDataUrl)};
const PRECACHE_URLS = ${JSON.stringify(uniquePrecacheFiles, null, 2)};
const VTX_CATALOG_PRECACHE_URLS = ${JSON.stringify(uniqueVtxCatalogPrecacheUrls, null, 2)};
const REQUIRED_PRECACHE_URLS = [...new Set([...PRECACHE_URLS, ...VTX_CATALOG_PRECACHE_URLS])];
const REMOTE_DATA_SOURCES = ${JSON.stringify(remoteDataSources, null, 2)};
const GOOGLE_DOCS_DATA_URLS = REMOTE_DATA_SOURCES.map((source) => source.remoteUrl);

async function addAllInChunks(cache, urls, chunkSize = 40) {
  for (let index = 0; index < urls.length; index += chunkSize) {
    await cache.addAll(urls.slice(index, index + chunkSize));
  }
}

async function seedBundledData() {
  const dataCache = await caches.open(DATA_CACHE_NAME);

  await Promise.all(REMOTE_DATA_SOURCES.map(async ({ remoteUrl, bundledUrl }) => {
    if (!REQUIRED_PRECACHE_URLS.includes(bundledUrl)) {
      return;
    }

    const appCache = await caches.open(CACHE_NAME);
    let bundledResponse = await appCache.match(bundledUrl);

    if (!bundledResponse) {
      const fetchedResponse = await fetch(bundledUrl);
      if (!fetchedResponse.ok) {
        throw new Error(\`Bundled data HTTP \${fetchedResponse.status}\`);
      }

      bundledResponse = fetchedResponse.clone();
      await appCache.put(bundledUrl, fetchedResponse);
    }

    await dataCache.put(new Request(remoteUrl), bundledResponse.clone());
  }));
}

async function seedBundledVtxData() {
  if (!REQUIRED_PRECACHE_URLS.includes(BUNDLED_VTX_DATA_URL)) {
    return;
  }

  const appCache = await caches.open(CACHE_NAME);
  const dataCache = await caches.open(DATA_CACHE_NAME);
  let bundledResponse = await appCache.match(BUNDLED_VTX_DATA_URL);

  if (!bundledResponse) {
    const fetchedResponse = await fetch(BUNDLED_VTX_DATA_URL);
    if (!fetchedResponse.ok) {
      throw new Error(\`Bundled VTX data HTTP \${fetchedResponse.status}\`);
    }

    bundledResponse = fetchedResponse.clone();
    await appCache.put(BUNDLED_VTX_DATA_URL, fetchedResponse);
  }

  await Promise.all(
    GOOGLE_DOCS_DATA_URLS.map((url) => dataCache.put(new Request(url), bundledResponse.clone())),
  );
}

async function fetchAndCacheData(request) {
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const dataCache = await caches.open(DATA_CACHE_NAME);
    await dataCache.put(request, networkResponse.clone());
  }

  return networkResponse;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => addAllInChunks(cache, REQUIRED_PRECACHE_URLS))
      .then(() => seedBundledData())
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);

  if (GOOGLE_DOCS_DATA_URLS.includes(requestUrl.href)) {
    const networkPromise = fetchAndCacheData(request);
    event.waitUntil(networkPromise.catch(() => undefined));

    event.respondWith(
      caches.match(request, { cacheName: DATA_CACHE_NAME }).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return networkPromise
          .catch(() => caches.match(BUNDLED_VTX_DATA_URL, { cacheName: CACHE_NAME }))
          .then((response) => response || Response.error());
      }),
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        const response = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
        return networkResponse;
      });
    }),
  );
});
`,
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  root: "src",
  base: "./",
  plugins: [react(), tailwindcss(), offlinePwa()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: mode === "production",
  },
  server: {
    host: "0.0.0.0",
  },
  preview: {
    host: "0.0.0.0",
  },
  test: {
    include: ["lib/**/*.test.ts"],
    environment: "node",
  },
}));
