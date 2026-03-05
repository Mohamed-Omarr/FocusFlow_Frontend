"use client";
import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { Brain, Clock, Lightbulb, TrendingUp } from "lucide-react";

// 1. Updated Type to match your API (type is now a string)
type WeeklySuggestion = {
  type: string; 
  message: string;
};

const getSuggestionMeta = (type: string) => {
  switch (type) {
    case "Optimal Session Length":
      return { icon: Clock, title: "Optimal Session Length" };
    case "Distraction Pattern":
      return { icon: Brain, title: "Distraction Pattern" };
    case "Focus Optimization Insight":
      return { icon: TrendingUp, title: "Focus Optimization Insight" };
    default:
      return { icon: Lightbulb, title: "Smart Insight" };
  }
};

export default function SmartSuggestions() {
  const {
    data: response,
    isLoading,
    isError,
  } = useAxiosGet<WeeklySuggestion[]>(
    ["weekly_suggestions"],
    "/ai/weekly_suggestions"
  );

  // Loading State with Skeleton UI
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted/20 rounded-3xl border border-border" />
        ))}
      </div>
    );
  }

  if (isError || !response) {
    return (
      <div className="p-8 text-center border border-destructive/20 rounded-2xl bg-destructive/5">
        <p className="text-destructive font-medium">Unable to load focus insights.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8 border border-border/50 backdrop-blur-xl bg-background/60 rounded-2xl px-6 py-4">
        <Lightbulb className="w-6 h-6 text-primary shrink-0" />
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-foreground leading-tight">
            Smart Suggestions
          </h2>
          <p className="text-sm text-muted-foreground">
            Supportive insights to help you understand and improve your focus patterns
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {response.map((suggestion, i) => {
          const { icon: IconComponent, title } = getSuggestionMeta(suggestion.type);

          return (
            <div
              key={i}
              className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 border border-border hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <IconComponent className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {suggestion.message}
              </p>
            </div>
          );
        })}
      </div>

      <div className="my-8 text-center">
        <p className="text-sm text-muted-foreground italic">
          Remember: These insights are here to support you. Every small improvement counts.
        </p>
      </div>
    </div>
  );
}