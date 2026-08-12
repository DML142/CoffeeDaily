import { ToastProvider } from "@coffee-daily/ui/Toast";
import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Cursor } from "@/motion/Cursor";
import { FooterReveal } from "@/motion/FooterReveal";
import { SmoothScrollProvider } from "@/motion/SmoothScrollProvider";
import "./globals.css";

const generalSans = localFont({
  src: [
    {
      path: "../../public/fonts/general-sans-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
  preload: false,
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "../../public/fonts/jetbrains-mono-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/jetbrains-mono-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Coffee Daily",
  description: "Order ahead, pick up at your location.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${generalSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-cd-paper font-body text-cd-ink antialiased">
        <ToastProvider>
          <Cursor />
          <Header />
          <MobileNav />
          <SmoothScrollProvider>
            <FooterReveal>{children}</FooterReveal>
          </SmoothScrollProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
