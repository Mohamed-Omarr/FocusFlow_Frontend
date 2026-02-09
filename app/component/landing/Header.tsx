"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import LangSwitcher from "../LangSwitcher";
import { ModeToggle } from "@/components/theme-mode/ModeToggle";

export function Header() {
  const navItems = ["Features", "Analytics"];
  const authPath = ["Login"];
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
      <motion.header
        className="
          relative
          w-full
          max-w-[calc(100%-1rem)]
          sm:max-w-fit
          border border-border/50
          backdrop-blur-xl
          bg-background/60
          rounded-full
          px-4 sm:px-6
          py-2.5 sm:py-3
        "
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-base sm:text-lg font-bold text-foreground">
              FocusFlow
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
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
            {/* {authPath.map((item) => (
              <motion.a
                key={item}
                href={`/${item.toLowerCase().trim()}`}
                className="small-muted-text hover:text-foreground transition-colors cursor-pointer"
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))} */}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            <LangSwitcher />
            <ModeToggle />

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-foreground"
              onClick={() => setOpen((v) => !v)}
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
                  d={
                    open
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="
                absolute
                top-full
                left-0
                right-0
                mt-3
                md:hidden
                rounded-2xl
                border
                border-border
                bg-background
                shadow-2xl
                p-4
              "
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().trim()}`}
                    onClick={() => setOpen(false)}
                    className="
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-foreground
                      hover:bg-muted
                      transition-colors
                    "
                  >
                    {item}
                  </a>
                ))}
                {authPath.map((item) => (
                  <a
                    key={item}
                    href={`/${item.toLowerCase().trim()}`}
                    onClick={() => setOpen(false)}
                    className="
                      rounded-lg
                      px-3
                      py-2
                      text-sm
                      font-medium
                      text-foreground
                      hover:bg-muted
                      transition-colors
                    "
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}
