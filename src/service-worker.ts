import { build, files, timestamp } from '$service-worker';
 
const worker = (self as unknown) as ServiceWorkerGlobalScope;
const CACHE_NAME = `static-cache-${timestamp}`;
 
const to_cache = build.concat(files);
 
worker.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(to_cache).then(() => {
        worker.skipWaiting();
      });
    }),
  );
});
 
worker.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  // Remove previous cached data from disk
  event.waitUntil(
    caches.keys().then(async (keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }),
      ),
    ),
  );
  worker.clients.claim();
});
 
/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetchAndCache(request: Request) {
	const cache = await caches.open(`offline${timestamp}`);

	try {
		const response = await fetch(request);
		cache.put(request, response.clone());
		return response;
	} catch (err) {
		const response = await cache.match(request);
		if (response) return response;

		throw err;
	}
}

self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  if (event.request.mode !== 'navigate') {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match('offline.html');
      });
    }),
  );
});