const CACHE = "financeos-vanilla-v1";
const ROOT = self.registration.scope;
const asset = (path) => new URL(path, ROOT).href;
const APP_SHELL = [
  ROOT,
  asset("index.html"),
  asset("styles.css"),
  asset("app.js"),
  asset("manifest.webmanifest"),
  asset("favicon.svg"),
  asset("icon-192.png"),
  asset("icon-512.png"),
  asset("apple-touch-icon.png")
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(ROOT, clone));
          return response;
        })
        .catch(() => caches.match(ROOT))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      if (response.ok && ["style", "script", "image", "manifest"].includes(event.request.destination)) {
        const clone = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, clone));
      }
      return response;
    }))
  );
});
