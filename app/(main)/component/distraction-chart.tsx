"use client";

export function DistractionChart() {
  const data = [
    { label: "Phone", count: 8 },
    { label: "Noise", count: 5 },
    { label: "Thoughts", count: 12 },
    { label: "Other", count: 3 },
  ];

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex flex-between text-sm">
            <span>{item.label}</span>
            <span>{item.count}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.count / maxCount) * 100}%`,
                background:
                  "linear-gradient(to right, var(--accent), var(--primary))",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
