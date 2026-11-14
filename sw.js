const CACHE='traore-transfer-v67-audit-ui';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png','./icon-512-maskable.png','./login-reference-bg.webp','./login-background.webp','./accueil-background.webp','./haba-fintech-bg.webp'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.all(CORE.map(path=>cache.add(path).catch(()=>null)));await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('traore-transfer-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})())});
// Pages : réseau d'abord avec délai de 3 s (réseau lent ou absent), sinon version en cache.
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==self.location.origin)return;
if(req.mode==='navigate'||url.pathname.endsWith('/index.html')){event.respondWith((async()=>{const cache=await caches.open(CACHE);
const cached=()=>cache.match('./index.html').then(r=>r||cache.match('./'));
const net=fetch(req,{cache:'no-store'}).then(r=>{if(r&&r.ok){cache.put('./index.html',r.clone()).catch(()=>{});return r}throw new Error('bad')});
const timeout=new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),3000));
try{return await Promise.race([net,timeout])}catch(_){const c=await cached();if(c){net.catch(()=>{});return c}try{return await net}catch(e){return Response.error()}}})());return}
event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(req);if(cached)return cached;try{const fresh=await fetch(req);if(fresh.ok)cache.put(req,fresh.clone()).catch(()=>{});return fresh}catch(_){return Response.error()}})())});
