"use client";

import { useState, useEffect } from "react";

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

export function TaskCard({ task }: { task: Task }) {
  const [openPostpone, setOpenPostpone] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  // new dates
  const [newDate, setNewDate] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const isRange =
    task.startDate && task.endDate && task.startDate !== task.endDate;
  const canPostpone = !task.postponed;

  // -------------------------
  // AUTO FIX RANGE VALIDATION
  // -------------------------
  useEffect(() => {
    if (isRange && newStart && newEnd && newEnd < newStart) {
      setNewEnd(newStart); // enforce end >= start
    }
  }, [newStart, newEnd, isRange]);

  const handleDeleteTask = (id: string) => {
    console.log("Delete:", id);
    // backend logic here
    setOpenDeleteConfirm(false);
  };

  const handlePostponeFinal = () => {
    const updated = {
      ...task,
      postponed: true,
      startDate: isRange ? newStart : newDate,
      endDate: isRange ? newEnd : newDate,
    };

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
              {task.reminder.time}
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
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
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
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                />
              </div>

              {/* End */}
              <div>
                <Label>Current End</Label>
                <Input disabled value={task.endDate} />

                <Label className="mt-2 block">New End</Label>
                <Input
                  type="date"
                  min={newStart || today}
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              disabled={
                (!isRange && !newDate) || (isRange && (!newStart || !newEnd))
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
            <AlertDialogAction onClick={handlePostponeFinal}>
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
