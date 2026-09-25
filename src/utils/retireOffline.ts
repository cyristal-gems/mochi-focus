// Remove only Mochi's previous offline registration; preserve study localStorage.
export async function retireOffline() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const base = new URL(import.meta.env.BASE_URL, document.baseURI);
    const workerUrl = new URL("sw.js", base).href;
    for (const registration of await navigator.serviceWorker.getRegistrations()) {
      const ownWorker = [
        registration.active,
        registration.waiting,
        registration.installing,
      ].some((worker) => worker?.scriptURL === workerUrl);
      if (registration.scope === base.href && ownWorker)
        await registration.unregister();
    }
    if ("caches" in window) {
      const prefix = `mochi-offline:${base.pathname}:`;
      for (const name of await caches.keys())
        if (name.startsWith(prefix)) await caches.delete(name);
    }
  } catch {
    /* Storage restrictions must not prevent normal online use. */
  }
}
