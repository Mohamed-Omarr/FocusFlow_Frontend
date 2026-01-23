"use client";

import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { AlertCircle } from "lucide-react";
import { useMemo } from "react";

type WeeklyDistractionRow = {
  distractions: string[] | null;
};

export default function DistractionAnalysis() {
  const {
    data: response,
    isLoading,
    isError,
  } = useAxiosGet<WeeklyDistractionRow[]>(
    ["weekly-distractions"],
    "/user/weekly-distractions"
  );

  /* ---------------- AGGREGATION ---------------- */
  const {
    items,
    totalDistractions,
    affectedSessionsPercent,
  } = useMemo(() => {
    if (!response || response.length === 0) {
      return {
        items: [],
        totalDistractions: 0,
        affectedSessionsPercent: 0,
      };
    }

    const counts: Record<string, number> = {};
    let affectedSessions = 0;

    response.forEach((row) => {
      if (!row.distractions || row.distractions.length === 0) return;

      affectedSessions++;

      row.distractions.forEach((d) => {
        counts[d] = (counts[d] || 0) + 1;
      });
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    const items = Object.entries(counts)
      .map(([name, times]) => ({
        name,
        times,
        percent: Math.round((times / total) * 100),
        width: Math.round((times / total) * 100),
      }))
      .sort((a, b) => b.times - a.times);

    return {
      items,
      totalDistractions: total,
      affectedSessionsPercent: Math.round(
        (affectedSessions / response.length) * 100
      ),
    };
  }, [response]);

  /* ---------------- STATES ---------------- */
  if (isLoading) {
    return (
      <div className="bg-card/50 rounded-3xl p-8 border border-border">
        <p className="text-sm text-muted-foreground">Loading distractions…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card/50 rounded-3xl p-8 border border-border">
        <p className="text-sm text-destructive">
          Failed to load distraction data
        </p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl p-8 border border-orange-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Distraction Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Identify what's breaking your focus this week
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Understanding your distraction patterns is the first step to improving
        focus.
      </p>

      <div className="space-y-4 mb-6">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No distractions recorded this week 🎉
          </p>
        )}

        {items.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {item.times} times
                </span>
                <span className="text-sm font-semibold text-orange-500">
                  {item.percent}%
                </span>
              </div>
            </div>

            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                style={{ width: `${item.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-orange-500/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Total Distractions
          </span>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-500">
              {totalDistractions}
            </div>
            <div className="text-xs text-muted-foreground">
              {affectedSessionsPercent}% of sessions affected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
