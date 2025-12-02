"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionCheckinForm } from "../component/SessionCheckinForm";
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

  const [showCheckin, setShowCheckin] = useState(false);
  const [showDistractionLogger, setShowDistractionLogger] = useState(false);

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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (taskData && timeLeft > 0 && !isPaused) {
        const pendingSession = {
          taskName: taskData.name,
          duration: taskData.duration,
          breakDuration: taskData.breakDuration,
          timeLeft,
          isOnBreak,
          breakTimeLeft,
          breaksTaken,
          timestamp: Date.now(),
        };
        localStorage.setItem(
          "focusflow-pending-session",
          JSON.stringify(pendingSession)
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [taskData, timeLeft, isPaused, isOnBreak, breakTimeLeft, breaksTaken]);

  const playAlertSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play error:", err));
    }
  };

  useEffect(() => {
    if (isPaused || !taskData) return;

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
            localStorage.removeItem("focusflow-pending-session");
            sessionStorage.setItem(
              "completedSession",
              JSON.stringify({
                taskName: taskData.name,
                duration: taskData.duration,
                breaksTaken,
              })
            );
            setShowCheckin(true);
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
  }, [isPaused, taskData, isOnBreak, breaksTaken]);

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
    if (interruptionType === "pause") {
      setIsPaused(true);
    } else {
      setShowCheckin(true);
    }
  };

  const handleInterruptionCancel = () => {
    setInterruptionOpen(false);
  };

  if (showCheckin) {
    return (
      <SessionCheckinForm
        sessionId={taskData?.name || "session-1"}
        onComplete={() => setShowDistractionLogger(true)}
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
      <audio ref={audioRef} src="/notification-bell.mp3" />
      <InterruptionDialog
        open={interruptionOpen}
        onOpenChange={setInterruptionOpen}
        type={interruptionType}
        sessionId={taskData.name}
        onConfirm={handleInterruptionConfirm}
        onCancel={handleInterruptionCancel}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-6 bg-background">
        <h2 className="text-2xl font-semibold mb-8">{taskData.name}</h2>

        {isOnBreak && (
          <div className="mb-4 px-6 py-3 bg-secondary/20 border border-secondary rounded-2xl">
            <p className="font-medium">Break Time - Take a rest!</p>
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
              isOnBreak ? "border-secondary/30 glow-secondary" : "border-primary/30 glow-primary"
            }`}
          >
            <div className="text-center">
              <div className="text-7xl font-mono font-bold">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xl text-muted-foreground mb-12 text-center max-w-md leading-relaxed">
          Stay present. You're doing great.
        </p>

        <div className="flex items-center gap-6">
          <Button
            size="lg"
            variant="outline"
            onClick={handlePauseClick}
            className="h-12 px-6 flex items-center gap-2 bg-transparent"
          >
            <Pause className="h-5 w-5" />
            Pause
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleStopClick}
            className="h-12 px-6 flex items-center gap-2 bg-transparent text-destructive hover:text-destructive"
          >
            <Square className="h-5 w-5" />
            Stop
          </Button>
        </div>
      </main>
    </>
  );
}
