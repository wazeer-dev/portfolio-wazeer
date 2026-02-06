import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Archivo, Playfair_Display } from "next/font/google";
import "./globals.css";

import GlobalClickSound from "@/components/GlobalClickSound";
import BackgroundMusic from "@/components/BackgroundMusic";
import SmoothScroll from "@/components/SmoothScroll";
import LoadingScreen from "@/components/LoadingScreen";

const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Wazeer T Portfolio",
  description: "Antigravity Interfaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.className} ${playfair.variable}`} suppressHydrationWarning>
        <LoadingScreen />
        <SmoothScroll />
        <GlobalClickSound />
        <BackgroundMusic />

        {/* Global Grain & Grayscale Overlay */}
        <div className="fixed inset-0 z-[100] pointer-events-none mix-blend-overlay">
          {/* Noise Texture */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
          {/* Ink Splash Overlay */}
          <img
            src="/412951520_a5432dab-c6b7-4f58-8bf1-fc244511e311.jpg"
            alt="Texture Overlay"
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
          />
        </div>

        {/* Global Grayscale Backdrop - Allows elements to pop out via z-index */}
        <div className="fixed inset-0 z-[40] pointer-events-none backdrop-grayscale" />

        <div className="antialiased selection:bg-white selection:text-black">
          {children}
        </div>

        <SpeedInsights />
      </body>
    </html>
  );
}
