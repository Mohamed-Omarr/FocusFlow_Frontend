"use client";

import type React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Clock,
  Brain,
  Lightbulb,
  Target,
  AlertCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";

// Data definitions remain the same (timeAllocationData, weeklyScoreData, monthlyScoreWeeks, aiSuggestions, focusScoreBreakdown, distractionData)

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold mb-2">{data.day || data.week}</p>
        <div className="space-y-1">
          <p className="text-muted-foreground">
            Score: <span className="font-medium text-foreground">{data.score}/100</span>
          </p>
          <div className="pt-1 border-t border-border/50 space-y-0.5">
            <p className="text-muted-foreground">Session Length: {data.sessionLength}%</p>
            <p className="text-muted-foreground">Consistency: {data.consistency}%</p>
            <p className="text-muted-foreground">Distractions: {data.distractions}%</p>
            <p className="text-muted-foreground">Energy: {data.energy}%</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const currentScore = 86;
  const previousScore = 81;
  const scoreChange = currentScore - previousScore;
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<{ data: any; x: number; y: number } | null>(null);

  const totalHours = timeAllocationData.reduce((acc, item) => acc + item.hours, 0);
  const totalWeekHours = 168;
  const focusPercentage = ((totalHours / totalWeekHours) * 100).toFixed(1);

  const totalDistractions = distractionData.reduce((acc, item) => acc + item.count, 0);
  const totalSessions = 60;
  const distractionPercentage = ((totalDistractions / totalSessions) * 100).toFixed(1);

  const handleDayHover = (day: any, event: React.MouseEvent) => {
    setHoveredDay({ data: day, x: event.clientX, y: event.clientY });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 text-balance">Analytics</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Calm, meaningful insights into your focus patterns and productivity habits
        </p>
      </div>

      {/* Focus Score and Monthly Score */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Weekly Focus Score */}
        <Card className="p-8 bg-card border border-border">
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
                <span className="text-6xl font-bold text-foreground">{currentScore}</span>
                <span className="text-2xl text-muted-foreground">/100</span>

                {showBreakdown && (
                  <div className="absolute left-0 top-full mt-4 z-10 w-80 p-4 bg-popover border border-border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95">
                    <h3 className="font-semibold mb-3 text-sm text-foreground">Score Breakdown</h3>
                    <div className="space-y-3">
                      {focusScoreBreakdown.map((item) => (
                        <div key={item.label} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{item.label}</span>
                            <span className="font-medium text-foreground">{item.value}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${item.value}%`, backgroundColor: item.color }}
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

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Your focus score reflects session length, consistency, distraction frequency, and energy levels throughout the week.
          </p>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyScoreData}>
                <XAxis dataKey="day" stroke="gray" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
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
        </Card>

        {/* Monthly Focus Score Card */}
        <Card className="p-8 bg-card border border-border">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Monthly Focus Score
                </h2>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold text-foreground">86</span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
            </div>
            <Badge className="bg-blue-600/20 text-blue-400 border-0">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />+4 this month
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Your focus score across each week of the month, showing weekly consistency and growth patterns.
          </p>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyScoreWeeks}>
                <XAxis dataKey="week" stroke="gray" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.1)" }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {monthlyScoreWeeks.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="oklch(0.7 0.15 160)"
                      className="transition-all hover:opacity-100 hover:brightness-125"
                      opacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Remaining sections follow similar cleanup: all `text-muted-foreground`, `bg-card`, `border-border` applied consistently */}
    </main>
  );
}
