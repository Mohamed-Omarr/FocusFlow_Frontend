"use client";

import DistractionAnalysis from "./component/DistractionAnalysis";
import MonthlyFocusScore from "./component/MonthlyFocusScore";
import SmartSuggestions from "./component/SmartSuggestions";
import TimeAllocation from "./component/TimeAllocation";
import TotalFocusTime from "./component/TotalFocusTime";
import WeeklyFocusScore from "./component/WeeklyFocusScore";

export default function AIAnalyticsPage() {
  return (
    <div>
      <main>
        {/* Header */}
        <div
          className="
    mb-8
    border border-border/50
    backdrop-blur-xl
    bg-background/60
    rounded-full
    px-6
    py-3
  "
        >
          <h1 className="text-2xl font-bold text-foreground">
            Analytics
            <br />
            <span className="text-sm font-normal text-muted-foreground">
              Calm, meaningful insights into your focus patterns and
              productivity habits
            </span>
          </h1>
        </div>

        {/* Focus Scores Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Focus Score */}
          <WeeklyFocusScore />

          {/* Monthly Focus Score */}
          <MonthlyFocusScore />
        </div>

        {/* Total Focus Time & Distraction Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Total Focus Time */}
          <TotalFocusTime />
          {/* Distraction Analysis */}
          <DistractionAnalysis />
        </div>

        {/* Time Allocation Overview */}
        <TimeAllocation />
        {/* Smart Suggestions */}
        <SmartSuggestions />
      </main>
    </div>
  );
}
