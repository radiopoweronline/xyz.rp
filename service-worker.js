const CACHE_NAME = 'radio-power-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/192.png',
    '/assets/512.png'
];

// Instalar el Service Worker y almacenar en caché los recursos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Cache abierto y recursos almacenados.');
            return cache.addAll(urlsToCache);
        })
    );
});

// Activar el Service Worker y eliminar cachés antiguos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);  // Eliminar cachés antiguos
                    }
                })
            );
        })
    );
});

// Interceptar las solicitudes de red y servir desde el caché si está disponible
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Si encontramos el recurso en el caché, lo devolvemos. Si no, lo buscamos en la red.
            return response || fetch(event.request).catch(() => {
                // Si no hay red, devolver una imagen de respaldo o una página de error
                return caches.match('/assets/192.png'); // O la ruta a una página de error
            });
        })
    );
});
