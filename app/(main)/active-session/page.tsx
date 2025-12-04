"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PostSession } from "../component/SessionCheckinForm";
import { DistractionLogger } from "../component/DistractionLogger";
import { InterruptionDialog } from "../component/InterruptionDialog";

export default function ActiveSessionPage() {
  const router = useRouter();
  const [taskData, setTaskData] = useState<{
    name: string;
    duration: number;
    breakDuration: number;
  } | null>(null);

  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);

  const [showPostSession, setShowPostSession] = useState(false);
  const [showDistractionLogger, setShowDistractionLogger] = useState(false);

  const [interruptionOpen, setInterruptionOpen] = useState(false);
  const [interruptionType, setInterruptionType] = useState<"pause" | "cancel">(
    "pause"
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load task from session storage
  useEffect(() => {
    const storedTask = sessionStorage.getItem("currentTask");
    if (storedTask) {
      const task = JSON.parse(storedTask);
      setTaskData(task);
      setTimeLeft(task.duration * 60);
    } else {
      router.push("/home");
    }
  }, [router]);

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play error:", err));
    }
  };

  // Timer logic
  useEffect(() => {
    if (isPaused || !taskData || showPostSession || showDistractionLogger)
      return;

    const interval = setInterval(() => {
      if (isOnBreak) {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            playAlertSound();
            setIsOnBreak(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            playAlertSound();
            setShowPostSession(true); // ✅ Only natural session end triggers PostSession
            return 0;
          }

          const totalSeconds = taskData.duration * 60;
          const elapsed = totalSeconds - prev + 1;

          // Trigger break every 30min if breakDuration > 0
          if (
            taskData.breakDuration > 0 &&
            elapsed % (30 * 60) === 0 &&
            elapsed < totalSeconds
          ) {
            playAlertSound();
            setIsOnBreak(true);
            setBreakTimeLeft(taskData.breakDuration * 60);
            setBreaksTaken((b) => b + 1);
          }

          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isPaused,
    taskData,
    isOnBreak,
    breaksTaken,
    showPostSession,
    showDistractionLogger,
  ]);

  // Pause button clicked
  const handlePauseClick = () => {
    setInterruptionType("pause");
    setInterruptionOpen(true);
  };

  // Cancel button clicked
  const handleCancelClick = () => {
    setInterruptionType("cancel");
    setInterruptionOpen(true);
  };

  // Confirm interruption dialog
  const handleInterruptionConfirm = () => {
    setInterruptionOpen(false);
    if (interruptionType === "pause") {
      setIsPaused(true);
    } else if (interruptionType === "cancel") {
      // Cancel session immediately, do NOT show PostSession
      sessionStorage.removeItem("currentTask");
      router.push("/home");
    }
  };

  // Cancel dialog (just close)
  const handleInterruptionCancel = () => setInterruptionOpen(false);

  const handleExtendSession = (minutes: number) => {
    if (taskData) {
      setTimeLeft(minutes * 60);
      setIsPaused(false);
      setShowPostSession(false);
    }
  };

  const handleSessionComplete = () => {
    setShowDistractionLogger(true);
  };

  // Step navigation: PostSession
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
      <DistractionLogger
        sessionId={taskData?.name || "session-1"}
        onComplete={() => router.push("/home")}
      />
    );
  }

  if (!taskData) return null;

  const minutes = Math.floor((isOnBreak ? breakTimeLeft : timeLeft) / 60);
  const seconds = (isOnBreak ? breakTimeLeft : timeLeft) % 60;

  return (
    <>
      <InterruptionDialog
        open={interruptionOpen}
        onOpenChange={setInterruptionOpen}
        type={interruptionType}
        sessionId={taskData.name}
        onConfirm={handleInterruptionConfirm}
        onCancel={handleInterruptionCancel}
      />

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
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              if (isPaused) {
                // Resume directly, no popup
                setIsPaused(false);
              } else {
                // Immediately pause timer
                setIsPaused(true);

                // Then show interruption dialog
                setInterruptionType("pause");
                setInterruptionOpen(true);
              }
            }}
            className="px-8 py-4 bg-card border border-border rounded-2xl text-foreground font-medium hover:border-primary/50 transition-all duration-300"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={handleCancelClick}
            className="px-8 py-4 bg-card border border-destructive/50 rounded-2xl text-destructive font-medium hover:border-destructive hover:bg-destructive/10 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </main>
    </>
  );
}
