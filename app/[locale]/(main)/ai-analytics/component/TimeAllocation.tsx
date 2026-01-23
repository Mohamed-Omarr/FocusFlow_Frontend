"use client";

import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { cn } from "@/lib/utils";

type TimeAllocationRow = {
  category: string;
  total_focus_minutes: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  Work: "from-cyan-500 to-blue-500",
  Study: "from-emerald-500 to-teal-500",
  Personal: "from-amber-500 to-orange-500",
};

/* 🔹 Format time smartly */
function formatFocusTime(minutes: number) {
  if (minutes < 60) {
    return {
      value: minutes,
      unit: "min",
    };
  }

  return {
    value: Number((minutes / 60).toFixed(1)),
    unit: "hours",
  };
}

export default function TimeAllocation() {
  const {
    data: response,
    isLoading,
    isError,
  } = useAxiosGet<TimeAllocationRow[]>(
    ["time-allocation"],
    "/user/time-allocation",
  );

  if (isLoading) {
    return (
      <div className="bg-card/50 rounded-3xl p-8 border border-border">
        <p className="text-muted-foreground">Loading time allocation…</p>
      </div>
    );
  }

  if (isError || !response || response.length === 0) {
    return (
      <div className="bg-card/50 rounded-3xl p-8 border border-border">
        <p className="text-muted-foreground">
          No time allocation data available.
        </p>
      </div>
    );
  }

  const totalMinutes = response.reduce(
    (sum, row) => sum + row.total_focus_minutes,
    0,
  );

  const rows = response.map((row) => {
    const percent =
      totalMinutes === 0
        ? 0
        : Math.round((row.total_focus_minutes / totalMinutes) * 100);

    return {
      category: row.category,
      time: formatFocusTime(row.total_focus_minutes),
      percent,
      width: percent,
      color:
        CATEGORY_COLORS[row.category] ??
        "from-muted-foreground to-muted",
    };
  });

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border">
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Time Allocation Overview
      </h2>
      <p className="text-muted-foreground mb-8">
        Total time spent this week by task type
      </p>

      <div className="space-y-6">
        {rows.map((item) => (
          <div key={item.category}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-foreground">
                {item.category}
              </span>

              <div className="text-right">
                <span className="text-xl font-bold text-foreground">
                  {item.time.value} {item.time.unit}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({item.percent}%)
                </span>
              </div>
            </div>

            <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all bg-gradient-to-r",
                  item.color,
                )}
                style={{ width: `${item.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
