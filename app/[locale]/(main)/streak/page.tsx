"use client";
import { useState } from "react";
import { Lightbulb } from "lucide-react";
import CurrentStreak from "./component/CurrentStreak";
import StarsEarned from "./component/StarsEarned";
import WeeklyProgress from "./component/WeeklyProgress";
import Milestones from "./component/Milestones";

export default function StreaksPage() {
  const [currentStreak] = useState(5);
  const [totalStars] = useState(24);
  const [longestStreak] = useState(12);

  // Mock data
  const weeklyData = [
    { day: "Mon", score: 85, active: true },
    { day: "Tue", score: 78, active: true },
    { day: "Wed", score: 92, active: true },
    { day: "Thu", score: 88, active: true },
    { day: "Fri", score: 81, active: true },
    { day: "Sat", score: 0, active: false },
    { day: "Sun", score: 0, active: false },
  ];

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

  return (
    <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8 border border-border/50 backdrop-blur-xl bg-background/60 rounded-full px-6 py-3">
        <h1 className="text-2xl font-bold text-foreground">
          Your Progress
          <br />
          <span className="text-sm font-normal text-muted-foreground">
            Track your focus journey and celebrate your achievements
          </span>
        </h1>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CurrentStreak currentStreak={currentStreak} />

        <StarsEarned
          totalStars={totalStars}
          longestStreak={longestStreak}
          nextStarMilestone={{
            title: "25 Stars ✨",
            targetStars: 25,
          }}
          earningRule="Earn 1 star to completed focus session"
        />
      </div>

      <WeeklyProgress weeklyData={weeklyData} />
      <Milestones milestones={milestones} />

      {/* Motivation */}
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
