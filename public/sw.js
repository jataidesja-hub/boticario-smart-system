const CACHE_NAME = 'boticario-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Estratégia simples: tenta rede, se falhar, nada acontece (por enquanto)
    event.respondWith(fetch(event.request));
});
