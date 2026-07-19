const CACHE_NAME = 'cusat-mech-notes-33a67115';
const APP_SHELL = ['./', './index.html', './support.js', './manifest.json', './site.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.protocol === 'blob:' || url.protocol === 'data:') return; // blob/data URLs aren't fetchable from the SW scope — let the page handle them directly
  if (url.origin !== self.location.origin) return; // let cross-origin file downloads (raw.githubusercontent.com) go straight to network
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
