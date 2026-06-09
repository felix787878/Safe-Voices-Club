"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { PanicOverlay } from "@/components/PanicOverlay";

interface PanicContextType {
  triggerPanic: () => void;
  isPanicActive: boolean;
}

const PanicContext = createContext<PanicContextType>({
  triggerPanic: () => {},
  isPanicActive: false,
});

export function PanicProvider({ children }: { children: React.ReactNode }) {
  const [isPanicActive, setIsPanicActive] = useState(false);

  const triggerPanic = useCallback(() => {
    setIsPanicActive(true);
  }, []);

  const dismissPanic = useCallback(() => {
    setIsPanicActive(false);
  }, []);

  return (
    <PanicContext.Provider value={{ triggerPanic, isPanicActive }}>
      {children}
      {isPanicActive && <PanicOverlay onDismiss={dismissPanic} />}
    </PanicContext.Provider>
  );
}

export function usePanic() {
  return useContext(PanicContext);
}
