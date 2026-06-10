"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// SVG Illustrations
// ─────────────────────────────────────────────────────────────

function HeartRibbonIllustration() {
  return (
    <svg
      viewBox="0 0 160 160"
      width="140"
      height="140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="80" cy="78" r="64" fill="#F8D7E8" />
      <path
        d="M80 114C46 91 24 68 32 46c5-14 20-18 32-9 6 5 11 12 16 20 5-8 10-15 16-20 12-9 27-5 32 9 8 22-14 45-48 68z"
        fill="#27AE60"
      />
      <path
        d="M80 114c-8 14-20 24-26 33"
        stroke="#5DCB7A"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M80 114c8 13 20 22 28 32"
        stroke="#1A8A45"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PanicIllustration() {
  return (
    <svg
      viewBox="0 0 160 160"
      width="140"
      height="140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="80" cy="78" r="64" fill="#E8DCF5" />
      {/* Ripple rings */}
      <circle cx="80" cy="78" r="58" stroke="#E74C3C" strokeWidth="1" opacity="0.15" />
      <circle cx="80" cy="78" r="47" stroke="#E74C3C" strokeWidth="1.5" opacity="0.28" />
      <circle cx="80" cy="78" r="36" stroke="#E74C3C" strokeWidth="2" opacity="0.45" />
      {/* Phone body */}
      <rect x="62" y="36" width="36" height="62" rx="6" fill="#6C3483" />
      <rect x="66" y="42" width="28" height="46" rx="3" fill="#9B59B6" />
      <circle cx="80" cy="93" r="3" fill="#C39BD3" />
      {/* Screen lines */}
      <line x1="70" y1="52" x2="90" y2="52" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="70" y1="58" x2="84" y2="58" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      {/* Tap progress dots */}
      <circle cx="68" cy="120" r="5" fill="#E74C3C" />
      <circle cx="80" cy="122" r="5" fill="#E74C3C" />
      <circle cx="92" cy="120" r="5" fill="#E74C3C" opacity="0.25" />
    </svg>
  );
}

function MapIllustration() {
  return (
    <svg
      viewBox="0 0 160 160"
      width="140"
      height="140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="80" cy="78" r="64" fill="#C8E6D2" />
      {/* Map base */}
      <rect x="32" y="44" width="96" height="70" rx="7" fill="#A8D8BC" />
      {/* Grid lines */}
      <line x1="32" y1="64" x2="128" y2="64" stroke="#7EC49A" strokeWidth="1" />
      <line x1="32" y1="84" x2="128" y2="84" stroke="#7EC49A" strokeWidth="1" />
      <line x1="32" y1="101" x2="128" y2="101" stroke="#7EC49A" strokeWidth="0.7" strokeDasharray="3 2" />
      <line x1="55" y1="44" x2="55" y2="114" stroke="#7EC49A" strokeWidth="1" />
      <line x1="80" y1="44" x2="80" y2="114" stroke="#7EC49A" strokeWidth="1" />
      <line x1="105" y1="44" x2="105" y2="114" stroke="#7EC49A" strokeWidth="1" />
      {/* Emergency pin (red) */}
      <path
        d="M80 96C80 96 69 84 69 77c0-6.1 4.9-11 11-11s11 4.9 11 11c0 7-11 19-11 19z"
        fill="#E74C3C"
      />
      <circle cx="80" cy="77" r="4.5" fill="white" />
      {/* Safe pins (green) */}
      <path
        d="M55 72C55 72 48 64 48 60c0-4.4 3.1-8 7-8s7 3.6 7 8c0 4-7 12-7 12z"
        fill="#27AE60"
        opacity="0.85"
      />
      <path
        d="M105 98C105 98 98 90 98 86c0-4.4 3.1-8 7-8s7 3.6 7 8c0 4-7 12-7 12z"
        fill="#27AE60"
        opacity="0.6"
      />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Slide data
// ─────────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 0,
    illustrationBg: "#FCEEF6",
    eyebrow: "Tentang Safe Voices Club",
    title: "Kamu Tidak Sendirian",
    description:
      ""Bersama kita lebih aman. Platform pelaporan dan keselamatan untuk semua pengguna Indonesia."",
    Illustration: HeartRibbonIllustration,
  },
  {
    id: 1,
    illustrationBg: "#F0EAF8",
    eyebrow: "Fitur Zona Panik",
    title: "Panik? 3 Ketukan Saja",
    description:
      "Ketuk layar 3 kali atau goyangkan HP untuk langsung menghubungi 112 dan mengirim lokasimu ke kontak darurat.",
    Illustration: PanicIllustration,
  },
  {
    id: 2,
    illustrationBg: "#E8F5EE",
    eyebrow: "Peta Komunitas",
    title: "Jaga Sesama, Bersama",
    description:
      "Pantau laporan kejadian di sekitarmu secara real-time dan bantu lindungi orang lain.",
    Illustration: MapIllustration,
  },
] as const;

const INTERVAL_MS = 4000;

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function FeatureCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        setDirection(1);
        return (prev + 1) % SLIDES.length;
      });
    }, INTERVAL_MS);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % SLIDES.length) + SLIDES.length) % SLIDES.length;
      setDirection(next >= current ? 1 : -1);
      setCurrent(next);
    },
    [current]
  );

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) goTo(current + (dx > 0 ? 1 : -1));
    startTimer();
  };

  const slide = SLIDES[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: "0%", opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="w-full px-4 pb-6">
      {/* Card */}
      <div
        className="rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Illustration area */}
        <div className="relative h-48 overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: slide.illustrationBg }}
            >
              <slide.Illustration />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text area */}
        <div className="px-5 pt-4 pb-5 bg-white dark:bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <p className="text-[10.5px] font-medium tracking-widest uppercase text-purple-700 dark:text-purple-400 mb-1">
                {slide.eyebrow}
              </p>
              <h3 className="text-[17px] font-semibold text-gray-900 dark:text-white leading-snug mb-2">
                {slide.title}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {slide.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-3 items-center">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              goTo(i);
              startTimer();
            }}
            className="h-[6px] rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            style={{
              width: i === current ? 20 : 6,
              backgroundColor: i === current ? "#6C3483" : "#D1D5DB",
            }}
            aria-label={`Lihat slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
