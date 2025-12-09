"use client";
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { TaskCard } from "./component/TaskCard";
import { CalendarDay } from "./component/CalendarDay";
import { CreateTaskModal } from "./component/CreateTaskModal";
import NonScheduledTask from "./component/NonScheduledTask";
import ScheduledTask from "./component/ScheduledTask";

// Mock Task Data
const mockTasks = [
  {
    id: "1",
    name: "Study Math",
    category: "study",
    dateType: "single",
    startDate: "2025-12-10",
    endDate: null,
    reminderTime: ["10:00"],
    completed: false,
  },
  {
    id: "2",
    name: "Gym Workout",
    category: "personal",
    dateType: "no-date",
    startDate: null,
    endDate: null,
    reminderTime: [],
    completed: false,
  },
  {
    id: "3",
    name: "Work Sprint Planning",
    category: "work",
    dateType: "range",
    startDate: "2025-12-12",
    endDate: "2025-12-20",
    reminderTime: ["09:00"],
    completed: false,
  },
  {
    id: "4",
    name: "Read JavaScript Book",
    category: "study",
    dateType: "single",
    startDate: "2025-12-15",
    endDate: null,
    reminderTime: ["20:00"],
    completed: true,
  },
  {
    id: "5",
    name: "Team Meeting",
    category: "work",
    dateType: "single",
    startDate: "2025-12-08",
    endDate: null,
    reminderTime: ["14:00"],
    completed: false,
  },
];

const TaskPlannerPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    localStorage.setItem("focusflow-selected-date", selectedDate || "");
  }, [selectedDate]);

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = useMemo(
    () => getDaysInMonth(currentDate),
    [currentDate]
  );

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const formatDate = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  // Date based task filtering
  const getTasksForDate = (date: string) =>
    mockTasks.filter((task) => {
      if (!task.startDate) return false;
      if (!task.endDate) return task.startDate === date;
      return date >= task.startDate && date <= task.endDate;
    });

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  // Scheduled
  const scheduledTasks = useMemo(
    () =>
      mockTasks.filter(
        (task) => task.dateType === "single" || task.dateType === "range"
      ),
    []
  );
  //  Non-Scheduled
  const nonScheduledTasks = useMemo(
    () => mockTasks.filter((task) => task.dateType === "no-date"),
    []
  );
  return (
    <>
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex-center-between mb-6 border border-border/50 backdrop-blur-xl bg-background/60 rounded-full px-6 py-3">
          <h1 className="text-2xl font-bold text-foreground">Task Planner</h1>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex flex-center gap-2 px-4 py-2 bg-primary btn-text rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 text-sm shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
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

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}

              {/* Empty spaces */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-12" />
              ))}

              {/* Days */}
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

          {/* Task Sidebar */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm h-fit">
            <h3 className="text-base font-semibold text-foreground mb-4">
              {selectedDate
                ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric" }
                  )
                : "Select a date"}
            </h3>

            {/* Selected Date Tasks */}
            {selectedDate && selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : selectedDate ? (
              <p className="small-muted-text">No tasks for this date</p>
            ) : (
              <p className="small-muted-text">Click on a date to view tasks</p>
            )}

            {/* Scheduled Task List */}
            <ScheduledTask scheduled={scheduledTasks} />

            {/* Non-Scheduled Task List */}
            <NonScheduledTask tasks={nonScheduledTasks} />
          </div>
        </div>
      </main>

      {/* Create Task Modal */}
      {showCreateForm && (
        <CreateTaskModal setShowCreateForm={setShowCreateForm} />
      )}
    </>
  );
};

export default TaskPlannerPage;
