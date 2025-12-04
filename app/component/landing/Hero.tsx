import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="hero-section">
      {/* Gradient Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-48 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="container-wrapper">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                FocusFlow — Your Calm{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Productivity Companion
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-muted-foreground max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Track your focus, build habits, and improve your productivity,
              without pressure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl overflow-hidden shadow-lg shadow-primary/30"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(60, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex flex-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-secondary to-primary"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
          </div>

          {/* Right Content - Hero Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
              <Image src={"/team.jpg"} alt="image" height={500} width={500} className="w-full h-full" />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Floating Cards */}
            <motion.div
              className="absolute -top-4 -right-4 bg-card backdrop-blur-lg border border-border rounded-2xl p-4 shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex flex-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex-center-all">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Focus Time</p>
                  <p className="text-foreground">4h 32m</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 bg-card backdrop-blur-lg border border-border rounded-2xl p-4 shadow-xl"
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <div className="flex flex-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent  flex-center-all">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-foreground">12 Days</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
