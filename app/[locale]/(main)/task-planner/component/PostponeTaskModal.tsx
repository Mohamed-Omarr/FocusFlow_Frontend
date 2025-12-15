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
import { TaskType } from "../types";
import { addOneDay } from "../helper";

type DateType = "no-date" | "single" | "range";

type PostponeFormValues = {
  startDate?: string;
  endDate?: string;
  singleDate?: string;

  name?: string;
  category?: string;
  reminder?: string;
  dateType?: DateType;
};

type PostponeTaskProps = {
  show: boolean;
  setShowPostponeForm: (open: boolean) => void;
  task: {
    id: string;
    startDate?: string;
    endDate?: string;
    singleDate?: string;
    name?: string;
    category?: string;
    reminder?: string;
    dateType?: DateType;
  };
};

export function PostponeTaskModal({
  task,
  show,
  setShowPostponeForm,
}: PostponeTaskProps) {
  const today = new Date().toISOString().split("T")[0];

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<PostponeFormValues | null>(null);

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
      dateType: task.dateType ?? "no-date",
    },
  });

  const dateType = watch("dateType");
  const trackStartDate = watch("startDate");

  /* ───────────── CLEAR INVALID STATE WHEN SWITCHING TYPE ───────────── */
  useEffect(() => {
    if (dateType === "single") {
      setValue("startDate", undefined);
      setValue("endDate", undefined);
      setValue("reminder", undefined);
    }

    if (dateType === "range") {
      setValue("singleDate", undefined);
    }

    if (dateType === "no-date") {
      setValue("startDate", undefined);
      setValue("endDate", undefined);
      setValue("singleDate", undefined);
      setValue("reminder", undefined);
    }
  }, [dateType, setValue]);

  /* ───────────── MUTATION ───────────── */
  const { mutate, isPending } = useAxiosMutation(
    `/task/${task.id}`,
    "PATCH",
    {
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["tasks"] });

        const previousTasks =
          queryClient.getQueryData<TaskType[]>(["tasks"]);

        queryClient.setQueryData<TaskType[]>(["tasks"], (old) =>
          old?.map((t) =>
            t.id === task.id ? { ...t, ...newData } : t
          )
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
    }
  );

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
      dateType: pendingValues.dateType,
    };

    if (pendingValues.dateType !== "single") {
      payload.reminder = pendingValues.reminder;
    }

    if (
      pendingValues.dateType === "range" &&
      pendingValues.startDate &&
      pendingValues.endDate
    ) {
      mutate({
        ...payload,
        startDate: pendingValues.startDate,
        endDate: pendingValues.endDate,
        singleDate: undefined,
      });
    }

    if (pendingValues.dateType === "single") {
      mutate({
        ...payload,
        singleDate: pendingValues.singleDate,
        startDate: undefined,
        endDate: undefined,
        reminder: undefined,
      });
    }

    if (pendingValues.dateType === "no-date") {
      mutate({
        ...payload,
        startDate: undefined,
        endDate: undefined,
        singleDate: undefined,
        reminder: undefined,
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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
              {(["no-date", "single", "range"] as DateType[]).map(
                (type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={
                      dateType === type ? "default" : "outline"
                    }
                    className="flex-1 capitalize"
                    onClick={() =>
                      setValue("dateType", type, {
                        shouldValidate: true,
                      })
                    }
                  >
                    {type.replace("-", " ")}
                  </Button>
                )
              )}
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
              <Input
                type="date"
                min={today}
                {...register("singleDate")}
              />
              {errors.singleDate && (
                <p className="text-xs text-destructive">
                  {errors.singleDate.message}
                </p>
              )}
            </div>
          )}

          {/* RANGE */}
          {dateType === "range" && (
            <div className="space-y-3">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  min={today}
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  min={addOneDay(trackStartDate) || today}
                  {...register("endDate")}
                />
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

        {/* CONFIRMATION */}
        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You can postpone this task{" "}
                <strong>only once ever</strong>.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={confirmSubmit}
              >
                {isPending ? "Updating..." : "Yes, update task"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
