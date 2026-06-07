import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";

export const metadata: Metadata = {
  title: "Circle — Vivi la città insieme",
  description: "Scopri cosa fanno i tuoi amici e organizza la prossima uscita.",
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="it"><body><main className="safe-top mx-auto min-h-dvh max-w-md overflow-hidden px-4 pb-28">{children}</main><BottomNav /></body></html>;
}
