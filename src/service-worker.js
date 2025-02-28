/* eslint-disable no-restricted-globals */
const CACHE_NAME = "my-pwa-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/css/main.css",
  "/static/js/bundle.js",
];

// Install event: Cache resources
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install event triggered");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching Files");
        return cache.addAll(urlsToCache).then(() => {
          console.log("Service Worker: Files successfully cached.");
        });
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache files", error);
      })
  );
});

// Activate event: Remove old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate event triggered");

  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log(`Service Worker: Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            } else {
              console.log(`Service Worker: Keeping cache: ${cacheName}`);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activation complete.");
      })
      .catch((error) => {
        console.error("Service Worker: Failed during activation", error);
      })
  );
});

// Fetch event: Serve cached files
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetch event triggered for", event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache", event.request.url);
        return cachedResponse;
      }

      console.log("Service Worker: Fetching from network", event.request.url);
      return fetch(event.request)
        .then((networkResponse) => {
          // Optionally, you can cache the new response here if needed
          return networkResponse;
        })
        .catch((error) => {
          console.error(
            "Service Worker: Failed to fetch",
            event.request.url,
            error
          );
        });
    })
  );
});
