
const CACHE_NAME = 'zooka-os-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Security: List of forbidden patterns in URLs
const FORBIDDEN_PATTERNS = ['exploit', 'malware', '192.168', '10.0'];

self.addEventListener('install', event => {
  // We should tell the service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force activation
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Security Check: Block requests to suspicious URLs
  if (FORBIDDEN_PATTERNS.some(pattern => url.includes(pattern))) {
    console.error(`🚨 ZOOKA SHIELD (SW): Blocked suspicious request to ${url}`);
    event.respondWith(
      new Response('Request blocked by ZOOKA SHIELD', {
        status: 403,
        statusText: 'Forbidden',
        headers: { 'Content-Type': 'text/plain' }
      })
    );
    return; // Stop further processing
  }

  // Cache-First Strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      })
  );
});


self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients
  );
});
