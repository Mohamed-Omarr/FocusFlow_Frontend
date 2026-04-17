"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";

import Calendar from "./component/Calendar";
import ScheduledTask from "./component/ScheduledTask";
import NonScheduledTask from "./component/NonScheduledTask";
import { CreateTaskModal } from "./component/CreateTaskModal";
import { TaskCard } from "./component/TaskCard";
import { Button } from "@/components/ui/button";

import { TaskType } from "./types";
import { useAxiosGet } from "@/lib/axios/useAxiosQuery";

/* ============================
   Types
============================ */
type TaskPage = Omit<TaskType, "completed"> & {
  completed: false;
};

/* ============================
   Component
============================ */
export default function TaskPlannerPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  /* ============================
     React Query
  ============================ */
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useAxiosGet<TaskPage[]>(["tasks"], "/tasks");

  /* ============================
     Derived task groups
  ============================ */
  const scheduledTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.date_type === "single" || task.date_type === "range",
      ),
    [tasks],
  );

  const nonScheduledTasks = useMemo(
    () => tasks.filter((task) => task.date_type === "no_date"),
    [tasks],
  );

  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];

    return tasks.filter((task) => {
      if (task.single_date) {
        return task.single_date === selectedDate;
      }

      if (!task.date_start) return false;
      if (!task.date_end) return task.date_start === selectedDate;

      return selectedDate >= task.date_start && selectedDate <= task.date_end;
    });
  }, [tasks, selectedDate]);

  /* ============================
     Loading / Error states
  ============================ */
  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading tasks…</div>;
  }

  if (isError) {
    return <div className="p-6 text-destructive">Failed to load tasks</div>;
  }

  /* ============================
     UI
  ============================ */
  return (
    <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex-center-between mb-6 border border-border/50 backdrop-blur-xl bg-background/60 rounded-full px-6 py-3">
        <h1 className="text-2xl font-bold text-foreground">Task Planner</h1>

        <Button
          onClick={() => setShowCreateForm(true)}
          className="flex flex-center gap-2 px-4 py-2 bg-primary btn-text rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 text-sm shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Calendar
          tasks={tasks}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {/* Task Panel */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-sm h-fit">
          <h3 className="text-base font-semibold text-foreground mb-4">
            {selectedDate
              ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric" },
                )
              : "Select a date"}
          </h3>

          {/* Selected Date Tasks */}
          {selectedDate ? (
            selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <p className="small-muted-text">No tasks for this date</p>
            )
          ) : (
            <p className="small-muted-text">Click on a date to view tasks</p>
          )}

          <ScheduledTask scheduled={scheduledTasks} />
          <NonScheduledTask nonScheduled={nonScheduledTasks} />
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateForm && (
        <CreateTaskModal
          show={showCreateForm}
          setShowCreateForm={setShowCreateForm}
        />
      )}
    </main>
  );
}
