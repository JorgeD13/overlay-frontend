"use client"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = "https://overlay-backend.onrender.com/get_message"
//const BACKEND_URL = "http://127.0.0.1:5000/get_message"

export default function TwitchAlert() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [lastMessage, setLastMessage] = useState(""); // Para evitar repetir mensajes

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(BACKEND_URL);
        const data = await response.json();
        
        if (data.message && data.message !== lastMessage) {
          setMessage(data.message);
          setLastMessage(data.message);
          setVisible(true);
          setTimeout(() => setVisible(false), 5000); // Se oculta después de 5s
        }
      } catch (error) {
        console.error("Error al obtener el mensaje:", error);
      }
    };

    // Hacer polling cada 5 segundos
    const interval = setInterval(fetchMessage, 5000);
    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [lastMessage]);

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
      <AnimatePresence>
        {visible && (
          <motion.div
            className="bg-purple-700 text-white text-3xl font-bold px-6 py-4 rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*
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
*/