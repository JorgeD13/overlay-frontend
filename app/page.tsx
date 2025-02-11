"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BACKEND_URL = "https://overlay-backend.onrender.com/get_message";
// const BACKEND_URL = "http://127.0.0.1:5000/get_message";

export default function TwitchAlert() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [lastTime, setLastTime] = useState(""); // Para evitar repetir mensajes
  const [total, setTotal] = useState(0); // Estado para el valor total

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(BACKEND_URL);
        const data = await response.json();

        if (data.message && data.time && data.total !== undefined && data.time !== lastTime) {
          setMessage(data.message);
          setLastTime(data.time);
          setTotal(data.total); // Actualizar total
          setVisible(true);
          setTimeout(() => setVisible(false), 5000);
        }
      } catch (error) {
        console.error("Error al obtener el mensaje:", error);
      }
    };

    const interval = setInterval(fetchMessage, 5000);
    return () => clearInterval(interval);
  }, [lastTime]);

  // Para el círculo de progreso
  const circleRadius = 40;
  const circumference = 2 * Math.PI * circleRadius;
  const progress = Math.min(total, 100); // Límite de 100
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center">
      {/* Círculo de progreso */}
      <div className="relative w-24 h-24 mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Fondo del círculo */}
          <circle
            cx="50"
            cy="50"
            r={circleRadius}
            fill="none"
            stroke="#ddd"
            strokeWidth="10"
          />
          {/* Progreso del círculo */}
          <circle
            cx="50"
            cy="50"
            r={circleRadius}
            fill="none"
            stroke="purple"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          {/* Texto en el centro */}
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="black"
          >
            {progress.toFixed(1)}
          </text>
        </svg>
      </div>

      {/* Mensaje emergente */}
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
