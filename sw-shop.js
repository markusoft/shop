self.addEventListener('install', e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll([
                './index.html',
                // fonts
                './plugins/fontello/font/fontello.eot',
                './plugins/fontello/font/fontello.svg',
                './plugins/fontello/font/fontello.ttf',
                './plugins/fontello/font/fontello.woff',
                './plugins/fontello/font/fontello.woff2',
                './fonts/CenturyGothic-Bold.ttf',
                './fonts/CenturyGothic-Regular.ttf',
                // assets
                // css
                './assets/css/normalize.css',
                './assets/css/template.css',
                // js
                './assets/js/tpl-config.js',
                './assets/js/tpl-mgelo.js',
                // images
                './assets/img/placeholders/rectangle.svg',
                './assets/img/placeholders/square.svg',
                './assets/img/placeholders/profile.svg',
                // module assets
                // css
                './css/shop.css',
                './css/shop-desktop.css',
                './css/shop-tablet.css',
                './css/shop-mobile.css',
                // js
                './js/data.js',
                './js/shop.js',
                './js/shop-ui.js',
                './js/shop-proto.js'
            ]);
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});