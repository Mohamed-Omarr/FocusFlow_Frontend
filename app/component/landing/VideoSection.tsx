"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export function VideoSection() {
  const t = useTranslations("landing.demo");

  return (
    <section id="analytics" className="section-wrapper border-t border-border">
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
        <div className="mt-12 max-w-4xl mx-auto">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
          >
            <div className="aspect-video w-full bg-muted">
              <video
                muted
                controls
                className="h-full w-full object-cover"
                src="/mp4/demo/focusflowdemo1.mp4"
              />
            </div>

            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                See FocusFlow in Action
              </h3>

              <p className="text-muted-foreground max-w-xl mx-auto">
                Plan your focus session, stay on track, and review your
                productivity insights — all in one simple workflow.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
