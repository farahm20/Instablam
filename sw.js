self.addEventListener('install', function(event){
    console.log('service worker installed at: ' + new Date().toLocaleString());

    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                "/index.html",
                "/style.css",
                "/manifest.webmanifest",
                "./images/camera_icon-512.png",
            ]);
        })
    )
});

self.addEventListener('fetch', function(event){
    console.log('service worker: fetch');
    console.log('service worker activates at: ' + new Date().toLocaleTimeString());
    
});

self.addEventListener("fetch", (event) => {
    console.log("Service worker: fetching resource ", event.request.url);
    // if online then make a regular request
    // if offline then leave a saved answer
    if (navigator.onLine) {
      event.respondWith(
        fetch(event.request).then((response) => {
          // Before we send feedback back to the browser - save a copy of response in cache
          let clone = response.clone();
          caches.open("v1").then((cache) => {
            cache.put(event.request, clone);
            // console.log("clone of response", clone);
          });
          return response;
        })
      );
    } else {
      // console.log("Fetch: offline, request url is:", event.request.url);
      // Vi är offline. Leta först efter ett matchande request i cache. Om det inte finns, returnera en offline-sida.
      event.respondWith(
        caches.match(event.request).then((maybeResponse) => {
          if (maybeResponse !== undefined) {
            // Tur! Vi har sparat resultatet från ett liknande request tidigare
            // console.log("Fetch: maybeResponse=", maybeResponse);
            return maybeResponse;
          } else {
            // console.log("Return a new Response");
            return new Response("<h1>No internet </h1>", {
              headers: { "Content-Type": "text/html" },
            });
          }
        })
      );
    }
  });
// Session storage - disappears when we restart the app
// Local storage - is for saving data
// Cache - is for saving files-cache will use all the files we have written in v1.
//to update cache go in applications- unregister sw, on load page icon rightclick and select empty cache hard--- then again load refresh page to load sw