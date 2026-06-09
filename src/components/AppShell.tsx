"use client";

import { BottomNav } from "@/components/BottomNav";
import { PanicFAB } from "@/components/PanicFAB";
import { QuickExit } from "@/components/QuickExit";
import { PrivacyFooter } from "@/components/PrivacyFooter";
import { InstallPrompt } from "@/components/InstallPrompt";
import { PanicProvider } from "@/contexts/PanicContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PanicProvider>
      <div className="min-h-screen bg-background pb-32">
        <main className="mx-auto max-w-lg">{children}</main>
        <PrivacyFooter />
        <QuickExit />
        <PanicFAB />
        <BottomNav />
        <InstallPrompt />
      </div>
    </PanicProvider>
  );
}
