// Firebase Cloud Messaging Service Worker
// Handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Initialize Firebase in service worker context
firebase.initializeApp({
  apiKey: "AIzaSyAsiLj2G16z35SAYVVo79_EJh3qy9X8zFE",
  authDomain: "journalist-2bf9e.firebaseapp.com",
  projectId: "journalist-2bf9e",
  storageBucket: "journalist-2bf9e.firebasestorage.app",
  messagingSenderId: "1048434393409",
  appId: "1:1048434393409:web:aca11459895da9872ca1c0"
});

const messaging = firebase.messaging();

// Handle background messages (when app is not in focus)
messaging.onBackgroundMessage((payload) => {
  console.log('[FCM SW] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/vite.svg',
    badge: payload.notification?.badge || '/vite.svg',
    data: payload.data,
    tag: payload.data?.notificationId || 'default',
    requireInteraction: false
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[FCM SW] Notification clicked:', event.notification);

  event.notification.close();

  // Extract URL from notification data
  const urlToOpen = event.notification.data?.url || '/';

  // Focus or open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (let client of windowClients) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
