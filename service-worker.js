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

// Install ----------------------------------------------------------------------------------------

self.addEventListener('install', event => {

    self.skipWaiting();

    event.waitUntil( loadPreCache() );

});

// Activate ---------------------------------------------------------------------------------------

self.addEventListener('activate', activateEvent => {

    activateEvent.waitUntil( cleanCache() );
});