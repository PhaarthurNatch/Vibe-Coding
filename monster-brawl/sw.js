// Service worker de Monster Brawl: deja el juego disponible sin internet.
// La página se pide primero a la red (para recibir actualizaciones) y si no hay conexión se usa la copia guardada.
// Al cambiar archivos, subir el número de CACHE para que los celulares descarten la copia vieja.
const CACHE = 'monster-brawl-v3';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') { // la página: red primero, copia guardada si no hay internet
    e.respondWith(fetch(req, { cache: 'no-cache' }).then(r => /* no-cache: siempre pregunta al servidor si hay versión nueva (GitHub Pages guarda 10 min) */ { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; })));
});
