"use client";

import { Shield } from "lucide-react";
import { usePanic } from "@/contexts/PanicContext";

export function PanicFAB() {
  const { triggerPanic } = usePanic();

  return (
    <button
      onClick={triggerPanic}
      className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-danger text-white shadow-lg shadow-danger/40 hover:bg-danger/90 active:scale-95 transition-transform"
      aria-label="Aktifkan mode panik"
    >
      <Shield className="h-7 w-7" />
    </button>
  );
}
