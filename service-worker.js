'use strict';
  
// Variables --------------------------------------------------------------------------------------

const VERSION           = 1;
const STATIC_CACHE_NAME = 'staticfiles_' + VERSION;

const OFFLINE_PAGE  = '/offline.html';
const OFFLINE_IMAGE = '/images/offline.png';

// Base functions ---------------------------------------------------------------------------------

function loadPreCache() {

    return caches.open(STATIC_CACHE_NAME).then( cache => {

        return cache.addAll([
            OFFLINE_PAGE,
            OFFLINE_IMAGE
        ]);
    });
}

// Install ----------------------------------------------------------------------------------------

self.addEventListener('install', event => {

    self.skipWaiting();

    event.waitUntil( loadPreCache() );

});