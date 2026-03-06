/* Service Worker for Kamukira PRMS - Offline Support */
const CACHE_NAME = 'kamukira-prms-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

const API_CACHE_NAME = 'kamukira-api-v1';
const OFFLINE_QUEUE_DB = 'kamukira-offline-queue';
const OFFLINE_QUEUE_STORE = 'queue';
const OFFLINE_QUEUE_DB_VERSION = 1;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
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
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Open IndexedDB for the offline queue
function openQueueDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(OFFLINE_QUEUE_DB, OFFLINE_QUEUE_DB_VERSION);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(OFFLINE_QUEUE_STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function enqueueRequest(item) {
  return openQueueDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readwrite');
    tx.objectStore(OFFLINE_QUEUE_STORE).add(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}

function dequeueAllRequests() {
  return openQueueDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readonly');
    const req = tx.objectStore(OFFLINE_QUEUE_STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function clearQueue() {
  return openQueueDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(OFFLINE_QUEUE_STORE, 'readwrite');
    tx.objectStore(OFFLINE_QUEUE_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    if (request.method === 'GET') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => caches.match(request))
      );
    } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      event.respondWith(
        fetch(request).catch(() =>
          request.clone().json().then((body) =>
            enqueueRequest({
              url: request.url,
              method: request.method,
              body,
              timestamp: Date.now(),
            }).then(() =>
              new Response(
                JSON.stringify({ status: 'queued', message: 'Request queued for offline sync' }),
                { headers: { 'Content-Type': 'application/json' }, status: 202 }
              )
            )
          )
        )
      );
    }
    return;
  }

  // For static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request).catch(() => caches.match('/index.html'));
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-queue') {
    event.waitUntil(syncOfflineQueue());
  }
});

async function syncOfflineQueue() {
  const queue = await dequeueAllRequests();
  if (queue.length === 0) return;

  let anyFailed = false;
  for (const item of queue) {
    try {
      await fetch(item.url, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.body),
      });
    } catch {
      anyFailed = true;
    }
  }

  if (!anyFailed) {
    await clearQueue();
  }
}

