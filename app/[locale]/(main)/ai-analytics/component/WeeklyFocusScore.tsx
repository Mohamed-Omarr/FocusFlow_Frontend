"use client"
import { Badge, Target, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";

const focusScoreBreakdown = [
  { label: "Session Length", value: 88, color: "oklch(0.65 0.18 200)" },
  { label: "Consistency", value: 92, color: "oklch(0.68 0.16 180)" },
  { label: "Distractions", value: 78, color: "oklch(0.7 0.15 160)" },
  { label: "Energy", value: 86, color: "oklch(0.72 0.14 140)" },
];
const weeklyScoreData = [
  {
    day: "Mon",
    score: 75,
    sessionLength: 88,
    consistency: 85,
    distractions: 65,
    energy: 70,
  },
  {
    day: "Tue",
    score: 80,
    sessionLength: 90,
    consistency: 88,
    distractions: 70,
    energy: 75,
  },
  {
    day: "Wed",
    score: 85,
    sessionLength: 92,
    consistency: 90,
    distractions: 78,
    energy: 82,
  },
  {
    day: "Thu",
    score: 82,
    sessionLength: 88,
    consistency: 87,
    distractions: 75,
    energy: 78,
  },
  {
    day: "Fri",
    score: 90,
    sessionLength: 95,
    consistency: 93,
    distractions: 85,
    energy: 88,
  },
  {
    day: "Sat",
    score: 70,
    sessionLength: 80,
    consistency: 75,
    distractions: 60,
    energy: 65,
  },
  {
    day: "Sun",
    score: 85,
    sessionLength: 90,
    consistency: 88,
    distractions: 80,
    energy: 82,
  },
];
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold mb-2">{data.day || data.week}</p>
        <div className="space-y-1">
          <p className="text-muted-foreground">
            Score:{" "}
            <span className="font-medium text-foreground">
              {data.score}/100
            </span>
          </p>
          <div className="pt-1 border-t border-border/50 space-y-0.5">
            <p className="text-muted-foreground">
              Session Length: {data.sessionLength}%
            </p>
            <p className="text-muted-foreground">
              Consistency: {data.consistency}%
            </p>
            <p className="text-muted-foreground">
              Distractions: {data.distractions}%
            </p>
            <p className="text-muted-foreground">Energy: {data.energy}%</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function WeeklyFocusScore() {
    const [showBreakdown, setShowBreakdown] = useState(false);
      const currentScore = 86;
  const previousScore = 81;
  const scoreChange = currentScore - previousScore;
  
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Weekly Focus Score
            </h2>
          </div>
          <div
            className="flex items-baseline gap-3 relative cursor-help"
            onMouseEnter={() => setShowBreakdown(true)}
            onMouseLeave={() => setShowBreakdown(false)}
          >
            <span className="text-6xl font-bold text-foreground">
              {currentScore}
            </span>
            <span className="text-2xl text-muted-foreground">/100</span>

            {showBreakdown && (
              <div className="absolute left-0 top-full mt-4 z-10 w-80 p-4 bg-popover border border-border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95">
                <h3 className="font-semibold mb-3 text-sm text-foreground">
                  Score Breakdown
                </h3>
                <div className="space-y-3">
                  {focusScoreBreakdown.map((item) => (
                    <div key={item.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{item.label}</span>
                        <span className="font-medium text-foreground">
                          {item.value}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Badge className="bg-emerald-600/20 text-emerald-400 border-0">
          <TrendingUp className="w-3.5 h-3.5 mr-1" />+{scoreChange} this week
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Your focus score reflects session length, consistency, distraction
        frequency, and energy levels throughout the week.
      </p>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyScoreData}>
            <XAxis
              dataKey="day"
              stroke="gray"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.1)" }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {weeklyScoreData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill="oklch(0.65 0.18 200)"
                  className="transition-all hover:opacity-100 hover:brightness-125"
                  opacity={0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
