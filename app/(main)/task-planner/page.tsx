"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

interface Task {
  id: string;
  name: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  reminders?: { times: string[] };
}

const TaskCard = ({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (id: string) => void;
}) => (
  <div className="bg-elevated rounded-xl p-3 border border-border">
    <div className="flex items-start justify-between mb-2">
      <h4 className="font-semibold text-sm text-foreground">{task.name}</h4>
      <button
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground hover:text-destructive transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
    {task.category && (
      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium">
        {task.category}
      </span>
    )}
    {task.startDate && task.endDate && task.startDate !== task.endDate && (
      <p className="text-xs text-muted-foreground mt-2">
        {new Date(task.startDate + "T00:00:00").toLocaleDateString()} -{" "}
        {new Date(task.endDate + "T00:00:00").toLocaleDateString()}
      </p>
    )}
    {task.reminders && task.reminders.times.length > 0 && (
      <div className="mt-2">
        <p className="text-xs text-muted-foreground font-medium mb-1">
          Reminders:
        </p>
        <div className="flex flex-wrap gap-1">
          {task.reminders.times.map((time, i) => (
            <span
              key={i}
              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg font-medium"
            >
              {time}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const CalendarDay = ({
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
}) => {
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
      className={`h-12 rounded-xl p-2 text-center transition-all relative  flex-col flex-center-all ${classes}`}
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
};

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [taskName, setTaskName] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [dateType, setDateType] = useState<"no-date" | "single" | "range">(
    "no-date"
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reminderCount, setReminderCount] = useState<number>(1);
  const [reminderTimes, setReminderTimes] = useState<string[]>(["09:00"]);

  useEffect(() => {
    const savedTasks = localStorage.getItem("focusflow-tasks");
    const savedDate = localStorage.getItem("focusflow-selected-date");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedDate) setSelectedDate(savedDate);
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    localStorage.setItem("focusflow-tasks", JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  useEffect(() => {
    localStorage.setItem("focusflow-selected-date", selectedDate || "");
  }, [selectedDate]);

  useEffect(() => {
    // keep reminderTimes synced with count
    setReminderTimes((prev) => {
      const newTimes = [...prev];
      while (newTimes.length < reminderCount) newTimes.push("09:00");
      return newTimes.slice(0, reminderCount);
    });
  }, [reminderCount]);

  const handleCreateTask = () => {
    if (!taskName.trim()) {
      alert("Please enter a task name");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      category: taskCategory,
      ...(dateType === "single" &&
        startDate && { startDate, endDate: startDate }),
      ...(dateType === "range" &&
        startDate &&
        endDate && { startDate, endDate }),
      ...((dateType === "single" || dateType === "range") &&
        reminderTimes.length > 0 &&
        reminderTimes[0] && {
          reminders: { times: reminderTimes },
        }),
    };

    saveTasks([...tasks, newTask]);

    setTaskName("");
    setTaskCategory("");
    setDateType("no-date");
    setStartDate("");
    setEndDate("");
    setReminderCount(1);
    setReminderTimes(["09:00"]);
    setShowCreateForm(false);
  };

  const handleDeleteTask = (id: string) => {
    saveTasks(tasks.filter((task) => task.id !== id));
  };

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

  const getTasksForDate = (date: string) =>
    tasks.filter((task) => {
      if (!task.startDate) return false;
      if (!task.endDate) return task.startDate === date;
      return date >= task.startDate && date <= task.endDate;
    });

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const handleReminderTimeChange = (index: number, time: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = time;
    setReminderTimes(newTimes);
  };

  return (
    <>
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
        <div className="flex-center-between mb-6">
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

            {selectedDate && selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            ) : selectedDate ? (
              <p className="small-muted-text">No tasks for this date</p>
            ) : (
              <p className="small-muted-text">Click on a date to view tasks</p>
            )}
          </div>
        </div>
      </main>

      {/* Create Task Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex-center-all z-50 p-4">
          <div className="bg-card rounded-2xl p-5 border border-border max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex-center-between mb-4">
              <h2 className="text-lg font-bold text-foreground">
                Create New Task
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Task Name */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Task Name
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g., Study Math"
                  className="w-full px-3 py-2 bg-elevated border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Category (optional)
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-elevated border border-border rounded-xl text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                >
                  <option value="">Select category</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="study">Study</option>
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Date
                </label>
                <div className="flex gap-2 mb-2">
                  {["no-date", "single", "range"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setDateType(type as any)}
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all text-sm font-medium ${
                        dateType === type
                          ? "bg-primary btn-text border-primary shadow-sm"
                          : "bg-elevated border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {type.replace("-", " ")}
                    </button>
                  ))}
                </div>

                {dateType === "single" && (
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-elevated border border-border rounded-xl text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  />
                )}

                {dateType === "range" && (
                  <div className="space-y-1.5">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="Start date"
                      className="w-full px-3 py-2 bg-elevated border border-border rounded-xl text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="End date"
                      className="w-full px-3 py-2 bg-elevated border border-border rounded-xl text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Reminders */}
              {(dateType === "single" || dateType === "range") && (
                <div className="p-3 bg-elevated rounded-xl border border-border">
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Reminders (optional)
                    {dateType === "range" && (
                      <span className="block text-xs text-muted-foreground mt-0.5">
                        Will repeat daily in range
                      </span>
                    )}
                  </label>

                  <div className="mb-2">
                    <label className="block text-xs text-muted-foreground mb-1">
                      Count:
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={reminderCount}
                      onChange={(e) =>
                        setReminderCount(Number.parseInt(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                    />
                  </div>

                  {reminderCount > 0 && (
                    <div className="space-y-1.5">
                      <label className="block text-xs text-muted-foreground mb-1">
                        Times:
                      </label>
                      {reminderTimes.map((time, i) => (
                        <input
                          key={i}
                          type="time"
                          value={time}
                          onChange={(e) =>
                            handleReminderTimeChange(i, e.target.value)
                          }
                          className="w-full px-2 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleCreateTask}
                className="w-full px-4 py-2.5 bg-primary btn-text rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
