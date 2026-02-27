"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

import { MoreVertical, CalendarClock, Trash2 } from "lucide-react";
import { PostponeTaskModal } from "./PostponeTaskModal";
import { TaskType } from "../types";
import { useAxiosMutation } from "@/lib/axios/useAxiosQuery";
import { queryClient } from "@/lib/utils";

type TaskCardType = Omit<TaskType, "completed">;

export function TaskCard({ task }: { task: TaskCardType }) {
  const [showPostponeForm, setShowPostponeForm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const isRange =
    task.date_start && task.date_end && task.date_start !== task.date_end;

  const canPostpone = !task.postponed;

  const { mutate,isPending } = useAxiosMutation(`/tasks/${task.id}`, "DELETE", {
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<TaskType[]>(["tasks"]);

      queryClient.setQueryData<TaskType[]>(["tasks"], (old) =>
        old?.filter((t) => t.id !== task.id),
      );

      return { previousTasks };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <div className="rounded-xl p-3 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold text-sm text-foreground">{task.name}</h4>

          {task.category && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium">
              {task.category}
            </span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded-md hover:bg-accent">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            {canPostpone && (
              <>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowPostponeForm(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <CalendarClock className="w-4 h-4" />
                  Postpone
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem
              onClick={() => setOpenDeleteConfirm(true)}
              className="text-destructive flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dates */}
      <div className="flex flex-col gap-2 text-xs text-muted-foreground mt-2">
        {task.single_date && (
          <span>
            Date:{" "}
            {new Date(task.single_date + "T00:00:00").toLocaleDateString()}
          </span>
        )}

        {!task.single_date && task.date_start && (
          <span>
            Date: {new Date(task.date_start + "T00:00:00").toLocaleDateString()}
            {isRange && task.date_end
              ? ` – ${new Date(
                  task.date_end + "T00:00:00",
                ).toLocaleDateString()}`
              : ""}
          </span>
        )}

        {task.reminder && (
          <span className="font-medium">Reminder Time: {task.reminder}</span>
        )}
      </div>

      {/* Postpone Modal */}
      {showPostponeForm && (
        <PostponeTaskModal
          show={showPostponeForm}
          setShowPostponeForm={setShowPostponeForm}
          task={task}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                mutate(undefined);
                setOpenDeleteConfirm(false);
              }}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
