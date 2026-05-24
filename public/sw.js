// Service Worker nativo mínimo para cumplir requisitos de PWA (installability)
const CACHE_NAME = "teolingo-cache-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Estrategia básica: Network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      return new Response("Error de conexión", {
        status: 408,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }),
  );
});
