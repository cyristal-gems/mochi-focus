/* Replaced with the build's asset list and content hash. */
const VERSION = '__VERSION__';
const FILES = __FILES__;
const ROOT = self.registration.scope;
const PREFIX = `mochi-offline:${new URL(ROOT).pathname}:`;
const CACHE = PREFIX + VERSION;
const URLS = FILES.map(file => new URL(file, ROOT).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)));
});
// Updates wait until existing tabs close, so an active study session is never reloaded.
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== new URL(ROOT).origin) return;
  const navigation = request.mode === 'navigate' && (url.pathname === new URL(ROOT).pathname || url.pathname === new URL('index.html', ROOT).pathname);
  const key = navigation ? new URL('index.html', ROOT).href : url.origin + url.pathname;
  if (!URLS.includes(key)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const response = await cache.match(key);
    if (!response) return fetch(request);
    const range = request.headers.get('range');
    if (!range) return response;
    // HTML media elements can request byte ranges even while playing local loops.
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    const bytes = await response.arrayBuffer();
    const length = bytes.byteLength;
    if (!match || (!match[1] && !match[2])) return new Response(null, {status:416,headers:{'Content-Range':`bytes */${length}`}});
    const start = match[1] ? Number(match[1]) : Math.max(0, length - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), length - 1) : length - 1;
    if (start > end || start >= length) return new Response(null, {status:416,headers:{'Content-Range':`bytes */${length}`}});
    const headers = new Headers(response.headers);
    headers.set('Content-Range', `bytes ${start}-${end}/${length}`);
    headers.set('Content-Length', String(end-start+1));
    headers.set('Accept-Ranges', 'bytes');
    return new Response(bytes.slice(start,end+1), {status:206,headers});
  })());
});
