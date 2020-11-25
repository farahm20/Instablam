self.addEventListener('install', function(event){
    console.log('service worker: install');
});

self.addEventListener('fetch', function(event){
    console.log('service worker: fetch');
});
