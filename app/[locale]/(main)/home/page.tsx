"use client";

import { TaskListSection } from "./component/TaskListSection";

export default function HomePage() {
  // Array of tips
  const tips = [
    "Short sessions lead to long term consistency.",
    "Eliminate distractions before starting your focus session.",
    "Break tasks into smaller chunks to avoid burnout.",
    "Review your progress at the end of each session.",
    "Stay hydrated to maintain concentration."
  ];

  // Compute tip index based on current hour
  const currentHour = new Date().getHours(); // 0–23
  const tipIndex = currentHour % tips.length;
  const currentTip = tips[tipIndex];

  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-3xl mx-auto gap-8">
      {/* Greeting */}
      <div className="text-center">
        <div className="text-5xl mb-4">🌘</div>
        <h2 className="text-4xl font-semibold text-foreground mb-2">
          Start a Focus Session
        </h2>
        <p className="text-muted-foreground mt-2">
          Select a task below to begin
        </p>
      </div>

      {/* Task List Section */}
      <div className="w-full">
        <TaskListSection />
      </div>

      {/* Tip of the Day */}
      <div className="w-full bg-card rounded-3xl p-8 border border-border shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          Tip of the hour
        </h3>
        <p className="text-lg text-foreground leading-relaxed">
          {currentTip}
        </p>
      </div>
    </div>
  );
}
