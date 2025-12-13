"use client";

import { useState, useEffect, useReducer } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

import { MoreVertical, CalendarClock, Trash2 } from "lucide-react";
import { TaskType } from "../types";

type TaskCardType = Omit<TaskType, "completed">;
type DateState = {
  newSingleDate: string;
  newStart: string;
  newEnd: string;
};

type DateAction =
  | { type: "SET_NEW_SINGLE_DATE"; payload: string }
  | { type: "SET_NEW_START"; payload: string }
  | { type: "SET_NEW_END"; payload: string }
  | { type: "RESET" };

const dateReducer = (state: DateState, action: DateAction): DateState => {
  switch (action.type) {
    case "SET_NEW_SINGLE_DATE":
      return { ...state, newSingleDate: action.payload };
    case "SET_NEW_START":
      return { ...state, newStart: action.payload };
    case "SET_NEW_END":
      return { ...state, newEnd: action.payload };
    case "RESET":
      return { newSingleDate: "", newStart: "", newEnd: "" };
    default:
      return state;
  }
};

// -------------------------
// TaskCard component
// -------------------------
export function TaskCard({ task }: { task: TaskCardType }) {
  const [openPostpone, setOpenPostpone] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const [dateState, dispatchDate] = useReducer(dateReducer, {
    newSingleDate: "",
    newStart: "",
    newEnd: "",
  });

  const today = new Date().toISOString().split("T")[0];
  const isRange =
    task.startDate && task.endDate && task.startDate !== task.endDate;
  const canPostpone = !task.postponed;

  // -------------------------
  // Auto-fix range validation
  // -------------------------
  useEffect(() => {
    if (
      isRange &&
      dateState.newStart &&
      dateState.newEnd &&
      dateState.newEnd < dateState.newStart
    ) {
      dispatchDate({ type: "SET_NEW_END", payload: dateState.newStart });
    }
  }, [dateState.newStart, dateState.newEnd, isRange]);

  const handleDeleteTask = (id: string) => {
    console.log("Delete:", id);
    // backend logic here
    setOpenDeleteConfirm(false);
  };

  const handlePostpone = () => {
    const updated = {
      ...task,
      postponed: true,
      startDate: isRange ? dateState.newStart : dateState.newSingleDate,
      endDate: isRange ? dateState.newEnd : dateState.newSingleDate,
    };
    dispatchDate({ type: "SET_NEW_END", payload: dateState.newStart });
    console.log("Postponed:", updated);
    // backend logic here

    setOpenConfirm(false);
    setOpenPostpone(false);
  };

  return (
    <div className="rounded-xl p-3 border border-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm text-foreground">{task.name}</h4>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 rounded-md hover:bg-accent">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            {canPostpone && (
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setOpenPostpone(true);
                }}
                className="flex items-center gap-2"
              >
                <CalendarClock className="w-4 h-4" />
                <span>Postpone</span>
              </DropdownMenuItem>
            )}

            {canPostpone && <DropdownMenuSeparator />}

            {/* Delete */}
            <DropdownMenuItem
              onClick={() => setOpenDeleteConfirm(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Category */}
      {task.category && (
        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-lg font-medium">
          {task.category}
        </span>
      )}

      {/* Date Range */}
      {isRange && (
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(task.startDate + "T00:00:00").toLocaleDateString()} –{" "}
          {new Date(task.endDate + "T00:00:00").toLocaleDateString()}
        </p>
      )}

      {/* Single date */}
      {!isRange && task.startDate && (
        <p className="text-xs text-muted-foreground mt-2">
          {new Date(task.startDate + "T00:00:00").toLocaleDateString()}
        </p>
      )}

      {/* Reminder */}
      {task.reminder && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground font-medium mb-1">
            Reminder:
          </p>
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg font-medium">
              {task.reminder}
            </span>
          </div>
        </div>
      )}

      {/* POSTPONE POPUP */}
      <Dialog open={openPostpone} onOpenChange={setOpenPostpone}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Postpone Task</DialogTitle>
            <DialogDescription>
              You can only postpone this task <strong>once ever</strong>.
            </DialogDescription>
          </DialogHeader>

          {/* SINGLE DATE */}
          {!isRange && (
            <div className="space-y-3">
              <Label>Current Date</Label>
              <Input disabled value={task.startDate || ""} />

              <Label>New Date</Label>
              <Input
                type="date"
                min={today}
                value={dateState.newSingleDate}
                onChange={(e) =>
                  dispatchDate({
                    type: "SET_NEW_SINGLE_DATE",
                    payload: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* RANGE DATE */}
          {isRange && (
            <div className="space-y-4">
              {/* Start */}
              <div>
                <Label>Current Start</Label>
                <Input disabled value={task.startDate} />

                <Label className="mt-2 block">New Start</Label>
                <Input
                  type="date"
                  min={today}
                  value={dateState.newStart}
                  onChange={(e) =>
                    dispatchDate({
                      type: "SET_NEW_START",
                      payload: e.target.value,
                    })
                  }
                />
              </div>

              {/* End */}
              <div>
                <Label>Current End</Label>
                <Input disabled value={task.endDate} />

                <Label className="mt-2 block">New End</Label>
                <Input
                  type="date"
                  min={dateState.newStart || today}
                  value={dateState.newEnd}
                  onChange={(e) =>
                    dispatchDate({
                      type: "SET_NEW_END",
                      payload: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              disabled={
                (!isRange && !dateState.newSingleDate) ||
                (isRange && (!dateState.newStart || !dateState.newEnd))
              }
              onClick={() => setOpenConfirm(true)}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION FOR POSTPONE */}
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You can postpone this task <strong>only once ever</strong>. After
              this, you won't be able to change the dates again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePostpone}>
              Yes, update date
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CONFIRM DELETE */}
      <AlertDialog open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteTask(task.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
