const CACHE_NAME = 'catalog-management-v1.12';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Chrome extension requests and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful API responses for offline use
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Handle static assets and navigation requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }

      // Otherwise, fetch from network
      return fetch(event.request).then((response) => {
        // Cache successful responses for static assets
        if (response.ok && (
          event.request.url.endsWith('.js') ||
          event.request.url.endsWith('.css') ||
          event.request.url.endsWith('.png') ||
          event.request.url.endsWith('.jpg') ||
          event.request.url.endsWith('.svg')
        )) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      });
    })
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-catalogs') {
    event.waitUntil(syncCatalogs());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Catalog Management', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/catalogs')
    );
  }
});

// Helper function for background sync
async function syncCatalogs() {
  try {
    const failedRequests = await getFailedRequests();
    await Promise.all(failedRequests.map(async (request) => {
      try {
        await fetch(request);
        await removeFailedRequest(request);
      } catch (error) {
        console.error('Background sync failed:', error);
      }
    }));
  } catch (error) {
    console.error('Error during background sync:', error);
  }
}

// These functions would be implemented to work with IndexedDB
async function getFailedRequests() {
  // TODO: Implement getting failed requests from IndexedDB
  return [];
}

async function removeFailedRequest(request) {
  // TODO: Implement removing succeeded request from IndexedDB
}
