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

  /* ---------------- MOTIVATION ARRAY ---------------- */
  const motivations = [
    "Small steps every day compound into meaningful progress.",
    "Consistency beats intensity. You showed up — that matters.",
    "Focus is a skill. And you’re training it daily.",
    "Even one mindful session strengthens your discipline.",
    "Progress is quiet. Keep building.",
    "Your future self appreciates today’s effort.",
    "Deep work today, clarity tomorrow.",
    "Momentum grows from small repeated wins.",
    "It’s not about perfection. It’s about presence.",
    "Stay steady. Sustainable focus wins long term.",
    "Energy flows where attention goes.",
    "Discipline is self-respect in action.",
    "Every focused minute rewires your brain.",
    "Protect your attention — it’s your superpower.",
  ];

  /* ---------------- DAILY MOTIVATION (CHANGES ONCE PER DAY) ---------------- */
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const dailyMotivation = motivations[dayOfYear % motivations.length];

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

  const {
    current_streak,
    longest_streak,
    targetStars,
    currentStars,
    earning_rule,
    total_stars,
  } = response;

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
          totalStars={total_stars}
          longestStreak={longest_streak}
          nextStarMilestone={{
            title: `${targetStars} Stars ✨`,
            targetStars: targetStars,
          }}
          earningRule={`Earn 1 star per completed ${earning_rule} minutes`}
        />
      </div>

      <WeeklyProgress />
      <Milestones />

      {/* Motivation */}
      <div className=" flex justify-center w-fit mx-auto">
        <div className="w-full max-w-2xl bg-gradient-to-br from-secondary/10 to-accent/10 rounded-3xl p-10 border border-secondary/20 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-secondary" />
            <h2 className="text-lg font-semibold text-foreground">
              Keep Building
            </h2>
          </div>

          <p className="text-muted-foreground leading-relaxed text-base">
            “{dailyMotivation}”
          </p>
        </div>
      </div>
    </main>
  );
}
