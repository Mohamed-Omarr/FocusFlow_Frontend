"use client";

import type React from "react";
import {
  Clock,
  TrendingUp,
  Lightbulb,
  Target,
  AlertCircle,
  Brain,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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

const monthlyScoreWeeks = [
  {
    week: "Week 1",
    score: 78,
    sessionLength: 85,
    consistency: 82,
    distractions: 70,
    energy: 75,
  },
  {
    week: "Week 2",
    score: 82,
    sessionLength: 88,
    consistency: 85,
    distractions: 75,
    energy: 80,
  },
  {
    week: "Week 3",
    score: 85,
    sessionLength: 90,
    consistency: 88,
    distractions: 80,
    energy: 82,
  },
  {
    week: "Week 4",
    score: 86,
    sessionLength: 92,
    consistency: 90,
    distractions: 82,
    energy: 85,
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

const generateYearlyCalendarData = (year: number) => {
  const data = [];
  const startDate = new Date(year, 0, 1);
  const startDay = startDate.getDay();

  // Calculate weeks needed
  const totalDays = 365;
  const weeks = Math.ceil((totalDays + startDay) / 7);

  for (let week = 0; week < weeks; week++) {
    for (let day = 0; day < 7; day++) {
      const dayIndex = week * 7 + day - startDay;
      if (dayIndex >= 0 && dayIndex < totalDays) {
        const date = new Date(year, 0, dayIndex + 1);
        const score = Math.floor(Math.random() * 40) + 60;
        data.push({
          date: date.toISOString().split("T")[0],
          dateObj: date,
          day: date.getDate(),
          month: date.getMonth(),
          weekday: day,
          week: week,
          score: score,
          level: score < 70 ? 1 : score < 80 ? 2 : score < 90 ? 3 : 4,
        });
      }
    }
  }
  return data;
};

export default function AIAnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [hoveredDay, setHoveredDay] = useState<{
    data: any;
    x: number;
    y: number;
  } | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const yearlyCalendarData = generateYearlyCalendarData(selectedYear);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "oklch(0.25 0.02 240)";
      case 1:
        return "oklch(0.45 0.08 240)";
      case 2:
        return "oklch(0.58 0.14 240)";
      case 3:
        return "oklch(0.68 0.18 240)";
      case 4:
        return "oklch(0.75 0.22 240)";
      default:
        return "oklch(0.25 0.02 240)";
    }
  };

  const getMonthPositions = () => {
    const positions: { month: string; week: number }[] = [];
    let lastMonth = -1;

    yearlyCalendarData.forEach((day) => {
      if (day.month !== lastMonth) {
        positions.push({
          month: new Date(2025, day.month).toLocaleString("default", {
            month: "short",
          }),
          week: day.week,
        });
        lastMonth = day.month;
      }
    });

    return positions;
  };

  const handleDayHover = (day: any, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setHoveredDay({
      data: day,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  const weekCount = Math.max(...yearlyCalendarData.map((d) => d.week)) + 1;
  const monthPositions = getMonthPositions();

  const currentScore = 86;
  const previousScore = 81;
  const scoreChange = currentScore - previousScore;

  return (
    <div>
      <main>
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Calm, meaningful insights into your focus patterns and productivity
            habits
          </p>
        </div>

        {/* Focus Scores Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weekly Focus Score */}
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
                <TrendingUp className="w-3.5 h-3.5 mr-1" />+{scoreChange} this
                week
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

          {/* Monthly Focus Score */}
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border">
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
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                +4 this month
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Your focus score across each week of the month, showing weekly
              consistency and growth patterns.
            </p>

            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyScoreWeeks}>
                  <XAxis
                    dataKey="week"
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
          </div>
        </div>

        {/* Total Focus Time & Distraction Analysis */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Total Focus Time */}
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

          {/* Distraction Analysis */}
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
              Understanding your distraction patterns is the first step to
              improving focus.
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
        </div>

        {/* Time Allocation Overview */}
        <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Time Allocation Overview
          </h2>
          <p className="text-muted-foreground mb-8">
            Total time spent this week by task type
          </p>

          <div className="space-y-6">
            {[
              {
                category: "Work",
                hours: 24.5,
                percent: 44.5,
                color: "from-cyan-500 to-blue-500",
                width: 70,
              },
              {
                category: "Study",
                hours: 18.2,
                percent: 33.1,
                color: "from-emerald-500 to-teal-500",
                width: 52,
              },
              {
                category: "Personal",
                hours: 12.3,
                percent: 22.4,
                color: "from-amber-500 to-orange-500",
                width: 35,
              },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-foreground">
                    {item.category}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-foreground">
                      {item.hours} hours
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({item.percent}%)
                    </span>
                  </div>
                </div>
                <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Suggestions */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Smart Suggestions
            </h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Supportive insights to help you understand and improve your focus
            patterns
          </p>

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

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground italic">
              Remember: These insights are here to support you, not to add
              pressure. Every small improvement counts.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
