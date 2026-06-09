"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePanic } from "@/contexts/PanicContext";

const TAP_WINDOW_MS = 1500;
const REQUIRED_TAPS = 3;
const SHAKE_WINDOW_MS = 2000;
const REQUIRED_SHAKES = 3;
const SHAKE_THRESHOLD = 25;

export function PanicZone() {
  const { triggerPanic } = usePanic();
  const [tapCount, setTapCount] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [shakeSupported, setShakeSupported] = useState(true);
  const tapTimestamps = useRef<number[]>([]);
  const shakeTimestamps = useRef<number[]>([]);
  const lastAccel = useRef({ x: 0, y: 0, z: 0 });

  const activatePanic = useCallback(() => {
    if (isActivated) return;
    setIsActivated(true);
    triggerPanic();
  }, [isActivated, triggerPanic]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    tapTimestamps.current = [
      ...tapTimestamps.current.filter((t) => now - t < TAP_WINDOW_MS),
      now,
    ];
    const count = tapTimestamps.current.length;
    setTapCount(count);

    if (count >= REQUIRED_TAPS) {
      activatePanic();
    }
  }, [activatePanic]);

  useEffect(() => {
    if (typeof DeviceMotionEvent === "undefined") {
      setShakeSupported(false);
      return;
    }

    const requestPermission = async () => {
      const DME = DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DME.requestPermission === "function") {
        try {
          const permission = await DME.requestPermission();
          if (permission !== "granted") {
            setShakeSupported(false);
            return false;
          }
        } catch {
          setShakeSupported(false);
          return false;
        }
      }
      return true;
    };

    let active = true;

    requestPermission().then((granted) => {
      if (!granted || !active) return;

      const handleMotion = (e: DeviceMotionEvent) => {
        const acc = e.accelerationIncludingGravity;
        if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

        const dx = Math.abs(acc.x - lastAccel.current.x);
        const dy = Math.abs(acc.y - lastAccel.current.y);
        const dz = Math.abs(acc.z - lastAccel.current.z);
        const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);

        lastAccel.current = { x: acc.x, y: acc.y, z: acc.z };

        if (magnitude > SHAKE_THRESHOLD) {
          const now = Date.now();
          shakeTimestamps.current = [
            ...shakeTimestamps.current.filter((t) => now - t < SHAKE_WINDOW_MS),
            now,
          ];
          if (shakeTimestamps.current.length >= REQUIRED_SHAKES) {
            activatePanic();
          }
        }
      };

      window.addEventListener("devicemotion", handleMotion);
      return () => window.removeEventListener("devicemotion", handleMotion);
    });

    return () => {
      active = false;
    };
  }, [activatePanic]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="px-4 pb-4" style={{ minHeight: "60vh" }}>
      <motion.button
        onClick={handleTap}
        className={`relative w-full rounded-2xl min-h-[250px] flex flex-col items-center justify-center text-white overflow-hidden ${
          isActivated
            ? "bg-gradient-to-br from-danger to-red-900"
            : "bg-gradient-to-br from-primary to-purple-900"
        }`}
        animate={
          !prefersReducedMotion && !isActivated
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(108, 52, 131, 0.4)",
                  "0 0 0 12px rgba(108, 52, 131, 0)",
                ],
              }
            : {}
        }
        transition={
          !prefersReducedMotion
            ? { duration: 1.5, repeat: Infinity }
            : {}
        }
      >
        <h2 className="text-4xl font-black tracking-wider mb-2">PANIK?</h2>
        <p className="text-sm opacity-90 mb-6">
          Ketuk 3x Cepat atau Goyangkan HP
        </p>

        <div className="relative flex items-center justify-center mb-6">
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border-2 border-white/30"
              style={{
                width: 60 + ring * 30,
                height: 60 + ring * 30,
              }}
              animate={
                !prefersReducedMotion
                  ? { scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: ring * 0.3,
              }}
            />
          ))}
          <div className="relative z-10 h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl">👆</span>
          </div>
        </div>

        <div className="flex gap-3">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`h-4 w-4 rounded-full transition-all ${
                tapCount >= dot
                  ? "bg-white scale-125"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {!shakeSupported && (
          <p className="text-xs opacity-60 mt-4 px-4 text-center">
            Goyangan mungkin tidak tersedia di browser ini
          </p>
        )}
      </motion.button>
    </div>
  );
}
