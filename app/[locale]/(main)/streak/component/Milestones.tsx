"use client";
import { Award } from "lucide-react";

type Milestone = {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  progress?: {
    current: number;
    target: number;
  };
};

export default function Milestones({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="bg-card rounded-3xl p-8 border border-border mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Milestones
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((m) => {
          const progress =
            m.progress && m.progress.target > 0
              ? Math.min(m.progress.current / m.progress.target, 1)
              : 0;

          return (
            <div
              key={m.id}
              className={`p-6 rounded-2xl border transition-all ${
                m.achieved
                  ? "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30"
                  : "bg-muted/20 border-border/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{m.icon}</div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {m.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {m.description}
                  </p>

                  {m.progress && !m.achieved && (
                    <>
                      <div className="h-2 rounded-full bg-muted overflow-hidden mb-1">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {m.progress.current} / {m.progress.target}
                      </div>
                    </>
                  )}

                  {m.achieved && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-primary font-medium">
                      <span>✓</span> Achieved
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
