"use client";
import { Award } from "lucide-react";

export default function Milestones({ milestones }) {
  return (
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
  );
}
