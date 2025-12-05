"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Target, User } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeModeToggle } from "./ThemeModeToggle"; // <-- import new component

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

  const isSessionActive = pathname === "/active-session";

  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        className="
          border border-border/50 backdrop-blur-xl
          rounded-full px-6 py-3 flex items-center gap-8 
          transition-all duration-300
          bg-white/80 dark:bg-card/80
        "
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onMouseEnter={() => isSessionActive && setIsExpanded(true)}
        onMouseLeave={() => isSessionActive && setIsExpanded(false)}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">FocusFlow</span>
        </motion.div>

        {/* Desktop nav links */}
        {!isSessionActive && (
          <div className="hidden md:flex gap-6">
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        )}

        {/* Right controls */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto relative">
          <LanguageSelector />
          <ThemeModeToggle /> {/* <-- new component for dark/light mode */}

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
              >
                <Link
                  href="/settings"
                  className="px-4 py-2 text-sm hover:bg-primary/5 block"
                >
                  Settings
                </Link>
                <button className="px-4 py-2 text-sm hover:bg-primary/5 w-full text-left">
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>
    </div>
  );
}
