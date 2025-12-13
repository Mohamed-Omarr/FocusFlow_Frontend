"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import Calendar from "./component/Calendar";
import ScheduledTask from "./component/ScheduledTask";
import NonScheduledTask from "./component/NonScheduledTask";
import { CreateTaskModal } from "./component/CreateTaskModal";
import { TaskCard } from "./component/TaskCard";
import { TaskType } from "./types";

type TaskPage = Omit<TaskType, "completed"> & {
  completed: false;
};

// Mock Tasks
const mockTasks: TaskPage[] = [
  {
    id: "1",
    name: "Study Math",
    category: "study",
    dateType: "single",
    startDate: "2025-12-10",
    endDate: undefined,
    reminder: "10:00",
    completed: false,
    postponed: false,
  },
  {
    id: "2",
    name: "Gym Workout",
    category: "personal",
    dateType: "no-date",
    startDate: undefined,
    endDate: undefined,
    reminder: undefined,
    postponed: false,
    completed: false,
  },
  {
    id: "3",
    name: "Work Sprint Planning",
    category: "work",
    dateType: "range",
    startDate: "2025-12-12",
    endDate: "2025-12-20",
    reminder: "10:00",
    completed: false,

    postponed: false,
  },
  {
    id: "4",
    name: "Read JavaScript Book",
    category: "study",
    dateType: "single",
    startDate: "2025-12-15",
    endDate: undefined,
    reminder: "10:00",
    completed: false,

    postponed: false,
  },
  {
    id: "5",
    name: "Team Meeting",
    category: "work",
    dateType: "single",
    startDate: "2025-12-08",
    endDate: undefined,
    reminder: "10:00",
    completed: false,

    postponed: false,
  },
];

const TaskPlannerPage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Scheduled & Non-scheduled
  const scheduledTasks = useMemo(
    () =>
      mockTasks.filter(
        (task) =>
          task.dateType === "single" ||
          (task.dateType === "range" && task.completed === false)
      ),
    []
  );
  const nonScheduledTasks = useMemo(
    () =>
      mockTasks.filter(
        (task) => task.dateType === "no-date" && task.completed === false
      ),
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
          <Calendar
            tasks={mockTasks}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />

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
            {selectedDate ? (
              <div className="space-y-3">
                {mockTasks
                  .filter((task) => {
                    if (!task.startDate) return false;
                    if (!task.endDate) return task.startDate === selectedDate;
                    return (
                      selectedDate >= task.startDate &&
                      selectedDate <= task.endDate
                    );
                  })
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                {mockTasks.filter((task) => task.startDate === selectedDate)
                  .length === 0 && (
                  <p className="small-muted-text">No tasks for this date</p>
                )}
              </div>
            ) : (
              <p className="small-muted-text">Click on a date to view tasks</p>
            )}

            <ScheduledTask scheduled={scheduledTasks} />
            <NonScheduledTask nonScheduled={nonScheduledTasks} />
          </div>
        </div>
      </main>

      {showCreateForm && (
        <CreateTaskModal setShowCreateForm={setShowCreateForm} />
      )}
    </>
  );
};

export default TaskPlannerPage;
