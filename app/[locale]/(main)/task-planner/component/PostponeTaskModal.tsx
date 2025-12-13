"use client";
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

type PostponeTaskProps = {
  show: boolean;
  setShowPostponeForm: (open: boolean) => void;
  task: {
    id: string;
    startDate?: string | null;
    endDate?: string | null;
    singleDate?: string | null;
    postponed?: boolean;
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

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    resolver: zodResolver(ValidatePostponeTask),
    mode: "onChange",
  });

  const submitHandler = (values) => {
    console.log("Postpone values:", values);
    setShowPostponeForm(false);
    reset();
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

        {!isRange && (
          <div className="space-y-3">
            <Label>Current Date</Label>
            <Input disabled value={task.singleDate ?? ""} />

            <Label>New Date</Label>
            <Input type="date" min={today} {...register("singleDate")} />
          </div>
        )}

        {isRange && (
          <div className="space-y-4">
            <div>
              <Label>Current Start</Label>
              <Input disabled value={task.startDate ?? ""} />

              <Label className="mt-2 block">New Start</Label>
              <Input type="date" min={today} {...register("startDate")} />
            </div>

            <div>
              <Label>Current End</Label>
              <Input disabled value={task.endDate ?? ""} />

              <Label className="mt-2 block">New End</Label>
              <Input type="date" min={today} {...register("endDate")} />
            </div>
          </div>
        )}

        <DialogFooter>
          <AlertDialog>
            <AlertDialogAction asChild>
              <Button disabled={!isValid}>Submit</Button>
            </AlertDialogAction>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You can postpone this task <strong>only once ever</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit(submitHandler)}>
                  Yes, update date
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
