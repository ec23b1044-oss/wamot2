const CACHE_NAME = "wamot-cache-v2";

// Install → force immediate activation
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Activate → clear old cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// FETCH → ALWAYS go to network (force fresh UI)
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
