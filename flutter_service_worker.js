'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "3964d900e9c6ffb4c03dfeeb97da38f0",
"assets/assets/icons/arrow-left.svg": "16693cfd81752ccf1e91c0c41ae2ac20",
"assets/assets/icons/arrow-square-down.svg": "efc59e44972d13469524fe79979060b7",
"assets/assets/icons/case.svg": "ffe3a518d2def73a7dc17baba416c28d",
"assets/assets/icons/edit-2.svg": "d18127dd01c4e47b0b8d59c02a221e11",
"assets/assets/icons/eye.svg": "98f58a2c5e38e0318ad1d05f0983e340",
"assets/assets/icons/eye_slash.svg": "39e72fd2ece2a0237e3eb4c991ac921b",
"assets/assets/icons/info-circle.svg": "eff3831cb50d6e224e217a287ec7dc12",
"assets/assets/icons/lock.svg": "80343ce48b4173e90a32f37ad5c8a9a9",
"assets/assets/icons/logout.svg": "ff57f4980ee36c20f973dc5c4619bafa",
"assets/assets/icons/message-question.svg": "41755a364fb025fb6dc8b58c780dea9a",
"assets/assets/icons/more-square.svg": "45274d922f0eba2bb15166f38a496a8e",
"assets/assets/icons/profile-2user.svg": "278f83d942851f738d42aa3e8a038a44",
"assets/assets/icons/search.svg": "e0a83720ee506545382b6d842561f473",
"assets/assets/icons/sms.svg": "efeb843ae041b722a0ee5c9d98c78f1e",
"assets/assets/icons/trash.svg": "7041296444e4875bfb32bd796c3680e4",
"assets/assets/icons/unlock.svg": "efb5a849dee785f53e7781081137502b",
"assets/assets/icons/x.svg": "574068ab0044c55986fa9ce1e814c484",
"assets/assets/img/background.png": "cb33f8030ea856f74f2898683293261c",
"assets/assets/img/image_placeholder.png": "28a81226adbe1e8f55b0a1fb050718af",
"assets/assets/img/logo.png": "16fdad860b90e68e23c2afd28ba12cf8",
"assets/assets/img/no_internet.svg": "570807a64538ac935f4ed856dbe8618c",
"assets/assets/img/preloader_image.png": "aa2b5b0f8969864df96abeddf9bb3557",
"assets/assets/img/server_error.svg": "919f7c98fff12757e456d1b8d3c6b8bd",
"assets/assets/img/server_updates.svg": "cc74070407d43abc06304d7c8d93c4b5",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "6089fa3863ef18b3fabd9d57174f0d62",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.ico": "91c021eaadf01e8a85d14c5d7a1e5e48",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"icons/Icon-192.png": "242475508fcdd8c1464e9e4f44ca0dc6",
"icons/Icon-512.png": "e1753a4b8778e362aa76b8fadb752f8e",
"icons/Icon-maskable-192.png": "242475508fcdd8c1464e9e4f44ca0dc6",
"icons/Icon-maskable-512.png": "e1753a4b8778e362aa76b8fadb752f8e",
"index.html": "3ba6583422e80ca2c2c61f661e6015f8",
"/": "3ba6583422e80ca2c2c61f661e6015f8",
"main.dart.js": "8e4dfd9055dbd304443ed395309e013b",
"manifest.json": "1b8b430561929d83545cce3fbef32585",
"version.json": "f17a5dfc4313683197cb81fb19eaae8c"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
