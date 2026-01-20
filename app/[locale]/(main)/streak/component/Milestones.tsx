"use client";

import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { Award } from "lucide-react";


export default function Milestones() {
  const {
    data: milestones,
    isLoading,
    isError,
    error,
  } = useAxiosGet<Milestones[]>(["milestones"], "/user/milestones");

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        Loading milestones…
      </div>
    );
  }

  if (isError || !milestones) {
    throw new Error(error?.message || "Failed to load milestones");
  }

  return (
    <div className="bg-card rounded-3xl p-8 border border-border mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          Milestones
        </h2>
      </div>

      {/* 🆕 EMPTY STATE */}
      {milestones.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-10">
          No milestones yet — start your journey to success.
        </div>
      )}

      {/* 🏆 MILESTONES */}
      {milestones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((m) => (
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

                  {m.achieved && (
                    <div className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                      <span>✓</span> Achieved
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
