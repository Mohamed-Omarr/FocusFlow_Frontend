"use client";
import { Clock } from "lucide-react";

export default function TotalFocusTime() {
  return (
    <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl p-8 border border-emerald-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <Clock className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Total Focus Time
          </h2>
          <p className="text-sm text-muted-foreground">
            Your productive hours this week
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-6xl font-bold text-emerald-600">55</span>
          <span className="text-2xl text-muted-foreground">hours</span>
        </div>
        <p className="text-sm text-muted-foreground">
          32.7% of your week · 168 total hours
        </p>
      </div>

      <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-[33%]" />
      </div>
    </div>
  );
}
