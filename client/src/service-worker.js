// prevent service worker from fetching google analytics URLs - creates duplicate events otherwise
self.addEventListener('fetch', (ev) => {
  if(ev.request.url.startsWith('https://www.google-analytics.com')) {
    ev.stopImmediatePropagation();
  }
});

importScripts('./ngsw-worker.js');
