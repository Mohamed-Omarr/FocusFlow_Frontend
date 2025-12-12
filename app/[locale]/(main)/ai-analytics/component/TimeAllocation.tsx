"use client";

export default function TimeAllocation() {
  return (
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
  );
}
