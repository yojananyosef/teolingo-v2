const CACHE_NAME = "teolingo-v2-cache-v2";
const AUDIO_CACHE_NAME = "teolingo-audio-v1";

const PRECACHE_URLS = ["/globals.css", "/favicon.ico"];

// Install Event: Precache static assets (no auth required)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // addAll falla si una URL responde con redirect/error (p.ej. páginas que
      // requieren sesión); precacheamos cada asset de forma tolerante.
      await Promise.all(
        PRECACHE_URLS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
            }
          } catch {
            // ignore individual failures
          }
        }),
      );
      return self.skipWaiting();
    }),
  );
});

// Activate Event: Cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== AUDIO_CACHE_NAME)
            .map((name) => caches.delete(name)),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch Event: Cache-First for audio, Stale-While-Revalidate for pages/static assets
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle Audio Files Cache-First
  if (
    url.pathname.endsWith(".mp3") ||
    url.pathname.endsWith(".wav") ||
    url.pathname.includes("/audio/")
  ) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) return cachedResponse;
        try {
          const networkResponse = await fetch(request);
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return new Response("Audio offline fallback", { status: 503 });
        }
      }),
    );
    return;
  }

  // Stale-While-Revalidate for HTML pages & CSS
  if (
    request.mode === "navigate" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      }),
    );
  }
});
