import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function offlinePwa(): Plugin {
  const googleDocsDataUrls = [
    "https://docs.google.com/spreadsheets/d/1pSce3OR-ZkvILul03hWvtaR-mHh861qv2u8pIxIHbWQ/export?format=csv",
  ];

  return {
    name: "offline-pwa",
    apply: "build",
    generateBundle(_, bundle) {
      const bundledVtxDataPath = path.resolve(__dirname, "src/public/vtx-data.csv");
      const precacheFiles = [
        "./",
        "./index.html",
        "./manifest.webmanifest",
        "./icons/SZKP_logo_sigint.svg",
        "./icons/favicon.png",
        ...(fs.existsSync(bundledVtxDataPath) ? ["./vtx-data.csv"] : []),
        ...Object.values(bundle)
          .map((asset) => `./${asset.fileName}`)
          .filter((fileName) => !fileName.endsWith(".map")),
      ];

      this.emitFile({
        type: "asset",
        fileName: "service-worker.js",
        source: `
const CACHE_NAME = "szkolapartyzantow-tools-v${Date.now()}";
const DATA_CACHE_NAME = "szkolapartyzantow-tools-data-v1";
const PRECACHE_URLS = ${JSON.stringify(precacheFiles, null, 2)};
const GOOGLE_DOCS_DATA_URLS = ${JSON.stringify(googleDocsDataUrls, null, 2)};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
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
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const response = networkResponse.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => cache.put(request, response));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request, { cacheName: DATA_CACHE_NAME })),
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
