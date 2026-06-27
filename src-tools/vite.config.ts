import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function offlinePwa(): Plugin {
  return {
    name: "offline-pwa",
    apply: "build",
    generateBundle(_, bundle) {
      const precacheFiles = [
        "./",
        "./index.html",
        "./manifest.webmanifest",
        "./icons/SZKP_logo_sigint.svg",
        "./icons/favicon.png",
        ...Object.values(bundle)
          .map((asset) => `./${asset.fileName}`)
          .filter((fileName) => !fileName.endsWith(".map")),
      ];

      this.emitFile({
        type: "asset",
        fileName: "service-worker.js",
        source: `
const CACHE_NAME = "szkolapartyzantow-tools-v${Date.now()}";
const PRECACHE_URLS = ${JSON.stringify(precacheFiles, null, 2)};

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
            .filter((cacheName) => cacheName !== CACHE_NAME)
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
