"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isOnboardingComplete } from "@/lib/storage";

const EXEMPT_PATHS = ["/onboarding", "/cuaca"];

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (EXEMPT_PATHS.includes(pathname)) return;
    if (!isOnboardingComplete()) {
      router.replace("/onboarding");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
