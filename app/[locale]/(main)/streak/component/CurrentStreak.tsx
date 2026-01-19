"use client";
import { TrendingUp } from "lucide-react";

export default function CurrentStreak({
  currentStreak,
}: {
  currentStreak: number;
}) {
  return (
    <div className="bg-card rounded-3xl p-8 border border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Current Streak
          </h2>
        </div>

        <div className="flex items-center justify-center my-8">
          <div className="relative">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-accent glow-primary flex items-center justify-center">
              <div className="w-36 h-36 rounded-full bg-card flex flex-col items-center justify-center">
                <div className="text-5xl font-bold text-primary">
                  {currentStreak}
                </div>
                <div className="text-sm text-muted-foreground mt-1">days</div>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 text-4xl">🔥</div>
          </div>
        </div>

        <p className="text-center text-muted-foreground">
          {currentStreak === 0 ? (
            <>Start your first streak today 🚀</>
          ) : currentStreak === 1 ? (
            <>
              Great start! You've begun your streak with{" "}
              <span className="text-primary font-semibold">1 day</span>.
            </>
          ) : (
            <>
              Keep going! You've been consistent for{" "}
              <span className="text-primary font-semibold">
                {currentStreak} days
              </span>
              .
            </>
          )}
        </p>

        <p className="text-center text-sm text-accent mt-2">
          You're building great focus habits!
        </p>
      </div>
    </div>
  );
}
