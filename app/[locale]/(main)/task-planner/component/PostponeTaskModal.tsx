"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { ValidatePostponeTask } from "@/lib/zod/task/validation/task";
import { useAxiosMutation } from "@/lib/axios/useAxiosQuery";
import { queryClient } from "@/lib/utils";
import { CategoryType, TaskType } from "../types";
import { addOneDay } from "../helper";

type DateType = "no_date" | "single" | "range";
type PostponeFormValues = {
  date_start: string | null;
  date_end: string | null;
  single_date: string | null;
  name: string;
  category: string;
  reminder: string | null;
  date_type: DateType;
};

type PostponeTaskProps = {
  show: boolean;
  setShowPostponeForm: (open: boolean) => void;
  task: {
    id: string;
    date_start: string | null;
    date_end: string | null;
    single_date: string | null;
    name: string;
    category: CategoryType;
    reminder: string | null;
    date_type: DateType;
  };
};

export function PostponeTaskModal({
  task,
  show,
  setShowPostponeForm,
}: PostponeTaskProps) {
  const today = new Date().toISOString().split("T")[0];

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<PostponeFormValues | null>(
    null
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, errors },
    reset,
  } = useForm<PostponeFormValues>({
    resolver: zodResolver(ValidatePostponeTask),
    mode: "onChange",
    defaultValues: {
      name: task.name,
      category: task.category,
      reminder: task.reminder,
      date_type: task.date_type ?? "no_date",
    },
  });

  const dateType = watch("date_type");
  const trackStartDate = watch("date_start");

  /* ───────────── CLEAR INVALID STATE WHEN SWITCHING TYPE ───────────── */
  useEffect(() => {
    if (dateType === "single") {
      setValue("date_start", null);
      setValue("date_end", null);
      setValue("reminder", null);
    }

    if (dateType === "range") {
      setValue("single_date", null);
    }

    if (dateType === "no_date") {
      setValue("date_start", null);
      setValue("date_end", null);
      setValue("single_date", null);
      setValue("reminder", null);
    }
  }, [dateType, setValue]);

  /* ───────────── MUTATION ───────────── */
  const { mutate, isPending } = useAxiosMutation(`/task/${task.id}`, "PATCH", {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<TaskType[]>(["tasks"]);

      queryClient.setQueryData<TaskType[]>(["tasks"], (old) =>
        old?.map((t) => (t.id === task.id ? { ...t, ...newData } : t))
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

  /* ───────────── SUBMIT FLOW ───────────── */
  const onSubmit = (values: PostponeFormValues) => {
    setPendingValues(values);
    setConfirmOpen(true);
  };

  const confirmSubmit = () => {
    if (!pendingValues) return;

    const payload: Partial<PostponeFormValues> = {
      name: pendingValues.name,
      category: pendingValues.category,
      date_type: pendingValues.date_type,
    };

    if (pendingValues.date_type !== "single") {
      payload.reminder = pendingValues.reminder;
    }

    if (
      pendingValues.date_type === "range" &&
      pendingValues.single_date &&
      pendingValues.date_end
    ) {
      mutate({
        ...payload,
        date_start: pendingValues.date_start,
        date_end: pendingValues.date_end,
        single_date: null,
      });
    }

    if (pendingValues.date_type === "single") {
      mutate({
        ...payload,
        single_date: pendingValues.single_date,
        date_start: null,
        date_end: null,
        reminder: null,
      });
    }

    if (pendingValues.date_type === "no_date") {
      mutate({
        ...payload,
        date_start: null,
        date_end: null,
        single_date: null,
        reminder: null,
      });
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* NAME */}
          <div>
            <Label>Task Name</Label>
            <Input {...register("name")} />
          </div>

          {/* CATEGORY */}
          <div>
            <Label>Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* DATE TYPE BUTTONS */}
          <div className="space-y-2">
            <Label>Date Type</Label>
            <div className="flex gap-2">
              {(["no_date", "single", "range"] as DateType[]).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={dateType === type ? "default" : "outline"}
                  className="flex-1 capitalize"
                  onClick={() =>
                    setValue("date_type", type, {
                      shouldValidate: true,
                    })
                  }
                >
                  {type.replace("-", " ")}
                </Button>
              ))}
            </div>
          </div>

          {/* REMINDER */}
          {dateType !== "single" && (
            <div>
              <Label>Reminder</Label>
              <Input type="time" {...register("reminder")} />
            </div>
          )}

          {/* SINGLE DATE */}
          {dateType === "single" && (
            <div>
              <Label>New Date</Label>
              <Input type="date" min={today} {...register("single_date")} />
              {errors.single_date && (
                <p className="text-xs text-destructive">
                  {errors.single_date.message}
                </p>
              )}
            </div>
          )}

          {/* RANGE */}
          {dateType === "range" && (
            <div className="space-y-3">
              <div>
                <Label>Start Date</Label>
                <Input type="date" min={today} {...register("date_start")} />
                {errors.date_start && (
                  <p className="text-xs text-destructive">
                    {errors.date_start.message}
                  </p>
                )}
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  min={addOneDay(trackStartDate) || today}
                  {...register("date_end")}
                />
                {errors.date_end && (
                  <p className="text-xs text-destructive">
                    {errors.date_end.message}
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

        {/* CONFIRMATION */}
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
                {isPending ? "Updating..." : "Yes, update task"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
