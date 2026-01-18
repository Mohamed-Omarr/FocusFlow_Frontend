"use client";

import { useState } from "react";
import { Calendar, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { TaskType } from "../types";
import { queryClient } from "@/lib/utils";
import { useAxiosMutation } from "@/lib/axios/useAxiosQuery";

type ScheduledTask = Omit<TaskType, "completed" | "date_type" | "reminder"> & {
  date_type: "single" | "range";
  reminder: string;
};

export default function ScheduledTask({
  scheduled,
}: {
  scheduled: ScheduledTask[];
}) {
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* ───────────── DELETE MUTATION ───────────── */
  const { mutate: deleteTask, isPending } = useAxiosMutation(
    `/tasks/${selectedId}`,
    "DELETE",
    {
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["tasks"] });

        const previousTasks = queryClient.getQueryData<TaskType[]>(["tasks"]);

        // ✅ REMOVE task optimistically
        queryClient.setQueryData<TaskType[]>(["tasks"], (old) =>
          old?.filter((t) => t.id !== selectedId),
        );

        return { previousTasks };
      },
      onError: (_err, context) => {
        queryClient.setQueryData(["tasks"], context?.previousTasks);
      },
      onSettled: () => {
        setOpenDelete(false);
        setSelectedId(null);
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
      },
    },
  );

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setOpenDelete(true);
  };

  const handleFinalDelete = () => {
    if (!selectedId) return;
    deleteTask(undefined); // 👈 required argument
  };

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-xs font-medium text-foreground uppercase tracking-wide">
          Scheduled Tasks
        </h4>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {scheduled.length === 0 ? (
          <p className="text-xs text-muted-foreground">No tasks found</p>
        ) : (
          scheduled.map((task) => (
            <div
              key={task.id}
              className="flex items-start justify-between p-2 bg-elevated rounded-lg border border-border"
            >
              {/* LEFT SIDE */}
              <div className="flex-1">
                {/* Task Name + Category inline */}
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
                {/* Date Range or Single */}
                <p className="text-[10px] mt-1 text-muted-foreground">
                  <span className="font-medium text-foreground">Date:</span>{" "}
                  {task.single_date
                    ? task.single_date
                    : task.date_start &&
                        task.date_end &&
                        task.date_end !== task.date_start
                      ? `${task.date_start} / ${task.date_end}`
                      : task.date_start}
                </p>

                {/* Reminder */}
                <p className="text-[10px] mt-1 text-muted-foreground">
                  <span className="font-medium text-foreground">Reminder:</span>{" "}
                  {task.reminder}
                </p>
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

      {/* DELETE CONFIRMATION */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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
              onClick={handleFinalDelete}
              disabled={isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
