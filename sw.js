const CACHE_NAME = 'ros2-dojo-v2';

const PRECACHE_URLS = [
  './',
  './index.html',
  './css/base.css',
  './css/print.css',
  './manifest.webmanifest',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
  './modules/actions.html',
  './modules/amcl.html',
  './modules/bag.html',
  './modules/bt.html',
  './modules/build.html',
  './modules/controllers.html',
  './modules/costmaps.html',
  './modules/dds.html',
  './modules/diagnostics.html',
  './modules/gazebo.html',
  './modules/launch.html',
  './modules/lifecycle.html',
  './modules/nav2.html',
  './modules/params.html',
  './modules/planners.html',
  './modules/pubsub.html',
  './modules/qos.html',
  './modules/recovery.html',
  './modules/services.html',
  './modules/slam.html',
  './modules/testing.html',
  './modules/tf.html',
  './modules/urdf.html'
  ,'./modules/moveit2.html'
  ,'./modules/moveit2_ompl.html'
  ,'./modules/moveit2_ik.html'
  ,'./modules/moveit2_cartesian.html'
  ,'./modules/moveit2_grasping.html'
  ,'./modules/cpp_robotics.html'
  ,'./modules/cpp_oop.html'
  ,'./modules/cpp_memory.html'
  ,'./modules/cpp_rclcpp.html'
  ,'./modules/cpp_nodes_pubsub.html'
  ,'./modules/cpp_smart_pointers.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse));
          return networkResponse;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
