"use client";
import { AlertCircle } from "lucide-react";

export default function DistractionAnalysis() {
  return (
    <div className="bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl p-8 border border-orange-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Distraction Analysis
          </h2>
          <p className="text-sm text-muted-foreground">
            Identify what's breaking your focus
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Understanding your distraction patterns is the first step to improving
        focus.
      </p>

      <div className="space-y-4 mb-6">
        {[
          {
            name: "Phone Notifications",
            times: 23,
            percent: 38,
            width: 100,
          },
          { name: "Social Media", times: 18, percent: 30, width: 80 },
          { name: "Background Noise", times: 12, percent: 20, width: 55 },
          { name: "Other Apps", times: 7, percent: 12, width: 30 },
        ].map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {item.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {item.times} times
                </span>
                <span className="text-sm font-semibold text-orange-500">
                  {item.percent}%
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                style={{ width: `${item.width}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-orange-500/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Total Distractions
          </span>
          <div className="text-right">
            <div className="text-3xl font-bold text-orange-500">60</div>
            <div className="text-xs text-muted-foreground">
              100.0% of sessions affected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
