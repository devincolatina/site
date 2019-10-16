'use strict';
  
// Variables --------------------------------------------------------------------------------------

const VERSION           = 2;
const STATIC_CACHE_NAME = 'staticfiles_' + VERSION;

const OFFLINE_PAGE  = '/offline.html';
const OFFLINE_IMAGE = '/images/offline.png';

const CACHE_LIST = [
    STATIC_CACHE_NAME
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