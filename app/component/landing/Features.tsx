import { motion } from "motion/react";
import { Timer, TrendingUp, Flame, Bell } from "lucide-react";

const features = [
  {
    icon: Timer,
    title: "Focus Sessions",
    description: "Custom timers for focused work and breaks.",
    color: "from-primary to-secondary",
    emoji: "⏱️",
  },
  {
    icon: TrendingUp,
    title: "AI Analytics",
    description: "Smart insights into your productivity patterns.",
    color: "from-secondary to-accent",
    emoji: "📊",
  },
  {
    icon: Flame,
    title: "Habit Streaks",
    description: "Stay consistent with simple daily streaks.",
    color: "from-accent to-primary",
    emoji: "🔥",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Timely nudges to keep you on track.",
    color: "from-primary to-accent",
    emoji: "🔔",
  },
];


export function Features() {
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
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              stay focused
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you achieve deep work without
            overwhelming you
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
              <div className="relative h-full bg-card border border-border rounded-2xl p-6 transition-all duration-300 group-hover:border-border/50 group-hover:shadow-xl group-hover:shadow-primary/10">
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
                <p className="text-muted-foreground leading-relaxed">
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
