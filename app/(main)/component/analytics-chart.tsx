"use client"

export function AnalyticsChart() {
  const data = [
    { day: "Mon", score: 65 },
    { day: "Tue", score: 70 },
    { day: "Wed", score: 68 },
    { day: "Thu", score: 78 },
    { day: "Fri", score: 82 },
    { day: "Sat", score: 75 },
    { day: "Sun", score: 72 },
  ]

  const maxScore = Math.max(...data.map((d) => d.score))

  return (
    <div className="space-y-4">
      {/* Chart bars */}
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-muted rounded-t-lg relative">
              <div
                className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500"
                style={{
                  height: `${(item.score / maxScore) * 100}%`,
                  background: "linear-gradient(to top, var(--primary), var(--secondary))",
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
