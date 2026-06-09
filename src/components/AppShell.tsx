"use client";

import { BottomNav } from "@/components/BottomNav";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PanicProvider } from "@/contexts/PanicContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PanicProvider>
      <div className="min-h-screen bg-background pb-32">
        <main className="mx-auto max-w-lg">{children}</main>
        <BottomNav />
        <InstallPrompt />
      </div>
    </PanicProvider>
  );
}
