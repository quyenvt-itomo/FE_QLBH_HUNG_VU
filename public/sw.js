self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});


// ✅ Nhận message từ React
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || !data.type) return;

  if (data.type === "SHOW_NOTIFICATION") {
    const { title, options } = data.payload;

    self.registration.showNotification(title, {
      body: options?.body || "",
      icon: "/logo.svg",
      // badge: "/logo.svg",
      requireInteraction: true, // ✅ không tự biến mất
      data: options?.url || "/", // ✅ bổ sung để click mở link
    });
  }
});


// ✅ Nhận push từ SERVER (webpush)
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const title = data.title || "Thông báo";
  const options = {
    body: data.body || "",
    icon: "/logo.svg",
    // badge: "/badge.svg",
    data: data.url || "/", // ✅ dùng để click mở link
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


// ✅ Xử lý khi click vào notification
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data || "/");
    })
  );
});
