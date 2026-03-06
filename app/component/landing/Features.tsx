"use client";
import { motion } from "motion/react";
import { Timer, TrendingUp, Flame, Bell } from "lucide-react";
import { useTranslations } from "next-intl";

export function Features() {
  const t = useTranslations("landing.features");

  const features = [
    {
      icon: Timer,
      title: t("focus_sessions.title"),
      description: t("focus_sessions.description"),
    },
    {
      icon: TrendingUp,
      title: t("ai_analytics.title"),
      description: t("ai_analytics.description"),
    },
    {
      icon: Flame,
      title: t("habit_streaks.title"),
      description: t("habit_streaks.description"),
    },
    {
      icon: Bell,
      title: t("smart_reminders.title"),
      description: t("smart_reminders.description"),
    },
  ];

  return (
    <section id="features" className="section-wrapper border-t border-border">
      {/* Background decoration */}
      <div className="container-wrapper">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading-two">
            {t("heading.part1")}{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("heading.part2")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subheading")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Card */}
              <div className="relative flex flex-col items-center h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 group-hover:border-border/50 group-hover:shadow-xl hover:shadow-lg">
                {/* Icon */}
                <motion.div
                  className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-4"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <feature.icon className="w-8 h-8 text-primary" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-center">
                  {feature.description}
                </p>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}