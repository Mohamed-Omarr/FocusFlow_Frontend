"use client";
import { Lightbulb } from "lucide-react";
import CurrentStreak from "./component/CurrentStreak";
import StarsEarned from "./component/StarsEarned";
import WeeklyProgress from "./component/WeeklyProgress";
import Milestones from "./component/Milestones";
import { useAxiosGet } from "@/lib/axios/useAxiosQuery";

export default function StreakPage() {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useAxiosGet<UserProgress>(["UserProgress"], "/user/progress");

  /* ---------------- STATES ---------------- */
  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading your progress…</p>
      </main>
    );
  }

  if (isError || !response) {
    throw new Error(error?.message || "Failed to load user progress");
  }

  const { current_streak, longest_streak, targetStars,currentStars } = response;

  /* ---------------- UI ---------------- */
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
        <CurrentStreak currentStreak={current_streak} />

        <StarsEarned
          currentStars={currentStars}
          longestStreak={longest_streak}
          nextStarMilestone={{
            title: `${targetStars} Stars ✨`,
            targetStars: targetStars,
          }}
          earningRule="Earn 1 star per completed focus session"
        />
      </div>

      <WeeklyProgress />
      <Milestones />

      {/* Motivation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-3xl p-8 border border-secondary/20">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">
              Keep Building
            </h2>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            “Small steps every day make a big difference. Your brain thanks you
            for showing up consistently.”
          </p>
          <p className="text-sm text-accent">
            You’re more focused in the mornings — try morning sessions to
            continue your streak!
          </p>
        </div>
      </div>
    </main>
  );
}
