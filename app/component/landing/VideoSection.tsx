"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = useTranslations("landing.demo");
  const featureKeys = [
    "features.quick_setup",
    "features.deep_focus_mode",
    "features.insightful_analytics",
  ];

  const handlePlay = () => {
    setIsPlaying(true);
  };

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
            {/* Part 1 normal */}
            {t("header_part_one")} {/* Part 2 gradient */}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              {t("header_part_two")}
            </span>
          </h2>

          {/* Subtitle with gradient or muted style */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="max-container"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-card to-muted border border-border shadow-2xl shadow-primary/20">
            {!isPlaying ? (
              // Video Placeholder with Play Button
              <div className="absolute-inset flex-center-all">
                <div className="absolute-inset bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />

                <motion.button
                  className="relative z-10 w-20 h-20 bg-foreground/10 backdrop-blur-md rounded-full flex-center-all border border-border group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlay}
                >
                  <Play
                    className="w-8 h-8 text-foreground ml-1 group-hover:text-primary transition-colors"
                    fill="currentColor"
                  />
                </motion.button>

                <div className="absolute-inset flex-center-all">
                  <motion.div
                    className="w-32 h-32 border-2 border-border rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            ) : (
              // Actual Video
              <video
                className="w-full h-full object-cover"
                autoPlay
                controls
                src="/mp4/demo/focusflowdemo.mp4" // <-- your public/demo/demo.mp4
              />
            )}

            {/* Overlay Text */}
            {!isPlaying && (
              <div className="absolute bottom-8 left-8">
                <p className="text-foreground/80 text-sm">
                  {t("subtitle_two")}
                </p>
                <p className="text-foreground">{t("subtitle_three")}</p>
              </div>
            )}
          </div>

          {/* Features / Highlights below video */}

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {featureKeys.map((key, index) => (
              <div
                key={t(`${key}.title`)}
                className="text-center p-4 border border-border rounded-xl bg-card/50"
              >
                <motion.h3
                  className="text-xl font-semibold text-foreground mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  {t(`${key}.title`)}
                </motion.h3>
                <motion.p
                  className="text-muted-foreground text-sm"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  {t(`${key}.description`)}
                </motion.p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
