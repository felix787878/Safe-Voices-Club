"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/lib/storage";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEYS.INSTALL_DISMISSED) === "true") return;

    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 30000);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEYS.INSTALL_DISMISSED, "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white px-4 py-3 shadow-lg">
      <div className="mx-auto max-w-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Download className="h-5 w-5 shrink-0" />
          <span>Pasang aplikasi Safe Voices Club di perangkat Anda</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {deferredPrompt && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleInstall}
              className="text-primary"
            >
              Pasang
            </Button>
          )}
          <button
            onClick={handleDismiss}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
