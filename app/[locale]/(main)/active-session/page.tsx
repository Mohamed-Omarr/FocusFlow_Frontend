"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DistractionModal } from "./component/DistractionModal";
import { InterruptionModal } from "./component/InterruptionModal";
import { SessionCheckoutForm } from "./component/SessionCheckoutForm";
import { TaskData } from "./types";
import { useSessionTimer } from "./component/useSessionTimer";

export default function ActiveSessionPage() {
  const router = useRouter();

  /* ----------------------------- task ----------------------------- */

  const [taskData, setTaskData] = useState<TaskData | null>(null);

  useEffect(() => {
    const storedTask = sessionStorage.getItem("currentTask");
    if (!storedTask) {
      router.push("/home");
      return;
    }
    setTaskData(JSON.parse(storedTask));
  }, [router]);

  /* ----------------------------- timer ----------------------------- */

  const {
    timeLeft,
    breakTimeLeft,
    isPaused,
    isOnBreak,
    isFinished,

    breaksTaken,
    manualBreaksLeft,
    nextBreakIn,
    showBreakHeadsUp,

    pause,
    resume,
    startManualBreak,
    finishBreak,
    extendSession,
  } = useSessionTimer(taskData);

  /* ----------------------------- ui state ----------------------------- */

  const [showDistractionLogger, setShowDistractionLogger] = useState(false);
  const [interruptionOpen, setInterruptionOpen] = useState(false);
  const [interruptionType, setInterruptionType] = useState<"pause" | "cancel">(
    "pause"
  );
  const [manualConfirmOpen, setManualConfirmOpen] = useState(false);

  /* ----------------------------- handlers ----------------------------- */

  const handlePauseClick = () => {
    setInterruptionType("pause");
    setInterruptionOpen(true);
  };

  const handleCancelClick = () => {
    setInterruptionType("cancel");
    setInterruptionOpen(true);
  };

  const handleInterruptionConfirm = () => {
    setInterruptionOpen(false);

    if (interruptionType === "pause") {
      pause();
      return;
    }
    // cancel confirmed
    sessionStorage.removeItem("currentTask");
    router.push("/home");
  };

  const handleInterruptionCancel = () => {
    setInterruptionOpen(false);
  };

  const confirmManualBreak = () => {
    startManualBreak();
    setManualConfirmOpen(false);
  };

  /* ----------------------------- terminal states ----------------------------- */

  if (isFinished && taskData) {
    return (
      <SessionCheckoutForm
        sessionId={taskData.name}
        onExtend={extendSession}
        onEnd={() => setShowDistractionLogger(true)}
      />
    );
  }

  if (showDistractionLogger && taskData) {
    return (
      <DistractionModal
        sessionId={taskData.name}
        onComplete={() => router.push("/home")}
      />
    );
  }

  if (!taskData) return null;

  /* ----------------------------- derived ----------------------------- */

  const activeSeconds = isOnBreak ? breakTimeLeft : timeLeft;
  const minutes = Math.floor(activeSeconds / 60);
  const seconds = activeSeconds % 60;

  /* ----------------------------- render ----------------------------- */

  return (
    <>
      <InterruptionModal
        open={interruptionOpen}
        onOpenChange={setInterruptionOpen}
        type={interruptionType}
        sessionId={taskData.name}
        onConfirm={handleInterruptionConfirm}
        onCancel={handleInterruptionCancel}
      />

      {/* Manual Break Confirmation */}
      {manualConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-card p-6 rounded-2xl w-80 text-center">
            <p className="mb-4 text-lg font-medium">
              Do you want to take a break now?
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={confirmManualBreak}>Sure</Button>
              <Button
                variant="secondary"
                onClick={() => setManualConfirmOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center px-6 bg-background">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-primary/30 rounded-2xl mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Active Session
            </span>
            <p className="font-bold">{taskData.name}</p>
          </div>
        </div>

        {/* Auto Break Heads-Up */}
        {taskData.breakMode === "auto" &&
          !isOnBreak &&
          showBreakHeadsUp &&
          nextBreakIn !== null && (
            <div className="mb-4 px-6 py-3 bg-yellow-100 border border-yellow-300 rounded-2xl text-center">
              <p className="font-medium text-yellow-800">
                Break coming in {Math.floor(nextBreakIn / 60)}:
                {String(nextBreakIn % 60).padStart(2, "0")} minutes
              </p>
              <p className="text-sm text-yellow-600">
                Breaks left: {Math.max(0, breaksTaken)}
              </p>
            </div>
          )}

        {/* Manual mode info */}
        {taskData.breakMode === "manual" && !isOnBreak && (
          <p className="mb-4 text-sm text-muted-foreground">
            Manual breaks left: {manualBreaksLeft}
          </p>
        )}

        {isOnBreak && (
          <div className="mb-4 px-6 py-3 bg-secondary/20 border border-secondary rounded-2xl">
            <p className="text-secondary font-medium">
              Break Time - Take a rest!
            </p>
          </div>
        )}

        {/* 🔥 ORIGINAL TIMER DESIGN (UNCHANGED) */}
        <div className="relative mb-16">
          <div
            className={`absolute inset-0 rounded-full opacity-30 blur-3xl animate-pulse ${
              isOnBreak
                ? "bg-gradient-to-br from-secondary via-accent to-secondary"
                : "bg-gradient-to-br from-primary via-secondary to-accent"
            }`}
          />
          <div
            className={`relative w-80 h-80 rounded-full bg-elevated border-2 flex items-center justify-center ${
              isOnBreak
                ? "border-secondary/30 glow-secondary"
                : "border-primary/30 glow-primary"
            }`}
          >
            <div className="text-center text-7xl font-mono font-bold text-foreground">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <Button
            onClick={() => (isPaused ? resume() : handlePauseClick())}
            disabled={isOnBreak}
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>

          <Button variant="destructive" onClick={handleCancelClick}>
            Cancel
          </Button>

          {taskData.breakMode === "manual" && manualBreaksLeft > 0 && (
            <Button
              onClick={
                isOnBreak ? finishBreak : () => setManualConfirmOpen(true)
              }
            >
              {isOnBreak
                ? "Finish Break"
                : `Manual Break (${manualBreaksLeft})`}
            </Button>
          )}
        </div>
      </main>
    </>
  );
}
