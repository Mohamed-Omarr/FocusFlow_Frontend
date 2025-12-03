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
  const [sessionFinished, setSessionFinished] = useState(false);

  const [interruptionOpen, setInterruptionOpen] = useState(false);
  const [interruptionType, setInterruptionType] = useState<"pause" | "cancel">(
    "pause"
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const storedTask = sessionStorage.getItem("currentTask");
    if (storedTask) {
      const task = JSON.parse(storedTask);
      setTaskData(task);
      setTimeLeft(task.duration * 60);
    } else {
      router.push("/");
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
            setShowPostSession(true);
            return 0;
          }

          const totalSeconds = taskData.duration * 60;
          const elapsed = totalSeconds - prev + 1;

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

  const handlePauseClick = () => {
    setInterruptionType("pause");
    setInterruptionOpen(true);
  };

  const handleStopClick = () => {
    setInterruptionType("cancel");
    setInterruptionOpen(true);
  };

  const handleInterruptionConfirm = () => {
    setInterruptionOpen(false);
    if (interruptionType === "pause") setIsPaused(true);
    else setShowPostSession(true);
  };

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
        onComplete={() => router.push("/")}
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
            onClick={() => setIsPaused(!isPaused)}
            className="px-8 py-4 bg-card border border-border rounded-2xl text-foreground font-medium hover:border-primary/50 transition-all duration-300"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to cancel this session?")) {
                sessionStorage.removeItem("currentTask");
                router.push("/");
              }
            }}
            className="px-8 py-4 bg-card border border-destructive/50 rounded-2xl text-destructive font-medium hover:border-destructive hover:bg-destructive/10 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </main>
    </>
  );
}
