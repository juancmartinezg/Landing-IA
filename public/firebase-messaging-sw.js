importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: "AIzaSyBIAuESVxgqQRallMBGSZ3EDBP1S_2jIBU",
  authDomain: "clientesbot-fa065.firebaseapp.com",
  projectId: "clientesbot-fa065",
  storageBucket: "clientesbot-fa065.firebasestorage.app",
  messagingSenderId: "29526887196",
  appId: "1:29526887196:web:8b3a633976cdc16f5148d9"
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'clientes.bot';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: { url: payload.data?.url || '/dashboard/chat' }
  };
  return self.registration.showNotification(title, options);
});
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});