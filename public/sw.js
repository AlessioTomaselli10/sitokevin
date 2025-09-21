// /public/sw.js
const CACHE_NAME = 'offline-cache-v3';
const OFFLINE_HTML = '/offline/offline.html';
const ASSETS = [
  OFFLINE_HTML,
  '/offline/offline.css',
  '/offline/offline.js',
  '/offline/images/pen.png',
];

self.addEventListener('install', (event) => {
  console.log('[SW] install');
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // forza il fetch dalla rete su install
    await cache.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })));
    await self.skipWaiting();
    console.log('[SW] cached:', ASSETS);
  })().catch(err => console.error('[SW] install error:', err)));
});

self.addEventListener('activate', (event) => {
  console.log('[SW] activate');
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Navigazioni: network-first, fallback all'HTML offline
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // se disponibile, usa la risposta preload
        const preload = await event.preloadResponse;
        if (preload) return preload;
        // prova rete
        return await fetch(request);
      } catch (err) {
        console.warn('[SW] navigate fallback -> offline.html');
        const cached = await caches.match(OFFLINE_HTML);
        return cached || new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  // Asset: network-first con fallback cache
  event.respondWith((async () => {
    try {
      return await fetch(request);
    } catch {
      const cached = await caches.match(request);
      if (cached) return cached;
      // extra: se chiedono file offline senza rete, prova a mappare su cache
      if (request.url.endsWith('/offline.css')) return caches.match('/offline/offline.css');
      if (request.url.endsWith('/offline.js')) return caches.match('/offline/offline.js');
      if (request.url.includes('/images/pen.png')) return caches.match('/offline/images/pen.png');
      return Response.error();
    }
  })());
});
