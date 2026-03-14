const CACHE_NAME = "portfolio-cache-v3";

const urlsToCache = [
  "/mon-portfolio/",
  "/mon-portfolio/index.html",
  "/mon-portfolio/portfolio.html",
  "/mon-portfolio/cv.html",
  "/mon-portfolio/contact.html",
  "/mon-portfolio/styles/style.css",
  "/mon-portfolio/scripts/script.js",
  "/mon-portfolio/scripts/animations.js",
  "/mon-portfolio/assets/cestmoi.jpg",
  "/mon-portfolio/assets/logo.png",
  "/mon-portfolio/assets/coding-1853305_1280.jpg",
  "/mon-portfolio/assets/design.jpg",
  "/mon-portfolio/assets/favicon/favicon.ico",
  "/mon-portfolio/assets/favicon/android-chrome-192x192.png",
  "/mon-portfolio/assets/favicon/android-chrome-512x512.png",
  "/mon-portfolio/projets/projet1.html",
  "/mon-portfolio/projets/projet2.html",
  "/mon-portfolio/projets/projet3.html"
];

// Install — cache all assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch — cache-first with network fallback
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(networkResponse => {
        // Cache new requests dynamically
        if (event.request.method === "GET" && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return networkResponse;
      });
    }).catch(() => {
      // Offline fallback
      if (event.request.destination === "document") {
        return caches.match("/mon-portfolio/index.html");
      }
    })
  );
});