import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OnboardingGuard } from "@/components/OnboardingGuard";

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
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <OnboardingGuard>{children}</OnboardingGuard>
      </body>
    </html>
  );
}
