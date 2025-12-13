"use client";

import { useReducer } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TaskType, CategoryType, DateType } from "../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ValidateCreateTask } from "@/lib/zod/task/validation/task";

type TaskState = Omit<TaskType, "id" | "postponed" | "completed">;

type TaskAction =
  | { type: "SET_FIELD"; field: keyof TaskState; value: string }
  | { type: "SET_REMINDER_TIME"; value: string };

type CreateTaskProps = {
  show: boolean;
  setShowCreateForm: (show: boolean) => void;
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_REMINDER_TIME":
      return { ...state, reminder: action.value };
    default:
      return state;
  }
}

export function CreateTaskModal({ show, setShowCreateForm }: CreateTaskProps) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<TaskState>({
    resolver: zodResolver(ValidateCreateTask),
    defaultValues: {
      name: "",
      category: "work" as CategoryType,
      dateType: "no-date" as DateType,
      singleDate: "",
      startDate: "",
      endDate: "",
      reminder: "09:00",
    },
    mode: "onChange",
  });

  const today = new Date().toISOString().split("T")[0];

  const [task, dispatch] = useReducer(taskReducer, getValues());

  const handleCreateTask = () => {
    try {
      const newTask: TaskState = {
        name: task.name,
        category: task.category as CategoryType,
        dateType: task.dateType as DateType,
        singleDate: task.singleDate || undefined,
        startDate: task.startDate || undefined,
        endDate: task.endDate || undefined,
        reminder: task.reminder || undefined,
      };

      console.log("Created Task:", newTask);
      const savedTasks = JSON.parse(
        localStorage.getItem("focusflow-tasks") || "[]"
      );
      localStorage.setItem(
        "focusflow-tasks",
        JSON.stringify([...savedTasks, newTask])
      );
      reset();
      setShowCreateForm(false);
    } catch (err) {}
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
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleCreateTask)}
          className="space-y-4 mt-2"
        >
          {/* Task Name */}
          <div>
            <Label>Task Name</Label>
            <Input
              value={task.name}
              {...register("name")}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELD",
                  field: "name",
                  value: e.target.value,
                })
              }
              placeholder="e.g., Study Math"
            />
            {errors.name && (
              <p className="text-destructive">{errors.name?.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              {...register("category")}
              value={task.category}
              onValueChange={(value) =>
                dispatch({ type: "SET_FIELD", field: "category", value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="study">Study</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Type Buttons */}
          <div className="flex gap-2">
            {["no-date", "single", "range"].map((type) => (
              <Button
                key={type}
                {...register("dateType")}
                variant={task.dateType === type ? "default" : "outline"}
                className="flex-1"
                onClick={() =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "dateType",
                    value: type,
                  })
                }
              >
                {type.replace("-", " ")}
              </Button>
            ))}
            {errors.category && (
              <p className="text-destructive">{errors.category?.message}</p>
            )}
          </div>

          {/* Single Date */}
          {task.dateType === "single" && (
            <div>
              <Label>Task Date</Label>
              <Input
                {...register("singleDate")}
                type="date"
                min={today}
                value={task.singleDate}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    field: "singleDate",
                    value: e.target.value,
                  })
                }
              />
              {errors.singleDate && (
                <p className="text-destructive">{errors.singleDate?.message}</p>
              )}
            </div>
          )}

          {/* Range Date */}
          {task.dateType === "range" && (
            <div className="space-y-2">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  min={today}
                  {...register("startDate")}
                  value={task.startDate}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    dispatch({
                      type: "SET_FIELD",
                      field: "startDate",
                      value: newStart,
                    });
                    if (task.endDate && task.endDate < newStart) {
                      dispatch({
                        type: "SET_FIELD",
                        field: "endDate",
                        value: newStart,
                      });
                    }
                  }}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  {...register("endDate")}
                  min={task.startDate || today}
                  value={task.endDate}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: "endDate",
                      value: e.target.value,
                    })
                  }
                />
              </div>
              {(errors.startDate || errors.endDate) && (
                <p className="text-destructive">
                  {errors.startDate?.message || errors.endDate?.message}
                </p>
              )}
            </div>
          )}

          {/* Reminder */}
          {(task.dateType === "single" || task.dateType === "range") && (
            <div>
              <Label>Reminder Time</Label>
              <Input
                type="time"
                value={task.reminder}
                onChange={(e) =>
                  dispatch({ type: "SET_REMINDER_TIME", value: e.target.value })
                }
              />
              {errors.reminder && (
                <p className="text-destructive">{errors.reminder?.message}</p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <DialogFooter>
            <Button disabled={isSubmitting} type="submit" className="w-full">
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
