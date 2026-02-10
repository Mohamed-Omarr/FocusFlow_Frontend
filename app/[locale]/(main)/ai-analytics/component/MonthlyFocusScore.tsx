"use client";

import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { Badge, Target, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ---------------- TOOLTIP ---------------- */

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    const data = payload[0].payload;

    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold mb-2">{data.week}</p>

        <p className="text-muted-foreground">
          Score:{" "}
          <span className="font-medium text-foreground">{data.score}/100</span>
        </p>

        <div className="pt-2 mt-2 border-t border-border/50 space-y-0.5">
          <p>Session Length: {data.sessionLength}%</p>
          <p>Consistency: {data.consistency}%</p>
          <p>Distractions: {data.distractions}%</p>
          <p>Energy: {data.energy}%</p>
        </div>
      </div>
    );
  }
  return null;
};

/* ---------------- COMPONENT ---------------- */

export default function MonthlyFocusScore() {
  const {
    data: monthlyScoreWeeks,
    isLoading,
    isError,
  } = useAxiosGet<any[]>(["monthly-focus-score"], "/user/monthly-focus-score");

  /* -------- derived values -------- */

  const currentMonthlyScore =
    monthlyScoreWeeks?.length > 0
      ? monthlyScoreWeeks[monthlyScoreWeeks.length - 1].score
      : 0;

  const previousMonthlyScore =
    monthlyScoreWeeks?.length > 1
      ? monthlyScoreWeeks[monthlyScoreWeeks.length - 2].score
      : currentMonthlyScore;

  const scoreChange = currentMonthlyScore - previousMonthlyScore;

  /* ---------------- STATES ---------------- */

  if (isLoading) {
    return <div className="h-40 rounded-3xl bg-muted animate-pulse" />;
  }

  if (isError) {
    return (
      <div className="p-6 text-sm text-destructive">
        Failed to load monthly focus score
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
              Monthly Focus Score
            </h2>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-bold text-foreground">
              {currentMonthlyScore}
            </span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
        </div>

        <Badge className="text-blue-400 border-0">
          <TrendingUp className="w-3.5 h-3.5 mr-1" />
          {scoreChange >= 0 ? "+" : ""}
          {scoreChange} this month
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Your focus score across each week of the month, showing weekly
        consistency and growth patterns.
      </p>

      {!monthlyScoreWeeks || monthlyScoreWeeks.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm text-center px-4">
          Complete your first week of focus to unlock your monthly
          insights!{" "}
        </div>
      ) : (
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyScoreWeeks}>
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="score"
                fill="oklch(0.7 0.15 160)"
                radius={[6, 6, 0, 0]}
                opacity={0.8}
                className="transition-all hover:opacity-100 hover:brightness-125"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
