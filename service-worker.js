const CACHE_NAME = "portfolio-cache-v1";

const urlsToCache = [
  "/mon-portfolio/",
  "/mon-portfolio/index.html",
  "/mon-portfolio/portfolio.html",
  "/mon-portfolio/cv.html",
  "/mon-portfolio/contact.html",
  "/mon-portfolio/styles/style.css",
  "/mon-portfolio/scripts/script.js",
  "/mon-portfolio/assets/cestmoi.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});


self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});


self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});