"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  name: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export function TaskListSidebar() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timerDuration, setTimerDuration] = useState<"1" | "60" | "custom">("1");
  const [customMinutes, setCustomMinutes] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Load today's tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("focusflow-tasks");
    if (savedTasks) {
      const allTasks: Task[] = JSON.parse(savedTasks);
      const today = new Date().toISOString().split("T")[0];

      const filteredTasks = allTasks.filter((task) => {
        if (!task.startDate && !task.endDate) return true;
        if (task.startDate && !task.endDate) return task.startDate === today;
        if (task.startDate && task.endDate)
          return today >= task.startDate && today <= task.endDate;
        return false;
      });

      setTasks(filteredTasks);
    }
  }, []);

  // Update content height dynamically for smooth expand/collapse
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [tasks, timerDuration, customMinutes, breakTime, selectedTask, isOpen]);

  const handleStartSession = () => {
    if (!selectedTask) {
      alert("Please select a task to start a focus session");
      return;
    }

    const task = tasks.find((t) => t.id === selectedTask);
    if (!task) return;

    const duration =
      timerDuration === "custom"
        ? Math.max(Number.parseInt(customMinutes) || 1, 1)
        : Number.parseInt(timerDuration);

    const breakDuration = Math.min(Number.parseInt(breakTime) || 0, 15);

    sessionStorage.setItem(
      "currentTask",
      JSON.stringify({
        name: task.name,
        duration,
        breakDuration,
      })
    );

    router.push("/active-session");
  };

  return (
    <div
      className="w-full bg-white dark:bg-card rounded-3xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg transition-shadow duration-500 ease-in-out cursor-pointer"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-2xl font-semibold text-foreground dark:text-white">
          Start a Focus Session
        </h2>
        <span
          className={`text-xl transition-transform duration-500 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </div>

      {/* Expandable Content */}
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? `${contentHeight}px` : "0px" }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        {/* Select Task */}
        <div className="mb-5 mt-5">
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Select Task
          </label>
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-400">No tasks available today.</p>
          ) : (
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:border-primary/50 focus:outline-none transition-colors duration-500"
            >
              <option value="">Choose a task...</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name} {task.category && `(${task.category})`}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Timer Duration */}
        {selectedTask && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Timer Duration
            </label>
            <div className="flex gap-3 mb-3">
              {["1", "60", "custom"].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setTimerDuration(dur as "1" | "60" | "custom")}
                  className={`flex-1 px-4 py-3 rounded-2xl border font-medium transition-all duration-500 ${
                    timerDuration === dur
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-primary/50"
                  }`}
                >
                  {dur === "1" ? "1 min" : dur === "60" ? "1 hr" : "Custom"}
                </button>
              ))}
            </div>
            {timerDuration === "custom" && (
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Enter minutes"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-colors duration-500"
                min={1}
              />
            )}
          </div>
        )}

        {/* Break Length */}
        {selectedTask && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Break Length (optional, max 15 min)
            </label>
            <input
              type="number"
              value={breakTime}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value);
                if (value <= 15 || e.target.value === "") setBreakTime(e.target.value);
              }}
              placeholder="e.g., 5"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-colors duration-500"
              min={0}
              max={15}
            />
            <p className="text-xs text-gray-400 mt-1">Break occurs every 30 minutes</p>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartSession}
          disabled={!selectedTask}
          className="w-full px-6 py-4 bg-primary rounded-2xl font-semibold hover:bg-primary/90 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Focus Session
        </button>
      </div>
    </div>
  );
}
