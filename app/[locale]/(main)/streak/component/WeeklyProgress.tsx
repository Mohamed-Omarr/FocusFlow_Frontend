"use client";
import { Calendar } from "lucide-react";

export default function WeeklyProgress({ weeklyData }) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "from-primary to-accent";
    if (score >= 70) return "from-secondary to-primary";
    if (score >= 50) return "from-accent/50 to-secondary/50";
    return "from-muted to-muted";
  };
  return (
    <div className="bg-card rounded-3xl p-8 border border-border mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-foreground">
          This Week's Progress
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {weeklyData.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="text-sm text-muted-foreground">{day.day}</div>
            <div
              className={`w-full h-24 rounded-xl transition-all ${
                day.active
                  ? `bg-gradient-to-t ${getScoreColor(
                      day.score
                    )} hover:scale-105 cursor-pointer`
                  : "bg-muted/30 border border-dashed border-border"
              }`}
              title={day.active ? `Focus score: ${day.score}` : "Rest day"}
            >
              {day.active && (
                <div className="h-full flex items-end justify-center p-2">
                  <span className="text-xs font-semibold text-white">
                    {day.score}
                  </span>
                </div>
              )}
            </div>
            {day.active && <div className="text-lg">✓</div>}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-primary to-accent" />
          <span className="text-muted-foreground">High Focus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-secondary to-primary" />
          <span className="text-muted-foreground">Good Focus</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted/30 border border-border" />
          <span className="text-muted-foreground">Rest</span>
        </div>
      </div>
    </div>
  );
}
