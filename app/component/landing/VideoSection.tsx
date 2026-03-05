"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export function VideoSection() {
  const t = useTranslations("landing.demo");

  return (
    <section id="analytics" className="section-wrapper">
      <div className="container-wrapper">
        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading-two">
            {t("header_part_one")}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              {t("header_part_two")}
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Two Video Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-muted shadow-2xl shadow-primary/10"
          >
            <div className="aspect-video w-full bg-muted">
              <video
                muted={true}
                className="h-full w-full object-cover"
                controls
                src="/mp4/demo/focusflowdemo1.mp4"
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Plan Your Focus Session
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Set up tasks, choose your timer duration, and receive
                personalized tips before diving into deep work.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="group overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-muted shadow-2xl shadow-primary/10"
          >
            <div className="aspect-video w-full bg-muted">
              <video
                muted={true}
                className="h-full w-full object-cover"
                controls
                src="/mp4/demo/focusflowdemo2.mp4"
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Track Your Progress
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                See how sessions and breaks keep you productive and build a
                consistent deep work habit over time.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
