"use client";
import { useState } from "react";
import { CalendarX, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { TaskType } from "../types";

type NonScheduledTask = Omit<
  TaskType,
  "completed" | "date_type" | "reminder"
> & {
  date_type: "no_date";
  reminder: null;
};

export default function NonScheduledTask({
  nonScheduled,
}: {
  nonScheduled: NonScheduledTask[];
}) {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const handleFinalDelete = async () => {
    try {
      // await handleDeleteTask(selectedId);
      setOpenDelete(false);
    } catch (err) {}
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-2">
        <CalendarX className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-xs font-medium text-foreground uppercase tracking-wide">
          Non-Scheduled Tasks
        </h4>
      </div>

      {/* LIST */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {nonScheduled.filter((task) => !task.date_start).length === 0 ? (
          <p className="text-xs text-muted-foreground">No tasks found</p>
        ) : (
          nonScheduled
            .filter((task) => !task.date_start)
            .map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-2 bg-elevated rounded-lg border border-border"
              >
                {/* LEFT SIDE */}
                <div className="flex-1">
                  {/* INLINE name + category */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-foreground">
                      {task.name}
                    </p>

                    {task.category && (
                      <span className="px-1.5 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full">
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => confirmDelete(task.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
        )}
      </div>

      {/* DELETE CONFIRMATION DIALOG */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The task will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleFinalDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
