"use client";

import { Button } from "@/components/ui/button";

interface ControlButtonsProps {
  isPaused: boolean;
  isOnBreak: boolean;
  manualBreaksLeft: number;
  breakDuration: number;
  breakMode: "auto" | "manual";
  onPauseClick: () => void;
  onCancelClick: () => void;
  onManualBreakClick: () => void;
  onFinishBreak: () => void;
}

export function ControlButtons({
  isPaused,
  isOnBreak,
  manualBreaksLeft,
  breakDuration,
  breakMode,
  onPauseClick,
  onCancelClick,
  onManualBreakClick,
  onFinishBreak,
}: ControlButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <Button onClick={onPauseClick} disabled={isOnBreak}>
          {isPaused ? "Resume" : "Pause"}
        </Button>

        <Button variant="destructive" onClick={onCancelClick}>
          Cancel
        </Button>

        {breakMode === "manual" && manualBreaksLeft > 0 && (
          <Button
            onClick={isOnBreak ? onFinishBreak : onManualBreakClick}
            variant={isOnBreak ? "secondary" : "outline"}
          >
            {isOnBreak
              ? "Finish Break"
              : `Manual Break (${manualBreaksLeft} left, ${breakDuration} min)`}
          </Button>
        )}
      </div>
    </div>
  );
}
