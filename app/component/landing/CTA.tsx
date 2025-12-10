"use client";

import { motion } from "motion/react";
import { ArrowRight, Globe } from "lucide-react";
import { WaitlistForm } from "./WaitingList";

export function CTA() {
  return (
    <section className="section-wrapper">
      {/* Background decorations */}
      <div className="absolute-inset">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
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
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"
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

      <div className="container-wrapper">
        <motion.div
          className="max-container"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative bg-gradient-to-br from-card to-muted border border-border rounded-3xl p-12 md:p-16 overflow-hidden shadow-2xl">
            {/* Gradient overlay */}
            <div className="absolute-inset bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

            <div className="relative z-10 text-center">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
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

              {/* <motion.p
                className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Start your focus journey today and join thousands of users
                building better habits
              </motion.p> */}

              {/* BUTTONS */}
              {/* <motion.div
                className="flex-col sm:flex-row flex-center-all gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary btn-text rounded-xl shadow-lg shadow-primary/30"
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 20px 40px rgba(60, 130, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex flex-center gap-2">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>

                <motion.button
                  className="px-8 py-4 bg-foreground/5 border border-border text-foreground rounded-xl backdrop-blur-sm hover:bg-foreground/10 hover:border-border/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </motion.div> */}

              {/* WAITLIST INSERTED HERE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mt-12"
              >
                <WaitlistForm />
              </motion.div>

              <motion.div
                className="flex-center-all gap-2 text-muted-foreground mt-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Globe className="w-4 h-4" />
                <p className="text-sm">
                  Available in Arabic, Turkish, and English
                </p>
              </motion.div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary to-transparent opacity-20 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary to-transparent opacity-20 rounded-tr-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
