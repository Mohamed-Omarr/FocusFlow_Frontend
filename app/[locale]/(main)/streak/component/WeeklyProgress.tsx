"use client";
import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { Calendar } from "lucide-react";

type SessionRow = {
  created_at: string;
};

export default function WeeklyProgress() {
  const {
    data: sessions = [],
    isLoading,
    isError,
    error,
  } = useAxiosGet<SessionRow[]>(["WeeklySession"], "/user/weekly-sessions");

  /* ---------------- HELPERS ---------------- */

  const toISODate = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate())
      .toISOString()
      .split("T")[0];

  /* ---------------- BUILD LAST 7 DAYS ---------------- */

  const today = new Date();

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));

    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      iso: toISODate(d),
    };
  });

  /* ---------------- SESSION DAY SET ---------------- */

  const sessionDaySet = new Set(
    sessions.map((s) => s.created_at.split("T")[0]),
  );

  /* ---------------- STATES ---------------- */

  if (isLoading) {
    return (
      <div className="bg-card rounded-3xl p-8 border border-border mb-8 text-center text-sm text-muted-foreground">
        Loading weekly progress…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-card rounded-3xl p-8 border border-border mb-8 text-center text-sm text-destructive">
        {error?.message || "Failed to load weekly progress"}
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-card rounded-3xl p-8 border border-border mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-foreground">
          This Week&apos;s Progress
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {last7Days.map((day) => {
          const isActive = sessionDaySet.has(day.iso);
          return (
            <div key={day.iso} className="flex flex-col items-center gap-2">
              <div className="text-sm text-muted-foreground">{day.label}</div>

              <div
                title={isActive ? "Active" : "Rest day"}
                className={`w-full h-24 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-br from-primary to-accent hover:scale-105"
                    : "bg-muted/30 border border-dashed border-border hover:[]"
                }`}
              />

              {isActive && <div className="text-lg">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
