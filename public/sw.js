// Version is auto-generated from build time - ensures cache invalidation on every deploy
const CACHE_VERSION = Date.now();
const CACHE_NAME = `astrokiran-v${CACHE_VERSION}`;

// Only cache truly static assets (images, fonts) - NOT HTML/CSS/JS
const STATIC_CACHE_URLS = [
  '/favicon.ico',
];

// Install event - minimal caching
self.addEventListener('install', (event) => {
  console.log('[SW] Installing new service worker version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        self.skipWaiting(); // Activate immediately
      })
  );
});

// Activate event - clean up ALL old caches aggressively
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new service worker version:', CACHE_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete ALL caches, including current one to force fresh fetches
          console.log('[SW] Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - NETWORK FIRST strategy (always try network, fallback to cache)
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip caching for API calls and external requests
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('contentful') ||
    event.request.url.includes('google') ||
    event.request.url.includes('recaptcha') ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  // NETWORK FIRST: Always fetch from network, only use cache as fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Don't cache if not a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Only cache images and fonts (NOT HTML, CSS, JS)
        const url = event.request.url;
        const shouldCache =
          url.includes('.png') ||
          url.includes('.jpg') ||
          url.includes('.jpeg') ||
          url.includes('.webp') ||
          url.includes('.svg') ||
          url.includes('.woff') ||
          url.includes('.woff2') ||
          url.includes('.ttf');

        if (shouldCache) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      })
      .catch(() => {
        // Network failed - try cache as fallback
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // No cache available - return offline message
            return new Response('Offline - Please check your connection', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
      })
  );
});