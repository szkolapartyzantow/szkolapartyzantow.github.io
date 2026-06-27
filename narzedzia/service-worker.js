
const CACHE_NAME = "szkolapartyzantow-tools-v1782560489688";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/SZKP_logo_sigint.svg",
  "./icons/favicon.png",
  "./assets/favicon-C64FUasr.png",
  "./assets/patronite-logo-SVG-02-Dh6oOuZ6.svg",
  "./assets/index-DzwzgjhB.css",
  "./assets/index-ChcdjoTU.js"
];

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
