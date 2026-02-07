"use client";
import { Brain, Clock, Lightbulb, TrendingUp } from "lucide-react";

export default function SmartSuggestions() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8 border border-border/50 backdrop-blur-xl bg-background/60 rounded-2xl px-6 py-4">
        <Lightbulb className="w-6 h-6 text-primary shrink-0" />

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-foreground leading-tight">
            Smart Suggestions
          </h2>

          <p className="text-sm text-muted-foreground">
            Supportive insights to help you understand and improve your focus
            patterns
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Clock,
            title: "Optimal Session Length",
            description:
              "Your focus weakens after 35 minutes. Try shorter sessions with more frequent breaks to maintain peak productivity.",
          },
          {
            icon: Brain,
            title: "Environmental Pattern",
            description:
              "Noise is often detected in afternoon sessions. Consider using a quieter space or noise-cancelling headphones during this time.",
          },
          {
            icon: TrendingUp,
            title: "Peak Performance Time",
            description:
              "You seem more productive earlier in the day. Consider scheduling your most important deep work tasks between 9-11 AM.",
          },
        ].map((suggestion, i) => (
          <div
            key={i}
            className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <suggestion.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {suggestion.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {suggestion.description}
            </p>
          </div>
        ))}
      </div>

      <div className="my-8 text-center">
        <p className="text-sm text-muted-foreground italic">
          Remember: These insights are here to support you, not to add pressure.
          Every small improvement counts.
        </p>
      </div>
    </div>
  );
}
