"use client";
import { motion } from "motion/react";
import { Target } from "lucide-react";
import { ThemeModeToggle } from "@/app/(main)/component/ThemeModeToggle";
import LangSwitcher from "../LangSwitcher";

export function Header() {
  const navItems = ["Home", "Features", "Analytics"];

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <motion.header
        className="border border-border/50 backdrop-blur-xl bg-background/60 rounded-full px-6 py-3"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-center gap-8">
          {/* Logo */}
          <motion.div
            className="flex flex-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="logo-icon from-primary to-secondary  flex-center-all">
              <Target className="w-5 h-5 btn-text" />
            </div>
            <span className="text-lg font-bold text-foreground">FocusFlow</span>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex md:flex-center  gap-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().trim()}`}
                className="small-muted-text hover:text-foreground transition-colors cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          {/* Mobile Menu + Language Selector */}
          <div className="flex flex-center gap-2 md:gap-4">
            {/* Language Selector */}
            <LangSwitcher />
            <ThemeModeToggle />

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
        </div>
      </motion.header>
    </div>
  );
}
