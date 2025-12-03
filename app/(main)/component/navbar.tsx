"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { Target, Sun, Moon, User } from "lucide-react";
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
  const [darkMode, setDarkMode] = useState(true);

  // Profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className={`border border-border/50 backdrop-blur-xl bg-background/60 rounded-full px-6 py-3 flex items-center gap-8 transition-all duration-300 ${
          isScrolled ? "bg-white/80 dark:bg-card/80" : "bg-background/60"
        }`}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="logo-icon from-primary to-secondary flex items-center justify-center">
            <Target className="w-5 h-5 text-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">FocusFlow</span>
        </motion.div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors cursor-pointer ${
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

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto relative">
          <LanguageSelector selected={language} onChange={setLanguage} />

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-accent/20 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Profile Dropdown */}
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
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
              >
                <Link
                  href="/settings"
                  className="px-4 py-2 text-sm text-foreground hover:bg-primary/5 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="px-4 py-2 text-sm text-foreground hover:bg-primary/5 w-full text-left transition-colors"
                  onClick={() => {
                    setProfileOpen(false);
                    alert("Logging out...");
                  }}
                >
                  Logout
                </button>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-foreground"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
      </nav>
    </div>
  );
}
