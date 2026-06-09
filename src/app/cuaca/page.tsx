"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const FORECAST = [
  { day: "Sel", temp: "31°", icon: "⛅" },
  { day: "Rab", temp: "30°", icon: "🌧️" },
  { day: "Kam", temp: "32°", icon: "☀️" },
  { day: "Jum", temp: "31°", icon: "⛅" },
  { day: "Sab", temp: "29°", icon: "🌧️" },
];

export default function CuacaPage() {
  const router = useRouter();
  const tapCount = useRef(0);
  const tapTimer = useRef<NodeJS.Timeout | null>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    document.title = "Cuaca Jakarta";
    window.history.replaceState(null, "", "/cuaca");

    const update = () => {
      setTime(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleIconTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 1500);

    if (tapCount.current >= 3) {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 text-white">
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-light">Jakarta</h1>
            <p className="text-sm opacity-80">{time} WIB</p>
          </div>
          <button
            onClick={handleIconTap}
            className="text-5xl"
            aria-label="Cuaca"
          >
            ⛅
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-8xl font-thin mb-2">32°</p>
          <p className="text-lg opacity-90">Berawan Sebagian</p>
          <p className="text-sm opacity-70 mt-1">
            Terasa seperti 35°
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Kelembapan", value: "78%" },
            { label: "Angin", value: "12 km/j" },
            { label: "UV", value: "Sedang" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white/20 backdrop-blur-sm p-4 text-center"
            >
              <p className="text-xs opacity-70 mb-1">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        <h2 className="text-sm font-medium opacity-80 mb-3">
          Prakiraan 5 Hari
        </h2>
        <div className="flex justify-between rounded-2xl bg-white/20 backdrop-blur-sm p-4">
          {FORECAST.map((day) => (
            <div key={day.day} className="text-center">
              <p className="text-xs opacity-70 mb-1">{day.day}</p>
              <p className="text-2xl mb-1">{day.icon}</p>
              <p className="text-sm font-medium">{day.temp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
