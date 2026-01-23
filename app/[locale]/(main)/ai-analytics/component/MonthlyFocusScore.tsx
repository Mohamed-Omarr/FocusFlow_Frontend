import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { Badge, Target, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";

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
export default function MonthlyFocusScore() {
  const {
    data: monthlyScoreWeeks,
    isLoading,
    isError,
  } = useAxiosGet(["monthly-focus-score"], "/user/monthly-focus-score");

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
            <span className="text-6xl font-bold text-foreground">86</span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
        </div>
        <Badge className=" text-blue-400 border-0">
          <TrendingUp className="w-3.5 h-3.5 mr-1" />
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
            <Bar
              dataKey="score"
              fill="oklch(0.7 0.15 160)"
              radius={[6, 6, 0, 0]}
              className="transition-all hover:opacity-100 hover:brightness-125"
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
