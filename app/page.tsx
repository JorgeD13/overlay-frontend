"use client"

import { useEffect, useState } from "react";

const BACKEND_URL = "https://overlay-backend.onrender.com";

export default function App() {
  const [message, setMessage] = useState("Esperando notificaciones...");

  useEffect(() => {
    const eventSource = new EventSource(`${BACKEND_URL}/stream`);

    eventSource.onmessage = (event) => {
      setMessage(event.data);
    };

    return () => {
      eventSource.close(); // Cerrar la conexión al desmontar
    };
  }, []);

  return (
    <div>
      <h1>Notificaciones</h1>
      <p>{message}</p>
    </div>
  );
}
