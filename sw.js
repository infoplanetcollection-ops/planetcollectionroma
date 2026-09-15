const cacheName = 'planet-catalog-v1';
const appShell = ['app.html', 'app.js', 'manifest.webmanifest', 'assets/logo-planet-collection-roma.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(appShell)));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
