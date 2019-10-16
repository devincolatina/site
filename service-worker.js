'use strict';
  
addEventListener('install', function (event) {
    console.log('INSTALL: The service worker is installing . . . ', event);
});

addEventListener('activate', function (event) {
    console.log('ACTIVATE - The service worker is activated.', event);
});

addEventListener('fetch', function (event) {
    console.log('FETCH: The service worker is listening.', event);
});