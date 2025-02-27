/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/


self.addEventListener('push', async function (event) {
    console.log('Push event received:', event);
    let data = await event.data.json();
    console.log(data);
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/img/header_icon1.png',
        dir: "rtl",
        lang: "en-US",
        vibrate: [200, 100, 200],
    });
});

// Optional: Handle notification click event
self.addEventListener('notificationclick', event => {
    event.notification.close();
    // Customize behavior (e.g., open a URL) on click
    event.waitUntil(clients.openWindow('/'));
});
