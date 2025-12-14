"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ValidatePostponeTask } from "@/lib/zod/task/validation/task";
import { useAxiosMutation } from "@/lib/axios/useAxiosQuery";
import { queryClient } from "@/lib/utils";
import { TaskType } from "../types";
import { addOneDay } from "../helper";

type PostponeFormValues = {
  startDate?: string;
  endDate?: string;
  singleDate?: string;
};

type PostponeTaskProps = {
  show: boolean;
  setShowPostponeForm: (open: boolean) => void;
  task: {
    id: string;
    startDate?: string;
    endDate?: string;
    singleDate?: string;
  };
};

export function PostponeTaskModal({
  task,
  show,
  setShowPostponeForm,
}: PostponeTaskProps) {
  const isRange =
    task.startDate && task.endDate && task.startDate !== task.endDate;

  const today = new Date().toISOString().split("T")[0];

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<PostponeFormValues | null>(
    null
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
    reset,
  } = useForm<PostponeFormValues>({
    resolver: zodResolver(ValidatePostponeTask),
    mode: "onChange",
  });

  const trackStartDate = watch("startDate");

  const { mutate, isPending } = useAxiosMutation("/task/123", "PATCH", {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<TaskType[]>(["tasks"]);

      queryClient.setQueryData<TaskType[]>(["tasks"], (old) =>
        old?.map((task) => (task.id === "123" ? { ...task, ...newData } : task))
      );

      return { previousTasks };
    },
    onSuccess: () => {
      reset();
      setShowPostponeForm(false);
    },
    onError: (_err, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // Step 1: validate & open confirmation
  const onSubmit = (values: PostponeFormValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  // Step 2: confirm & mutate
  const confirmSubmit = () => {
    if (!pendingValues) return;

    if (pendingValues.startDate && pendingValues.endDate) {
      mutate({
        startDate: pendingValues.startDate,
        endDate: pendingValues.endDate,
      });
    } else {
      mutate({ singleDate: pendingValues.singleDate });
    }
  };

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) reset();
        setShowPostponeForm(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Postpone Task</DialogTitle>
          <DialogDescription>
            You can postpone this task <strong>only once</strong>.
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isRange && (
            <div className="space-y-3">
              <Label>Current Date</Label>
              <Input disabled defaultValue={task.singleDate ?? ""} />

              <Label>New Date</Label>
              <Input type="date" min={today} {...register("singleDate")} />
              {errors.singleDate && (
                <p className="text-xs text-destructive">
                  {errors.singleDate.message}
                </p>
              )}
            </div>
          )}

          {isRange && (
            <div className="space-y-4">
              <div>
                <Label>Current Start</Label>
                <Input disabled defaultValue={task.startDate ?? ""} />

                <Label className="mt-2 block">New Start</Label>
                <Input type="date" min={today} {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-xs text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Current End</Label>
                <Input disabled defaultValue={task.endDate ?? ""} />

                <Label className="mt-2 block">New End</Label>
                <Input
                  type="date"
                  min={addOneDay(trackStartDate) || today}
                  {...register("endDate")}
                />
                <p className="text-muted-foreground text-sm">
                  End date cannot be earlier than start date
                </p>
                {errors.endDate && (
                  <p className="text-xs text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={!isValid}>
              Submit
            </Button>
          </DialogFooter>
        </form>

        {/* CONFIRMATION DIALOG */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You can postpone this task <strong>only once ever</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={isPending} onClick={confirmSubmit}>
                {isPending ? "Updating..." : "Yes, update date"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
