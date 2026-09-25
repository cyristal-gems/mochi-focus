// Retire the earlier offline worker for anyone who loaded that build.
// This worker never caches requests or provides offline behavior.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const prefix = `mochi-offline:${new URL(self.registration.scope).pathname}:`;
      for (const name of await caches.keys()) {
        if (name.startsWith(prefix)) await caches.delete(name);
      }
      await self.registration.unregister();
    })(),
  );
});
