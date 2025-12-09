import type { Metadata } from "next";
import type React from "react";
import { Navbar } from "./component/Navbar";
import { SupportButton } from "./component/Support-Button";

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

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="structure-layout-style ">
        {children}
        <SupportButton />
      </main>
    </>
  );
}
