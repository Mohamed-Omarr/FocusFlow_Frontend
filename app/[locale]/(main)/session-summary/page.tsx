"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

interface SessionData {
  taskName: string;
  duration: number;
  breaksTaken: number;
  energy?: string;
  focusScore?: number;
}

export default function SessionSummaryPage() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    const storedSession = sessionStorage.getItem("completedSession");
    if (storedSession) {
      setSessionData(JSON.parse(storedSession));
      sessionStorage.removeItem("completedSession");
      sessionStorage.removeItem("currentTask");
    }
  }, []);

  return (
    <main className="flex-1  flex-center-all  flex-col px-6 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-foreground text-center">
          Session Summary
        </h1>

        {/* Focus Score Card */}
        <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-3xl p-8 border border-secondary/30 flex flex-col flex-center">
          <div className="flex flex-center gap-4 mb-2">
            <span className="text-6xl font-bold text-secondary">
              {sessionData?.focusScore ?? 78}
            </span>
            <span className="text-4xl">🟣</span>
          </div>
          <h2 className="text-lg font-medium text-muted-foreground">
            Focus Score
          </h2>
        </div>

        {/* Session Details */}
        <div className="bg-card rounded-3xl p-8 border border-border space-y-4">
          {sessionData && (
            <div className="flex flex-center gap-3 text-lg mb-4 pb-4 border-b border-border">
              <span>📝</span>
              <span className="text-muted-foreground">Task:</span>
              <span className="font-medium">{sessionData.taskName}</span>
            </div>
          )}

          <div className="flex flex-center gap-3 text-lg">
            <span>⏱</span>
            <span className="text-muted-foreground">Focus Duration:</span>
            <span className="font-medium">
              {sessionData?.duration ?? 42} min
            </span>
          </div>

          <div className="flex flex-center gap-3 text-lg">
            <span>☕</span>
            <span className="text-muted-foreground">Breaks Taken:</span>
            <span className="font-medium">{sessionData?.breaksTaken ?? 0}</span>
          </div>

          <div className="flex flex-center gap-3 text-lg">
            <span>⚡</span>
            <span className="text-muted-foreground">Energy:</span>
            <span className="font-medium">
              {sessionData?.energy ?? "Medium"}
            </span>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 border border-primary/30">
          <h3 className="text-sm font-medium text-primary mb-3 uppercase tracking-wide">
            AI Insight
          </h3>
          <p className="text-lg text-foreground leading-relaxed">
            "Your best focus was during the middle portion of your session. You
            managed breaks effectively."
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-4">
          <Link
            href="/"
            className="px-12 py-4 bg-primary btn-text rounded-2xl font-semibold hover:bg-primary/90 transition-all duration-300 glow-primary"
          >
            Save & Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
