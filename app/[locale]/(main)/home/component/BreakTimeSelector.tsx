"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface BreakTimeSelectorProps {
  duration: number;
  breakMode: "auto" | "manual";
  setBreakMode: (mode: "auto" | "manual") => void;
}

export function BreakTimeSelector({
  duration,
  breakMode,
  setBreakMode,
}: BreakTimeSelectorProps) {
  const breakInfo = useMemo(() => {
    let breakDuration = 0;
    let numBreaks = 0;

    if (duration < 25) return { breakDuration, numBreaks, breakTimes: [] };
    else if (duration <= 60) {
      breakDuration = 5;
      numBreaks = duration <= 40 ? 1 : 2;
    } else if (duration <= 120) {
      breakDuration = 10;
      numBreaks = 2;
    } else if (duration <= 180) {
      breakDuration = 15;
      numBreaks = 3;
    } else if (duration <= 240) {
      breakDuration = 20;
      numBreaks = 4;
    } else if (duration <= 300) {
      breakDuration = 25;
      numBreaks = 5;
    } else {
      breakDuration = 25;
      numBreaks = 6;
    }

    const breakTimes = Array.from({ length: numBreaks }, (_, i) =>
      Math.round(((i + 1) / (numBreaks + 1)) * duration),
    );

    return { breakDuration, numBreaks, breakTimes };
  }, [duration]);

  if (breakInfo.numBreaks === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4"
    >
      {/* Mode buttons */}
      <div className="flex gap-3 mb-2">
        <Button
          variant={breakMode === "auto" ? "default" : "outline"}
          onClick={() => setBreakMode("auto")}
          className="flex-1 "
        >
          Auto Break
        </Button>
        <Button
          variant={breakMode === "manual" ? "default" : "outline"}
          onClick={() => setBreakMode("manual")}
          className="flex-1 "
        >
          Manual Break
        </Button>
      </div>

      {/* Break info card */}
      <div className="p-4 bg-card text-card-foreground border border-border rounded-2xl">
        <p className="text-sm font-medium text-foreground">
          Suggested Breaks: {breakInfo.numBreaks} break
          {breakInfo.numBreaks > 1 ? "s" : ""}, {breakInfo.breakDuration} min
          each
        </p>
        <p className="text-sm mt-1 text-foreground">
          Break times (minutes from start): {breakInfo.breakTimes.join(", ")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Current mode:{" "}
          <span className="font-semibold text-foreground">
            {breakMode === "auto" ? "Auto" : "Manual"}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
