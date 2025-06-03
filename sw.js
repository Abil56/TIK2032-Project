const CACHE_NAME = "abil-portfolio-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/gallery.html",
  "/blog.html",
  "/blog1.html",
  "/blog2.html",
  "/blog3.html",
  "/contact.html",
  "/styles.css",
  "/script.js",
  "/favicon.ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
