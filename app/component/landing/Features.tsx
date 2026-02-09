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
      color: "from-primary to-secondary",
      emoji: "⏱️",
    },
    {
      icon: TrendingUp,
      title: t("ai_analytics.title"),
      description: t("ai_analytics.description"),
      color: "from-secondary to-accent",
      emoji: "📊",
    },
    {
      icon: Flame,
      title: t("habit_streaks.title"),
      description: t("habit_streaks.description"),
      color: "from-accent to-primary",
      emoji: "🔥",
    },
    {
      icon: Bell,
      title: t("smart_reminders.title"),
      description: t("smart_reminders.description"),
      color: "from-primary to-accent",
      emoji: "🔔",
    },
  ];

  return (
    <section id="features" className="section-wrapper">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[150px]" />

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
              <div className="relative flex flex-col flex-center  h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 group-hover:border-border/50 group-hover:shadow-xl group-hover:shadow-primary/10">
                {/* Icon */}
                <motion.div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color}  flex-center-all mb-4`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-3xl">{feature.emoji}</span>
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-center">
                  {feature.description}
                </p>

                {/* Hover gradient overlay */}
                <div
                  className={`absolute-inset rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
