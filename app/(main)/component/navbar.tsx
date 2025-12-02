"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSelector } from "./LanguageSelector";

const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/task-planner", label: "Task Planner" },
  { href: "/sessions", label: "Sessions" },
  { href: "/streak", label: "Streak" },
  { href: "/ai-analytics", label: "AI-Analytics" },
  { href: "/settings", label: "Settings" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState("EN");

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 border-b border-border backdrop-blur-md transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-card/80" : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-6 px-6 py-4 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-semibold text-foreground mr-auto">FocusFlow</h1>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-medium transition-colors ${
              isActive(link.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        ))}

        <LanguageSelector selected={language} onChange={setLanguage} />
      </div>
    </nav>
  );
}
