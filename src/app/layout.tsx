import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

import GlobalClickSound from "@/components/GlobalClickSound";
import BackgroundMusic from "@/components/BackgroundMusic";
import SmoothScroll from "@/components/SmoothScroll";

const archivo = Archivo({ subsets: ["latin"] });

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
      <body className={archivo.className} suppressHydrationWarning>
        <SmoothScroll />
        <GlobalClickSound />
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
