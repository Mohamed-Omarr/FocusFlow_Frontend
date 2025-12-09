"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TaskCreator() {
  const router = useRouter();
  const [taskName, setTaskName] = useState("");
  const [timerDuration, setTimerDuration] = useState<"30" | "60" | "custom">("30");
  const [customMinutes, setCustomMinutes] = useState("");
  const [breakTime, setBreakTime] = useState("");

  const handleStartSession = () => {
    if (!taskName.trim()) {
      alert("Please enter a task name");
      return;
    }

    const duration =
      timerDuration === "custom"
        ? Math.max(Number.parseInt(customMinutes) || 30, 1)
        : Number.parseInt(timerDuration);

    const breakDuration = Math.min(Number.parseInt(breakTime) || 0, 15);

    // Store task data in sessionStorage
    sessionStorage.setItem(
      "currentTask",
      JSON.stringify({
        name: taskName.trim(),
        duration,
        breakDuration,
      })
    );

    router.push("/active-session");
  };

  return (
    <div className="w-80 bg-card rounded-3xl p-6 border border-border shadow-lg">
      <h2 className="text-xl font-semibold text-foreground mb-6">Create New Task</h2>

      {/* Task Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Task Name
        </label>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="e.g., Study Math"
          className="w-full px-4 py-3 bg-elevated border border-border rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-colors"
        />
      </div>

      {/* Timer Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Timer Duration (optional)
        </label>
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTimerDuration("30")}
            className={`flex-1 px-4 py-3 rounded-2xl border transition-all ${
              timerDuration === "30"
                ? "bg-primary/20 border-primary text-primary"
                : "bg-elevated border-border text-foreground hover:border-primary/50"
            }`}
          >
            30 min
          </button>
          <button
            onClick={() => setTimerDuration("60")}
            className={`flex-1 px-4 py-3 rounded-2xl border transition-all ${
              timerDuration === "60"
                ? "bg-primary/20 border-primary text-primary"
                : "bg-elevated border-border text-foreground hover:border-primary/50"
            }`}
          >
            1 hr
          </button>
          <button
            onClick={() => setTimerDuration("custom")}
            className={`flex-1 px-4 py-3 rounded-2xl border transition-all ${
              timerDuration === "custom"
                ? "bg-primary/20 border-primary text-primary"
                : "bg-elevated border-border text-foreground hover:border-primary/50"
            }`}
          >
            Custom
          </button>
        </div>
        {timerDuration === "custom" && (
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Enter minutes"
            className="w-full px-4 py-3 bg-elevated border border-border rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-colors"
            min={1}
          />
        )}
      </div>

      {/* Break Time */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Break Length (optional, max 15 min)
        </label>
        <input
          type="number"
          value={breakTime}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value);
            if (value <= 15 || e.target.value === "") {
              setBreakTime(e.target.value);
            }
          }}
          placeholder="e.g., 5"
          className="w-full px-4 py-3 bg-elevated border border-border rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none transition-colors"
          min={0}
          max={15}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Break occurs every 30 minutes
        </p>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartSession}
        className="w-full px-6 py-4 bg-primary rounded-2xl font-semibold hover:bg-primary/90 transition-all duration-300 glow-primary"
      >
        Start Focus Session
      </button>
    </div>
  );
}
