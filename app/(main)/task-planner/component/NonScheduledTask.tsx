import { CalendarX, X } from "lucide-react";
import React from "react";

export default function NonScheduledTask({tasks}) {
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-2 mb-2">
        <CalendarX className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-xs font-medium text-foreground uppercase tracking-wide">
          Non-Scheduled Tasks
        </h4>
      </div>
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {tasks.filter((task) => !task.startDate).length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No tasks Found
          </p>
        ) : (
          tasks
            .filter((task) => !task.startDate)
            .map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-2 bg-elevated rounded-lg border border-border"
              >
                <div className="flex-1">
                  <p className="text-xs font-medium text-foreground">
                    {task.name}
                  </p>
                  {task.category && (
                    <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                      {task.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
