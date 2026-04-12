"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ValidateCreateTask } from "@/lib/zod/task/validation/task";
import { useAxiosMutation } from "@/lib/axios/useAxiosQuery";

import { TaskType, DateType } from "../types";
import { addOneDay } from "../helper";
import { queryClient } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

type TaskState = Omit<TaskType, "id" | "postponed" | "completed">;

type CreateTaskProps = {
  show: boolean;
  setShowCreateForm: (show: boolean) => void;
};

export function CreateTaskModal({ show, setShowCreateForm }: CreateTaskProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<TaskState>({
    resolver: zodResolver(ValidateCreateTask),
    mode: "onChange",
    shouldUnregister: true,
    defaultValues: {
      category: "work",
      date_type: "no_date",
    },
  });

  const dateType = watch("date_type");
  const dateStart = watch("date_start");

  const today = new Date().toISOString().split("T")[0];

  const { mutate, isPending } = useAxiosMutation("/tasks", "POST", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("created successfully");
      reset();
      setShowCreateForm(false);
    },
  });

  const handleCreateTask = (values: TaskState) => {
    mutate({
      ...values,
      single_date: values.single_date || null,
      date_start: values.date_start || null,
      date_end: values.date_end || null,
      reminder: values.reminder || null,
    });
  };

  useEffect(() => {
    if (dateType === "no_date") {
      setValue("single_date", null);
      setValue("date_start", null);
      setValue("date_end", null);
      setValue("reminder", null);
    }

    if (dateType === "single") {
      setValue("date_start", null);
      setValue("date_end", null);
      setValue("reminder", null);
    }

    if (dateType === "range") {
      setValue("single_date", null);
      setValue("reminder", null);
    }
  }, [dateType, setValue]);

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) reset();
        setShowCreateForm(open);
      }}
    >
      <DialogContent className="sm:max-w-md w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleCreateTask)}
          className="space-y-4"
          autoComplete="off"
        >
          {/* Name */}
          <div>
            <Label className="mb-2">Task Name</Label>
            <Input {...register("name")} placeholder="learn coding" />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label className="mb-2">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
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

          {/* Date Type */}
          <div className="flex flex-row gap-2 ">
            <Label> Date Type</Label>
            {(["no_date", "single"] as DateType[]).map((type) => (
              <Button
                key={type}
                type="button"
                variant={dateType === type ? "default" : "outline"}
                className="flex-1"
                onClick={() =>
                  setValue("date_type", type, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                {type.replace("_", " ")}
              </Button>
            ))}
          </div>

          {/* Single Date */}
          {dateType === "single" && (
            <div>
              <Label className="mb-2">Date</Label>
              <Input type="date" min={today} {...register("single_date")} />
            </div>
          )}

          {/* Range Date */}
          {dateType === "range" && (
            <div className="space-y-2">
              <div>
                <Label>Start Date</Label>
                <Input type="date" min={today} {...register("date_start")} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  min={addOneDay(dateStart) || today}
                  {...register("date_end")}
                />
              </div>
            </div>
          )}

          {/* Reminder */}
          {(dateType === "single" || dateType === "range") && (
            <div>
              <Label className="mb-2">Reminder</Label>
              <Input type="time" {...register("reminder")} />
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full"
            >
              {isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
