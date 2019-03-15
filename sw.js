const CACHE_DYNAMIC = 'dynamic';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open('static')
    .then( function(cache){
      cache.addAll([
        '/',
        '/index.html',
        '/add.css',
        '/app.js',
        '/add.js',
        '/feed.js',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
      ]);
    } )
  );
});
function clearCache(cacheName){
  caches.open(cacheName)
  .then(function (cache) {
    return cache.keys()
      .then(function (keys) {
        console.log(keys);
        keys.forEach(key=>{
          if(key.url.indexOf('https://randomuser.me/api/portraits') > -1){
          cache.delete(key);
          }
        })
      })
        // if (keys.length > maxItems) {
        //   console.log(keys);
        //   cache.delete(keys[0])
        //     .then(trimCache(cacheName, maxItems));
        // }
      // });
  })
}
  // caches.keys()
  //   .then(function (keyList) {
  //     return Promise.all(keyList.map(function (key) {
  //       if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
  //         console.log('[Service Worker] Removing old cache.', key);
  //         return caches.delete(key);
  //       }
  //     }));
  //   })

function trimCache(cacheName, maxItems) {
  caches.open(cacheName)
    .then(function (cache) {
      return cache.keys()
        .then(function (keys) {
          if (keys.length > maxItems) {
            console.log(keys);
            cache.delete(keys[0])
              .then(trimCache(cacheName, maxItems));
          }
        });
    })
}
self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ...', event);
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  const url = "https://randomuser.me/api/?results=4&nat=us";
  if(event.request.url.indexOf(url) > -1){
    console.log('I reach to network');
    event.respondWith( 
      caches.open(CACHE_DYNAMIC)
        .then(cache=>{
         return fetch(event.request)
          .then(res=>{
            clearCache(CACHE_DYNAMIC);
            // trimCache(CACHE_DYNAMIC,2);
            cache.put(event.request, res.clone());
            return res;
          })
        })
  
     )
  }
  else{
    event.respondWith( 
      caches.match(event.request)
      .then( function(response){
        if(response){
          return response;
        }
        else{
          return fetch(event.request)
          .then( function(res){
           return caches.open(CACHE_DYNAMIC)
           .then( function(cache){
            // trimCache(CACHE_DYNAMIC,2);
             cache.put(event.request.url, res.clone() );
             return res;
           } )
          } )
        }
      } )
     )
  }

});
// self.addEventListener('fetch', function(event) {

//   event.respondWith( 
//     caches.match(event.request)
//     .then( function(response){
//       if(response){
//         return response;
//       }
//       else{
//         return fetch(event.request)
//         .then( function(res){
//          return caches.open('dynamic')
//          .then( function(cache){
//            cache.put(event.request.url, res.clone() );
//            return res;
//          } )
//         } );
//       }
//     } )
//    )
// });
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//     .then(function(res){
//       return caches.open(CACHE_DYNAMIC)
//       .then(function(cache){
//         cache.put(event.request.url, res.clone());
//         console.log('Caching this ',res);
//         return res;
//       })
//     })
    
//     .catch(function(err){
//       console.log('It is from the cache ',event.request);
//       return caches.match(event.request);
//     })
//   );
// });