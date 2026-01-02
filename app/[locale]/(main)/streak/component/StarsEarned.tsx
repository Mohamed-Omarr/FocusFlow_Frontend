"use client";
import { Award } from "lucide-react";

type NextStarMilestone = {
  title: string;
  targetStars: number;
};

type StarsEarnedProps = {
  totalStars: number;
  longestStreak: number;
  nextStarMilestone?: NextStarMilestone;
  earningRule?: string; // purely informational
};

export default function StarsEarned({
  totalStars,
  longestStreak,
  nextStarMilestone,
  earningRule,
}: StarsEarnedProps) {
  const target = nextStarMilestone?.targetStars ?? totalStars;
  const progress = Math.min(totalStars / target, 1);
  const circumference = 2 * Math.PI * 88; // ≈ 553

  return (
    <div className="bg-card rounded-3xl p-8 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-secondary" />
        <h2 className="text-lg font-semibold text-foreground">Stars Earned</h2>
      </div>

      {/* Progress Ring */}
      <div className="flex items-center justify-center my-8">
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#starGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${progress * circumference} ${circumference}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient
                id="starGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">
              {totalStars}
            </div>
            {nextStarMilestone && (
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <span>⭐</span>
                <span>/ {target}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      {nextStarMilestone && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20">
            <span className="text-sm text-muted-foreground">
              Next milestone
            </span>
            <span className="text-sm font-semibold text-foreground">
              {nextStarMilestone.title}
            </span>
          </div>

          {earningRule && (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>{earningRule}</span>
            </div>
          )}
        </div>
      )}

      {/* Longest Streak */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Longest Streak
          </span>
          <span className="text-lg font-semibold text-foreground">
            {longestStreak} days 🏆
          </span>
        </div>
      </div>
    </div>
  );
}
