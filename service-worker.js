const CACHE_NAME = 'rubilar-v5';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Estrategia: Intentar red, si falla usar lo que haya en cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
