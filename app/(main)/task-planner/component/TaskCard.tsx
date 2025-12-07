"use client";

import { X } from "lucide-react";

export function TaskCard({ task }: { task: Task }) {
  const handleDeleteTask = (id: string) => {
    // send to backend 
  };

  return (
    <div className="rounded-xl p-3 border border-border">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm text-foreground">{task.name}</h4>
        <button
          onClick={() => handleDeleteTask(task.id)}
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

      {task.reminder && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground font-medium mb-1">
            Reminder:
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg font-medium">
              {task.reminder.time}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
