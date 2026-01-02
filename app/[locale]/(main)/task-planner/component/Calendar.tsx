"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarDay } from "./CalendarDay";
import { TaskType } from "../types";

interface CalendarProps {
  tasks: Omit<TaskType, "completed">[];
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
}

const Calendar = ({ tasks, selectedDate, setSelectedDate }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { daysInMonth, startingDayOfWeek, year, month } = useMemo(() => {
    const date = currentDate;
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
      year,
      month,
    };
  }, [currentDate]);

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDate = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const getTasksForDate = useMemo(
    () => (date: string) => {
      const selected = new Date(date + "T00:00:00").getTime();

      return tasks.filter((task) => {
        if (task.single_date) {
          const single = new Date(task.single_date + "T00:00:00").getTime();
          return single === selected;
        }

        if (!task.date_start) return false;

        const start = new Date(task.date_start + "T00:00:00").getTime();

        if (!task.date_end) {
          return start === selected;
        }

        const end = new Date(task.date_end + "T00:00:00").getTime();
        return selected >= start && selected <= end;
      });
    },
    [tasks]
  );

  return (
    <div className="lg:col-span-2 bg-card rounded-2xl p-5 border border-border shadow-sm">
      <div className="flex-center-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-elevated rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-elevated rounded-xl transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-12" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(year, month, day);
          const tasksForDay = getTasksForDate(dateStr);
          return (
            <CalendarDay
              key={day}
              day={day}
              dateStr={dateStr}
              tasksForDay={tasksForDay}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
