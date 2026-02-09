"use client";

import { motion } from "motion/react";
import {  Globe } from "lucide-react";
import { WaitlistForm } from "./WaitingList";

export function CTA() {
  return (
    <section className="section-wrapper relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute-inset pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-primary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="container-wrapper relative">
        <motion.div
          className="max-container"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="
              relative
              bg-gradient-to-br
              from-card
              to-muted
              border
              border-border
              rounded-2xl sm:rounded-3xl
              p-2 sm:p-10 lg:p-16
              overflow-hidden
              shadow-2xl
            "
          >
            {/* Gradient overlay */}
            <div className="absolute-inset bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

            <div className="relative z-10 text-center">
              <motion.h2
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Ready to transform{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  your productivity?
                </span>
              </motion.h2>

              {/* WAITLIST */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mt-8 sm:mt-10 lg:mt-12"
              >
                <WaitlistForm />
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-2 text-muted-foreground mt-8 sm:mt-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Globe className="w-4 h-4" />
                <p className="text-xs sm:text-sm">
                  Available in Arabic, Turkish, and English
                </p>
              </motion.div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-primary to-transparent opacity-20 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-tr from-secondary to-transparent opacity-20 rounded-tr-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
