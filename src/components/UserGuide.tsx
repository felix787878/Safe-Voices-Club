"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X } from "lucide-react";
import { UserGuidePoster } from "@/components/UserGuidePoster";

export function UserGuide() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-2 ring-white/30 transition-transform hover:scale-105 active:scale-95 dark:ring-gray-800/50"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="Buka panduan penggunaan aplikasi"
      >
        <BookOpen className="h-5 w-5" />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="guide-overlay" role="dialog" aria-modal="true" aria-label="Panduan Penggunaan">
            <button
              type="button"
              className="guide-overlay-close"
              onClick={() => setOpen(false)}
              aria-label="Tutup panduan"
            >
              <X className="h-5 w-5" />
            </button>
            <UserGuidePoster />
          </div>,
          document.body
        )}
    </>
  );
}
