/* Japan TravelMate service worker — offline-first for critical routes */
const VERSION = 'travelmate-v2'
const STATIC_CACHE = `${VERSION}-static`
const RUNTIME_CACHE = `${VERSION}-runtime`

/**
 * App-shell routes that must work offline. We cache navigations on first visit
 * and serve them stale-while-revalidate when online.
 */
const CRITICAL_ROUTES = [
  '/',
  '/vegetarian-card',
  '/emergency',
  '/adira',
  '/itinerary',
  '/phrasebook',
  '/taxi',
  '/family',
  '/checklists',
  '/offline',
  '/manifest.webmanifest',
  '/icon.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      Promise.all(
        CRITICAL_ROUTES.map((url) =>
          fetch(url, { cache: 'no-store' })
            .then((res) => res.ok && cache.put(url, res.clone()))
            .catch(() => {})
        )
      )
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== location.origin) return

  // Page navigations: network-first with offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy)).catch(() => {})
          return res
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match('/offline'))
        )
    )
    return
  }

  // Static assets: cache-first
  if (/\.(?:css|js|woff2?|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached ||
        fetch(req).then((res) => {
          const copy = res.clone()
          caches.open(STATIC_CACHE).then((c) => c.put(req, copy)).catch(() => {})
          return res
        })
      )
    )
  }
})
