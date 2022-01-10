const timestamp = 1641818955351;
const build = [
  "/_app/start-e7b05a54.js",
  "/_app/assets/start-61d1577b.css",
  "/_app/layout.svelte-5e07325c.js",
  "/_app/error.svelte-2cff73e8.js",
  "/_app/pages/index.svelte-ea6be73a.js",
  "/_app/chunks/vendor-25d9d209.js"
];
const files = [
  "/favicon.png",
  "/manifest.json"
];
const worker = self;
const CACHE_NAME = `static-cache-${timestamp}`;
const to_cache = build.concat(files);
worker.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    console.log("[ServiceWorker] Pre-caching offline page");
    return cache.addAll(to_cache).then(() => {
      worker.skipWaiting();
    });
  }));
});
worker.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(caches.keys().then(async (keys) => Promise.all(keys.map((key) => {
    if (key !== CACHE_NAME) {
      console.log("[ServiceWorker] Removing old cache", key);
      return caches.delete(key);
    }
  }))));
  worker.clients.claim();
});
self.addEventListener("fetch", (event) => {
  console.log("[ServiceWorker] Fetch", event.request.url);
  if (event.request.mode !== "navigate") {
    return;
  }
  event.respondWith(fetch(event.request).catch(() => {
    return caches.open(CACHE_NAME).then((cache) => {
      return cache.match("offline.html");
    });
  }));
});
