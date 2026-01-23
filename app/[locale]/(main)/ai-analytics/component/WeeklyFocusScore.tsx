"use client";

import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { Badge, Target, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";

/* ---------------- TYPES ---------------- */

type WeeklyFocusRow = {
  day: string;
  score: number;
  session_length: number;
  distractions: number;
  energy: number;
};

type ChartRow = {
  day: string;
  score: number;
  sessionLength: number;
  distractions: number;
  energy: number;
};

/* ---------------- TOOLTIP ---------------- */

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold mb-2">{data.day}</p>
        <p className="text-muted-foreground">
          Score:{" "}
          <span className="font-medium text-foreground">{data.score}/100</span>
        </p>
        <div className="pt-2 mt-2 border-t border-border/50 space-y-0.5">
          <p>Session Length: {data.sessionLength}%</p>
          <p>Distractions: {data.distractions}%</p>
          <p>Energy: {data.energy}%</p>
        </div>
      </div>
    );
  }
  return null;
};

/* ---------------- COMPONENT ---------------- */

export default function WeeklyFocusScore() {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useAxiosGet<WeeklyFocusRow[]>(
    ["weekly-focus-score"],
    "/user/weekly-focus-score",
  );

  /* -------- normalize API → chart -------- */
  const weeklyScoreData: ChartRow[] = useMemo(() => {
    if (!response) return [];
    return response.map((row) => ({
      day: row.day,
      score: row.score,
      sessionLength: row.session_length,
      distractions: row.distractions,
      energy: row.energy,
    }));
  }, [response]);

  /* -------- derived values -------- */
  const currentScore =
    weeklyScoreData.length > 0
      ? weeklyScoreData[weeklyScoreData.length - 1].score
      : 0;

  const previousScore =
    weeklyScoreData.length > 1
      ? weeklyScoreData[weeklyScoreData.length - 2].score
      : currentScore;

  const scoreChange = currentScore - previousScore;

  /* ---------------- STATES ---------------- */

  if (isLoading) {
    return <div className="h-40 rounded-3xl bg-muted animate-pulse" />;
  }

  if (isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load weekly focus score
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

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
            <span className="text-6xl font-bold">{currentScore}</span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
        </div>

        <Badge className="text-emerald-400 border-0">
          <TrendingUp className="w-3.5 h-3.5 mr-1" />
          {scoreChange >= 0 ? "+" : ""}
          {scoreChange} this week
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Your focus score across each day of the week, showing daily
        consistency and growth patterns.
      </p>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyScoreData}>
            <XAxis dataKey="day" tickLine={false} axisLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {weeklyScoreData.map((_, i) => (
                <Cell key={i} fill="oklch(0.65 0.18 200)" opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
