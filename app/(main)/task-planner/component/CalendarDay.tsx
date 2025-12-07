"use client";
export function CalendarDay({
  day,
  dateStr,
  tasksForDay,
  selectedDate,
  onSelect,
}: {
  day: number;
  dateStr: string;
  tasksForDay: Task[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
}) {
  const isSelected = selectedDate === dateStr;
  const isToday =
    new Date().toDateString() ===
    new Date(dateStr + "T00:00:00").toDateString();

  const classes = isSelected
    ? "bg-primary btn-text shadow-md scale-105"
    : isToday
    ? "bg-primary/10 text-primary border-2 border-primary"
    : "bg-elevated text-foreground hover:bg-elevated/80 hover:scale-105";
  return (
    <button
      onClick={() => onSelect(dateStr)}
      className={`h-12 rounded-xl p-2 text-center transition-all relative flex-col flex-center-all ${classes}`}
    >
      <span className="text-sm font-medium">{day}</span>
      {tasksForDay.length > 0 && (
        <div className="absolute bottom-1 flex gap-0.5">
          {tasksForDay.slice(0, 3).map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full ${
                isSelected ? "bg-primary-foreground" : "bg-primary"
              }`}
            />
          ))}
        </div>
      )}
    </button>
  );
}
