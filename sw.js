self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick', event => {
  event.notification.close();
  let target = new URL('./', self.registration.scope);
  const raw = event.notification.data && event.notification.data.url;
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const candidate = new URL(raw, self.registration.scope);
      if (candidate.origin === self.location.origin && candidate.pathname.startsWith(new URL(self.registration.scope).pathname)) target = candidate;
    } catch (_) {}
  }
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async windows => {
    const matching = windows.find(client => client.url === target.href);
    if (matching) return matching.focus();
    return self.clients.openWindow(target.href);
  }));
});
