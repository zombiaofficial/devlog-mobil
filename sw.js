// Uygulamanın kendisini önbellekte tutar: internet yokken de açılır.
const AD='devlog-1.0.2';
self.addEventListener('install',e=>{ e.waitUntil(caches.open(AD).then(c=>c.addAll(['./','manifest.webmanifest','ikon-192.png']))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==AD).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin||e.request.method!=='GET') return;   // GitHub API isteklerine karışma
  e.respondWith(fetch(e.request).then(r=>{ const k=r.clone(); caches.open(AD).then(c=>c.put(e.request,k)); return r; })
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));
});
