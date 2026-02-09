'use client'
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function Hero() {
  return (
    <section id="home" className="hero-section relative overflow-hidden">
      {/* Gradient Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-48 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.25, 0.4, 0.25] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Main layout */}
      <div className="relative flex flex-col lg:flex-row gap-16 lg:justify-center lg:gap-0">
        {/* LEFT — Main content */}
        <div className="max-w-2xl space-y-6 sm:space-y-8">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            FocusFlow
            <br />
            Your Calm
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Productivity Companion
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Track your focus, build habits, and improve your productivity —
            without pressure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl shadow-lg shadow-primary/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/login" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT — Floating text zone (now fades in) */}
        <motion.div
          className="relative hidden lg:block w-[360px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="absolute top-0 right-0 rounded-full border border-accent/20 bg-card/70 px-4 py-2 text-sm text-[color:var(--accent)] backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.4, delay: 0.6 },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            Focus that adapts to you
          </motion.div>

          <motion.div
            className="absolute top-20 right-10 rounded-full border border-[color:var(--brand-secondary)]/20 bg-card/70 px-4 py-2 text-sm text-[color:var(--brand-secondary)] backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { duration: 0.4, delay: 0.75 },
              y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            Built for focus, not burnout
          </motion.div>

          <motion.div
            className="absolute top-44 right-0 rounded-full border border-[color:var(--brand-tertiary)]/80 bg-card/70 px-4 py-2 text-sm text-[color:var(--brand-tertiary)] backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.4, delay: 0.9 },
              y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            Start where you are
          </motion.div>

          <motion.div
            className="absolute top-72 right-12 rounded-full border border-muted/30 bg-card/70 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{
              opacity: { duration: 0.4, delay: 1.05 },
              y: { duration: 9, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            Where change starts
          </motion.div>

          <motion.div
            className="absolute bottom-24 right-0 rounded-full border border-[color:var(--brand-quaternary)]/25 bg-card/70 px-4 py-2 text-sm text-[color:var(--brand-quaternary)] backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { duration: 0.4, delay: 1.2 },
              y: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            Consistent, not perfect
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
