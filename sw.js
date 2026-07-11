// DigiRise India — Intelligent Service Worker (PWA MAX)
// v11 - Strategy-per-resource caching engine

const CACHE_VERSION = 20;
const BUCKETS = {
  shell: `dr-shell-v${CACHE_VERSION}`,
  static: `dr-static-v${CACHE_VERSION}`,
  img: `dr-img-v${CACHE_VERSION}`,
  blog: `dr-blog-v${CACHE_VERSION}`,
  font: `dr-font-v${CACHE_VERSION}`
};
const OFFLINE_URL = '/offline.html';

const SHELL_ASSETS = [
  '/',
  '/?source=pwa',
  '/index.html',
  '/offline.html',
  '/share.html',
  '/manifest.json',
  '/tools/',
  '/tools/website-speed-checker/',
  '/tools/ad-budget-calculator/',
  '/tools/roi-calculator/',
  '/tools/ad-copy-generator/'
];

const STATIC_ASSETS = [
  '/css/core.css',
  '/css/nextgen.css',
  '/css/ios26.css',
  '/css/redesign.css',
  '/js/nextgen.js',
  '/js/ios26.js',
  '/js/pwa.js',
  '/tools/css/tools.css',
  '/tools/js/hub.js',
  '/tools/js/router.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(BUCKETS.shell).then(cache => cache.addAll(SHELL_ASSETS)),
      caches.open(BUCKETS.static).then(cache => cache.addAll(STATIC_ASSETS))
    ])
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const currentCaches = Object.values(BUCKETS);
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key.startsWith('dr-') && !currentCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );

  // Notify all open clients that a new SW is active
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
    });
  });
});

// LRU cache trim utility
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    trimCache(cacheName, maxItems);
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. BYPASS for Video Range requests (fixes video seeking)
  if (event.request.headers.has('range') || url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
    return; // browser handles natively
  }

  // 2. NETWORK-ONLY for meta, sitemaps, robots
  if (url.pathname.startsWith('/meta/') || url.pathname === '/sitemap.xml' || url.pathname === '/robots.txt') {
    event.respondWith(fetch(event.request));
    return;
  }

  // 3. CACHE-FIRST OPAQUE for Google Fonts
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(res => {
          const resClone = res.clone();
          caches.open(BUCKETS.font).then(cache => {
            cache.put(event.request, resClone);
            trimCache(BUCKETS.font, 20); // Cap fonts
          });
          return res;
        });
      })
    );
    return;
  }

  // 4. CACHE-FIRST for Images/Icons with LRU Cap
  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(png|jpe?g|webp|svg|ico)$/)) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(res => {
          if (res.ok) {
            const resClone = res.clone();
            caches.open(BUCKETS.img).then(cache => {
              cache.put(event.request, resClone);
              trimCache(BUCKETS.img, 60); // Cap at 60 images
            });
          }
          return res;
        });
      })
    );
    return;
  }

  // 5. STALE-WHILE-REVALIDATE for Content Hubs & CSS/JS
  const isContentHub = url.pathname.match(/^\/(blog|tools|locations|industries|compare|case-studies|glossary|growth-partner-program)\//);
  if (isContentHub || url.pathname.match(/\.(css|js)$/)) {
    const targetBucket = isContentHub ? BUCKETS.blog : BUCKETS.static;
    event.respondWith(
      caches.match(event.request).then(cached => {
        const networkFetch = fetch(event.request).then(res => {
          if (res.ok) {
            caches.open(targetBucket).then(cache => cache.put(event.request, res.clone()));
          }
          return res;
        }).catch(err => console.warn('Fetch failed', err));
        return cached || networkFetch;
      })
    );
    return;
  }

  // 6. NETWORK-FIRST (3s timeout) for HTML Shell / Fallback to offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => reject('timeout'), 3000);
        fetch(event.request)
          .then(res => {
            clearTimeout(timeoutId);
            if (res.ok) {
              const resClone = res.clone();
              caches.open(BUCKETS.shell).then(cache => cache.put(event.request, resClone));
            }
            resolve(res);
          })
          .catch(reject);
      })
      .catch(() => caches.match(event.request))
      .then(res => res || caches.match(OFFLINE_URL))
    );
    return;
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
