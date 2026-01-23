"use client";

import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { Clock } from "lucide-react";

/* ---------------- utils ---------------- */

function formatFocusTime(hours: number) {
  if (hours >= 1) {
    return {
      value: hours.toFixed(1),
      unit: "hours",
    };
  }

  return {
    value: Math.round(hours * 60),
    unit: "minutes",
  };
}

/* ---------------- types ---------------- */

type FocusTimeStats = {
  week_focus_hours: number;
  week_focus_percent: number;
  total_focus_hours: number;
};

/* ---------------- component ---------------- */

export default function TotalFocusTime() {
  const {
    data: response,
    isLoading,
    isError,
  } = useAxiosGet<FocusTimeStats>(
    ["total-focus-time"],
    "/user/total-focus-time",
  );

  /* ---------- states ---------- */

  if (isLoading) {
    return (
      <div className="bg-card/50 rounded-3xl p-8 border border-border animate-pulse">
        <div className="h-6 w-40 bg-muted rounded mb-4" />
        <div className="h-12 w-32 bg-muted rounded mb-3" />
        <div className="h-3 w-full bg-muted rounded" />
      </div>
    );
  }

  if (isError || !response) {
    return (
      <div className="bg-card/50 rounded-3xl p-8 border border-border">
        <p className="text-sm text-muted-foreground">
          Unable to load focus time data.
        </p>
      </div>
    );
  }

  /* ---------- data ---------- */

  const { week_focus_hours, week_focus_percent, total_focus_hours } = response;

  const weekTime = formatFocusTime(week_focus_hours);
  const totalTime = formatFocusTime(total_focus_hours);

  // Visual bar should cap at 100%, but number can overflow
  const progressWidth = Math.min(week_focus_percent, 100);

  /* ---------- render ---------- */

  return (
    <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl p-8 border border-emerald-500/20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Clock className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Total Focus Time
          </h2>
          <p className="text-sm text-muted-foreground">
            Your productive time this week
          </p>
        </div>
      </div>

      {/* Main value */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-6xl font-bold text-emerald-600">
            {weekTime.value}
          </span>
          <span className="text-2xl text-muted-foreground">
            {weekTime.unit}
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          {week_focus_percent.toFixed(1)}% of weekly goal · {totalTime.value}{" "}
          {totalTime.unit} total
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
}
