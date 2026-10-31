const CACHE = 'analytics-v1'
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/maskable.svg']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  // API و Vite HMR را کش نکن
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/@vite') || url.pathname.startsWith('/src')) {
    return
  }

  // ناوبری (صفحات) → network-first با fallback به cache
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put('/index.html', clone))
          return res
        })
        .catch(() => caches.match('/index.html'))
    )
    return
  }

  // بقیه assets → cache-first
  e.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((res) => {
      const clone = res.clone()
      caches.open(CACHE).then((c) => c.put(request, clone))
      return res
    }))
  )
})