"use client"
import { useEffect, useState } from "react";

const BACKEND_URL = "https://overlay-backend.onrender.com"
//const BACKEND_URL = "http://127.0.0.1:5000"

export default function App() {
  const [message, setMessage] = useState("Esperando mensaje...");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(BACKEND_URL + "/get_message");
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };

    const interval = setInterval(fetchMessage, 3000); // Consulta cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Último mensaje recibido:</h1>
      <p>{message}</p>
    </div>
  );
}
