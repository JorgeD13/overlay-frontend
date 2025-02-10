"use client"

import { useEffect, useState } from "react";

interface Notification {
  date: string;
  app: string;
  title: string;
  text: string;
}

export default function NotificationOverlay() {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("http://TU_IP_O_DOMINIO:5000/stream");

    eventSource.onmessage = (event) => {
      setNotification(JSON.parse(event.data));
      
      // Ocultar después de 5 segundos
      setTimeout(() => setNotification(null), 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="fixed top-5 right-5 p-4 bg-black text-white rounded-lg shadow-lg transition-opacity duration-500" style={{ opacity: notification ? 1 : 0 }}>
      {notification ? (
        <div>
          <h3 className="text-lg font-bold">{notification.title}</h3>
          <p className="text-sm">{notification.text}</p>
        </div>
      ) : (
        <p className="text-sm">Esperando notificaciones...</p>
      )}
    </div>
  );
}
