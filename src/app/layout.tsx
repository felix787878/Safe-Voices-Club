import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OnboardingGuard } from "@/components/OnboardingGuard";
import favicon from "./favicon.png";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Safe Voices Club - Lindungi Dirimu",
  description:
    "Aplikasi keselamatan personal untuk pengguna Indonesia. Lindungi Dirimu, Jaga Sesama.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: favicon.src, type: "image/png" }],
    apple: [{ url: favicon.src, type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Safe Voices Club",
  },
};

export const viewport: Viewport = {
  themeColor: "#6C3483",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <OnboardingGuard>{children}</OnboardingGuard>
      </body>
    </html>
  );
}
