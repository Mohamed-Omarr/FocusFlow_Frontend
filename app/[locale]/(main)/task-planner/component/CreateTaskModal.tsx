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
import { useQueryClient } from "@tanstack/react-query";

import { TaskType, CategoryType, DateType } from "../types";
import { addOneDay } from "../helper";

type TaskState = Omit<TaskType, "id" | "postponed" | "completed">;

type CreateTaskProps = {
  show: boolean;
  setShowCreateForm: (show: boolean) => void;
};

export function CreateTaskModal({ show, setShowCreateForm }: CreateTaskProps) {
  const queryClient = useQueryClient();

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
    defaultValues: {
      name: "",
      category: "work",
      dateType: "no-date",
      reminder: "09:00",
    },
  });

  const dateType = watch("dateType");
  const startDate = watch("startDate");

  const today = new Date().toISOString().split("T")[0];

  const { mutate, isPending } = useAxiosMutation("/task", "POST", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      reset();
      setShowCreateForm(false);
    },
  });

  const handleCreateTask = (values: TaskState) => {
    mutate({
      ...values,
      singleDate: values.singleDate || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      reminder: values.reminder || undefined,
    });
  };

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

        <form onSubmit={handleSubmit(handleCreateTask)} className="space-y-4">
          {/* Name */}
          <div>
            <Label>Task Name</Label>
            <Input {...register("name")} placeholder="Study Math" />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
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
          <div className="flex gap-2">
            {(["no-date", "single", "range"] as DateType[]).map((type) => (
              <Button
                key={type}
                type="button"
                variant={dateType === type ? "default" : "outline"}
                className="flex-1"
                onClick={() =>
                  setValue("dateType", type, { shouldValidate: true })
                }
              >
                {type.replace("-", " ")}
              </Button>
            ))}
          </div>

          {/* Single Date */}
          {dateType === "single" && (
            <div>
              <Label>Date</Label>
              <Input type="date" min={today} {...register("singleDate")} />
            </div>
          )}

          {/* Range Date */}
          {dateType === "range" && (
            <div className="space-y-2">
              <div>
                <Label>Start Date</Label>
                <Input type="date" min={today} {...register("startDate")} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  min={addOneDay(startDate) || today}
                  {...register("endDate")}
                />
              </div>
            </div>
          )}

          {/* Reminder */}
          {(dateType === "single" || dateType === "range") && (
            <div>
              <Label>Reminder</Label>
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
