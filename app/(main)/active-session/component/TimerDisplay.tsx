"use client";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  isOnBreak: boolean;
}

export function TimerDisplay({ minutes, seconds, isOnBreak }: TimerDisplayProps) {
  return (
    <div className="relative mb-16">
      <div
        className={`absolute inset-0 rounded-full opacity-30 blur-3xl animate-pulse ${
          isOnBreak
            ? "bg-gradient-to-br from-secondary via-accent to-secondary"
            : "bg-gradient-to-br from-primary via-secondary to-accent"
        }`}
      />
      <div
        className={`relative w-80 h-80 rounded-full bg-elevated border-2 flex items-center justify-center ${
          isOnBreak
            ? "border-secondary/30 glow-secondary"
            : "border-primary/30 glow-primary"
        }`}
      >
        <div className="text-center text-7xl font-mono font-bold text-foreground">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
