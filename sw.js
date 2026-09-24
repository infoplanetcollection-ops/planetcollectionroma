const cacheName = 'planet-catalog-v3';
const appShell = ['app.html', 'app.js', 'manifest.webmanifest', 'assets/logo-planet-collection-roma.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(appShell))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key !== cacheName)
        .map((key) => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    event.request.url.endsWith('/ebay-products.json')
      ? fetch(event.request).then((response) => {
          const responseClone = response.clone();
          caches.open(cacheName).then((cache) => cache.put(event.request, responseClone));
          return response;
        }).catch(() => caches.match(event.request))
      : caches.match(event.request).then((cached) => {
          if (cached) {
            return cached;
          }

          return fetch(event.request).then((response) => {
            const responseClone = response.clone();
            caches.open(cacheName).then((cache) => cache.put(event.request, responseClone));
            return response;
          }).catch(() => cached);
        })
  );
});
