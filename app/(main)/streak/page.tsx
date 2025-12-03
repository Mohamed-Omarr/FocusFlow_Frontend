"use client";
import { useState } from "react";
import { TrendingUp, Award, Calendar,  Lightbulb } from "lucide-react";

export default function StreaksPage() {
  const [currentStreak] = useState(5);
  const [totalStars] = useState(24);
  const [longestStreak] = useState(12);

  // Mock data for weekly calendar
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyData = [
    { day: "Mon", score: 85, active: true },
    { day: "Tue", score: 78, active: true },
    { day: "Wed", score: 92, active: true },
    { day: "Thu", score: 88, active: true },
    { day: "Fri", score: 81, active: true },
    { day: "Sat", score: 0, active: false },
    { day: "Sun", score: 0, active: false },
  ];

  // Mock milestones
  const milestones = [
    {
      id: 1,
      title: "7-day Streak",
      description: "Consistency Badge",
      achieved: false,
      icon: "🔥",
    },
    {
      id: 2,
      title: "5-day Streak",
      description: "Building Momentum",
      achieved: true,
      icon: "⭐",
    },
    {
      id: 3,
      title: "25 Stars Earned",
      description: "Star Collector",
      achieved: false,
      icon: "✨",
    },
    {
      id: 4,
      title: "1 Hour Focus",
      description: "Deep Work Badge",
      achieved: true,
      icon: "🎯",
    },
  ];

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return "from-primary to-accent";
    if (score >= 70) return "from-secondary to-primary";
    if (score >= 50) return "from-accent/50 to-secondary/50";
    return "from-muted to-muted";
  };

  return (
    <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          Your Progress
        </h1>
        <p className="text-muted-foreground">
          Track your focus journey and celebrate your achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Current Streak Card */}
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
                    <div className="text-sm text-muted-foreground mt-1">
                      days
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 text-4xl">🔥</div>
              </div>
            </div>

            <p className="text-center text-muted-foreground">
              Keep going! You've been consistent for{" "}
              <span className="text-primary font-semibold">
                {currentStreak} days
              </span>
              .
            </p>
            <p className="text-center text-sm text-accent mt-2">
              You're building great focus habits!
            </p>
          </div>
        </div>

        {/* Stars & Achievements Card */}
        <div className="bg-card rounded-3xl p-8 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">
              Stars Earned
            </h2>
          </div>

          <div className="flex items-center justify-center my-8">
            <div className="relative">
              {/* Circular progress ring */}
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
                  strokeDasharray={`${(totalStars / 100) * 553} 553`}
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

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">
                  {totalStars}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20">
              <span className="text-sm text-muted-foreground">
                Next milestone
              </span>
              <span className="text-sm font-semibold text-foreground">
                25 stars ✨
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Earn 2 stars per 30-min session</span>
            </div>
          </div>
          {/* End of redesign */}

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
      </div>

      {/* Weekly Progress Overview */}
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

      {/* Milestones & Achievements */}
      <div className="bg-card rounded-3xl p-8 border border-border mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Milestones</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className={`p-6 rounded-2xl border transition-all ${
                milestone.achieved
                  ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30"
                  : "bg-muted/20 border-border/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{milestone.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {milestone.description}
                  </p>
                  {milestone.achieved && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-medium">
                      <span>✓</span> Achieved
                    </div>
                  )}
                  {!milestone.achieved && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Keep going to unlock this badge!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Section & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-3xl p-8 border border-secondary/20">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">
              Keep Building
            </h2>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            "Small steps every day make a big difference. Your brain thanks you
            for showing up consistently."
          </p>
          <p className="text-sm text-accent">
            You're more focused in the mornings — try morning sessions to
            continue your streak!
          </p>
        </div>
      </div>
    </main>
  );
}
