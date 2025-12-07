"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PostSession } from "../component/SessionCheckinForm";
import { DistractionModal } from "./component/DistractionModal";
import { InterruptionModal } from "./component/InterruptionModal";
import { Button } from "@/components/ui/button"; // shadcn Button

export default function ActiveSessionPage() {
  const router = useRouter();
  const [taskData, setTaskData] = useState<{
    name: string;
    duration: number;
    breakMode: "auto" | "manual";
  } | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [scheduledBreaks, setScheduledBreaks] = useState<number[]>([]);
  const [manualBreaksLeft, setManualBreaksLeft] = useState(0);
  const [nextBreakIn, setNextBreakIn] = useState<number | null>(null);
  const [showBreakHeadsUp, setShowBreakHeadsUp] = useState(false);

  const [showPostSession, setShowPostSession] = useState(false);
  const [showDistractionLogger, setShowDistractionLogger] = useState(false);

  const [interruptionOpen, setInterruptionOpen] = useState(false);
  const [interruptionType, setInterruptionType] = useState<"pause" | "cancel">(
    "pause"
  );
  const [manualConfirmOpen, setManualConfirmOpen] = useState(false);

  useEffect(() => {
    const storedTask = sessionStorage.getItem("currentTask");
    if (storedTask) {
      const task = JSON.parse(storedTask);
      setTaskData(task);
      setTimeLeft(task.duration * 60);

      const { duration } = task;
      const { numBreaks } = getBreakInfo(duration);
      const breaks: number[] =
        numBreaks > 0
          ? Array.from({ length: numBreaks }, (_, i) =>
              Math.round(((i + 1) / (numBreaks + 1)) * duration * 60)
            )
          : [];

      setScheduledBreaks(breaks);

      if (task.breakMode === "manual") setManualBreaksLeft(numBreaks);
    } else {
      router.push("/home");
    }
  }, [router]);

  const getBreakInfo = (duration: number) => {
    let breakDuration = 0;
    let numBreaks = 0;

    if (duration < 25) return { breakDuration, numBreaks };
    else if (duration <= 60) {
      breakDuration = 5;
      numBreaks = duration <= 40 ? 1 : 2;
    } else if (duration <= 120) {
      breakDuration = 10;
      numBreaks = 2;
    } else if (duration <= 180) {
      breakDuration = 15;
      numBreaks = 3;
    } else if (duration <= 240) {
      breakDuration = 20;
      numBreaks = 4;
    } else if (duration <= 300) {
      breakDuration = 25;
      numBreaks = 5;
    } else {
      breakDuration = 25;
      numBreaks = 6;
    }

    return { breakDuration, numBreaks };
  };

  useEffect(() => {
    if (!taskData || isPaused || showPostSession || showDistractionLogger)
      return;

    const interval = setInterval(() => {
      if (isOnBreak) {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            setIsOnBreak(false);
            updateNextBreak();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowPostSession(true);
            return 0;
          }

          const elapsed = taskData.duration * 60 - prev + 1;

          // Auto Break Mode
          if (
            taskData.breakMode === "auto" &&
            scheduledBreaks.includes(elapsed) &&
            !isOnBreak
          ) {
            const { breakDuration } = getBreakInfo(taskData.duration);
            setIsOnBreak(true);
            setBreakTimeLeft(breakDuration * 60);
            setBreaksTaken((b) => b + 1);
            updateNextBreak();
            setShowBreakHeadsUp(false);
          } else {
            // Update countdown to next break
            if (nextBreakIn !== null) {
              const newNextBreak = nextBreakIn - 1;
              setNextBreakIn(newNextBreak);

              // Show heads-up 1 minute before break
              if (newNextBreak <= 60 && newNextBreak > 0) setShowBreakHeadsUp(true);
              else setShowBreakHeadsUp(false);
            }
          }

          return prev - 1;
        });
      }
    }, 1000);

    const updateNextBreak = () => {
      const elapsed = taskData.duration * 60 - timeLeft;
      const remainingBreaks = scheduledBreaks.filter((b) => b > elapsed);
      if (remainingBreaks.length > 0) setNextBreakIn(remainingBreaks[0] - elapsed);
      else {
        setNextBreakIn(null);
        setShowBreakHeadsUp(false);
      }
    };

    updateNextBreak();

    return () => clearInterval(interval);
  }, [
    taskData,
    isPaused,
    isOnBreak,
    scheduledBreaks,
    showPostSession,
    showDistractionLogger,
    nextBreakIn,
    timeLeft,
  ]);

  const handlePauseClick = () => {
    setInterruptionType("pause");
    setInterruptionOpen(true);
  };

  const handleCancelClick = () => {
    setInterruptionType("cancel");
    setInterruptionOpen(true);
  };

  const handleManualBreakClick = () => {
    setManualConfirmOpen(true);
  };

  const confirmManualBreak = () => {
    if (!taskData || manualBreaksLeft <= 0) return;
    const { breakDuration } = getBreakInfo(taskData.duration);
    setIsOnBreak(true);
    setBreakTimeLeft(breakDuration * 60);
    setBreaksTaken((b) => b + 1);
    setManualBreaksLeft((b) => b - 1);
    setManualConfirmOpen(false);
  };

  const finishBreak = () => {
    setIsOnBreak(false);
    setBreakTimeLeft(0);
  };

  const handleInterruptionConfirm = () => {
    setInterruptionOpen(false);
    if (interruptionType === "pause") setIsPaused(true);
    else if (interruptionType === "cancel") {
      sessionStorage.removeItem("currentTask");
      router.push("/home");
    }
  };

  const handleInterruptionCancel = () => setInterruptionOpen(false);
  const handleExtendSession = (minutes: number) => {
    if (taskData) {
      setTimeLeft(minutes * 60);
      setIsPaused(false);
      setShowPostSession(false);
    }
  };
  const handleSessionComplete = () => setShowDistractionLogger(true);

  if (showPostSession) {
    return (
      <PostSession
        sessionId={taskData?.name || "session-1"}
        onExtend={handleExtendSession}
        onEnd={handleSessionComplete}
      />
    );
  }

  if (showDistractionLogger) {
    return (
      <DistractionModal
        sessionId={taskData?.name || "session-1"}
        onComplete={() => router.push("/home")}
      />
    );
  }

  if (!taskData) return null;

  const minutes = Math.floor((isOnBreak ? breakTimeLeft : timeLeft) / 60);
  const seconds = (isOnBreak ? breakTimeLeft : timeLeft) % 60;

  const { breakDuration } = getBreakInfo(taskData.duration);

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
              Do you want to take a break now? <br />
              Duration: {breakDuration} min
            </p>
            <div className="flex justify-center gap-4">
              <Button
                className="px-4 py-2 rounded-xl bg-primary text-white"
                onClick={confirmManualBreak}
              >
                Sure
              </Button>
              <Button
                className="px-4 py-2 rounded-xl bg-gray-300 text-black"
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
                Breaks left: {scheduledBreaks.length - breaksTaken}
              </p>
            </div>
          )}

        {isOnBreak && (
          <div className="mb-4 px-6 py-3 bg-secondary/20 border border-secondary rounded-2xl">
            <p className="text-secondary font-medium">
              Break Time - Take a rest!
            </p>
          </div>
        )}

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

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <Button
              onClick={() =>
                isPaused ? setIsPaused(false) : handlePauseClick()
              }
              disabled={isOnBreak}
              className={`px-6 py-3 bg-card border border-border rounded-2xl text-foreground font-medium hover:border-primary/50 transition-all duration-300 ${
                isOnBreak ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>

            <Button
              onClick={handleCancelClick}
              className="px-6 py-3 bg-card border border-destructive/50 rounded-2xl text-destructive font-medium hover:border-destructive hover:bg-destructive/10 transition-all duration-300"
            >
              Cancel
            </Button>

            {taskData.breakMode === "manual" && manualBreaksLeft >= 0 && (
              <Button
                onClick={isOnBreak ? finishBreak : handleManualBreakClick}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  isOnBreak
                    ? "bg-gray-300 text-gray-500"
                    : "bg-secondary/30 border border-secondary text-secondary hover:bg-secondary/50"
                }`}
              >
                {isOnBreak
                  ? "Finish Break"
                  : `Manual Break (${manualBreaksLeft} left, ${breakDuration} min)`}
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

