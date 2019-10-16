'use strict';
  
// Variables --------------------------------------------------------------------------------------

const VERSION           = 2;
const IMAGE_VERSION     = 1;
const STATIC_CACHE_NAME = 'staticfiles_' + VERSION;
const IMAGE_CACHE_NAME  = 'images_' + IMAGE_VERSION;
const SCRIPT_CACHE_NAME = 'script_' + VERSION;
const STYLE_CACHE_NAME  = 'style_' + VERSION;
const FONT_CACHE_NAME   = 'font_' + VERSION;
const PAGE_CACHE_NAME   = 'pages_' + VERSION;

const BLACKLIST     = ['/admin.html'];
const OFFLINE_PAGE  = '/offline.html';
const OFFLINE_IMAGE = '/images/offline.png';

const CACHE_LIST = [
    STATIC_CACHE_NAME,
    IMAGE_CACHE_NAME,
    SCRIPT_CACHE_NAME,
    STYLE_CACHE_NAME,
    PAGE_CACHE_NAME,
];

// Base functions ---------------------------------------------------------------------------------

function loadPreCache() {

    return caches.open(STATIC_CACHE_NAME).then( cache => {

        return cache.addAll([
            OFFLINE_PAGE,
            OFFLINE_IMAGE
        ]);
    });
}

function cleanCache() {

    return caches.keys().then( cacheNames => {

        return Promise.all(
            cacheNames.map( cacheName => {
                if(!CACHE_LIST.includes(cacheName))
                    return caches.delete(cacheName);
            } )
        );

    }).then( () => {

        return clients.claim();
    })
}

function saveInCache(request, cacheName, copy) {

    return caches.open(cacheName).then( pagesCache => {
        return pagesCache.put(request, copy);
    }).catch( error => {
        console.log('Error: ', error);
    })
}

// Install ----------------------------------------------------------------------------------------

self.addEventListener('install', event => {

    self.skipWaiting();

    event.waitUntil( loadPreCache() );

});

// Activate ---------------------------------------------------------------------------------------

self.addEventListener('activate', activateEvent => {

    activateEvent.waitUntil( cleanCache() );
});

// Fetch ------------------------------------------------------------------------------------------

self.addEventListener('fetch', event => {

    const request = event.request;

    let fetchPermited = true; 

    BLACKLIST.map( tag => {
        if(request.url.includes(tag))
            fetchPermited = false;
    });

    // Request an HTML file
    if (request.method === 'GET' &&
        request.destination === 'document' &&
        request.headers.get('Accept').includes('text/html')) {

        event.respondWith(

            // Fetch that page from the network
            fetch(request).then( responseFromFetch => {

                console.log('Fetch HTML', responseFromFetch);

                // Put a copy in the cache
                const copy = responseFromFetch.clone();

                event.waitUntil(
                    saveInCache(request, PAGE_CACHE_NAME, copy)
                );

                return responseFromFetch;

            })
            .catch( error => {

                return caches.match(request).then( responseFromCache => {

                    if(fetchPermited && responseFromCache) {
                        console.log('HTML - Response from cache', responseFromCache);
                        return responseFromCache;
                    }

                    console.log('HTML - Show Offline page');

                    // Otherwise show the fallback page
                    return caches.match(OFFLINE_PAGE);
                });
            })
        );

        return;
    }
    
});