const CACHE_NAME = 'poll11-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/image.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

const getFallbackIndex = async () => {
  const cache = await caches.open(CACHE_NAME);
  const cachedIndex = await cache.match('/index.html');
  if (cachedIndex) return cachedIndex;

  return new Response(
    '<!doctype html><html><head><meta charset="utf-8"><title>Offline</title></head><body><div id="root"></div></body></html>',
    { headers: { 'Content-Type': 'text/html' } }
  );
};

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
            return response;
          }
          return getFallbackIndex();
        })
        .catch(() => getFallbackIndex())
    );
    return;
  }

  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return cacheResponse || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => cacheResponse || getFallbackIndex());
    })
  );
});