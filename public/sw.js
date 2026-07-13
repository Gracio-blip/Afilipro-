// AfiliPro SW v2 - Force update, clear old cache
const CACHE_VERSION = 'afilipro-v2';
const CACHE_NAME = 'cache-' + CACHE_VERSION;

self.addEventListener('install', (event) => {
  // Force new SW to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Delete all old caches
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network only - no caching for HTML and API to always show fresh content
// Only cache images/fonts
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Never cache API and pages - always network
  if (url.pathname.startsWith('/api/') || 
      event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For static assets, cache first
  if (event.request.destination === 'image' || 
      event.request.destination === 'font' ||
      url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // Default: network only
  event.respondWith(fetch(event.request));
});
