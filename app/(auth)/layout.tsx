import type { Metadata } from "next";
import type React from "react";
import { SupportButton } from "../(main)/component/support-button";
import { Header } from "../component/landing/Header";

export const metadata: Metadata = {
  title: "FocusFlow - Stay Present, Stay Focused",
  description: "A mindful focus tracking app with AI-powered insights",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="structure-layout-auth-style ">
        {children}
      </main>
    </>
  );
}
