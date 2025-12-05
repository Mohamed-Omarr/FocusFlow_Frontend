import "./styles/global.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import { Toaster } from "@/components/ui/sonner"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FocusFlow - Stay Present, Stay Focused",
  description: "A mindful focus tracking app with AI-powered insights",
  // generator: "v0.app",
  // icons: {
  //   icon: [
  //     { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
  //     { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
  //     { url: "/icon.svg", type: "image/svg+xml" },
  //   ],
  //   apple: "/apple-icon.png",
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistMono.variable} ${geistSans.variable} antialiased  `}
      >
        {children}
        <Toaster position="top-center"/>
      </body>
    </html>
  );
}
