const C='traore-transfer-v27',CORE=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'],EXTRA=['./haba-fintech-bg.webp','./icon-512-maskable.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(async c=>{await c.addAll(CORE);await Promise.all(EXTRA.map(u=>c.add(u).catch(()=>{})))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith(caches.open(C).then(async c=>{const m=await c.match(r,{ignoreSearch:true});const net=fetch(r).then(res=>{if(res.status===200)c.put(r,res.clone()).catch(()=>{});return res}).catch(()=>null);return m||(await net)||c.match('./index.html')}))});
