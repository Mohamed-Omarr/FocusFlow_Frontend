import { useState, useEffect } from "react";
import { TaskData } from "../types";
import { getBreakInfo } from "../helper";

/* ----------------------------- hook ----------------------------- */

export function useSessionTimer(taskData: TaskData | null) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [scheduledBreaks, setScheduledBreaks] = useState<number[]>([]);
  const [manualBreaksLeft, setManualBreaksLeft] = useState(0);
  const [nextBreakIn, setNextBreakIn] = useState<number | null>(null);
  const [showBreakHeadsUp, setShowBreakHeadsUp] = useState(false);

  const [isFinished, setIsFinished] = useState(false);

  /* ----------------------------- init ----------------------------- */

  useEffect(() => {
    if (!taskData) return;

    setTimeLeft(taskData.duration * 60);
    setIsPaused(false);
    setIsOnBreak(false);
    setBreaksTaken(0);
    setIsFinished(false);

    const { numBreaks } = getBreakInfo(taskData.duration);

    const breaks =
      numBreaks > 0
        ? Array.from({ length: numBreaks }, (_, i) =>
            Math.round(((i + 1) / (numBreaks + 1)) * taskData.duration * 60)
          )
        : [];

    setScheduledBreaks(breaks);

    if (taskData.breakMode === "manual") {
      setManualBreaksLeft(numBreaks);
    }
  }, [taskData]);

  /* ----------------------------- timer ----------------------------- */

  useEffect(() => {
    if (!taskData || isPaused || isFinished) return;

    const updateNextBreak = () => {
      const elapsed = taskData.duration * 60 - timeLeft;
      const remaining = scheduledBreaks.filter((b) => b > elapsed);

      if (remaining.length > 0) {
        setNextBreakIn(remaining[0] - elapsed);
      } else {
        setNextBreakIn(null);
        setShowBreakHeadsUp(false);
      }
    };

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
        return;
      }

      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }

        const elapsed = taskData.duration * 60 - prev + 1;

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
        } else if (nextBreakIn !== null) {
          const next = nextBreakIn - 1;
          setNextBreakIn(next);

          if (next <= 60 && next > 0) setShowBreakHeadsUp(true);
          else setShowBreakHeadsUp(false);
        }

        return prev - 1;
      });
    }, 1000);

    updateNextBreak();
    return () => clearInterval(interval);
  }, [
    taskData,
    isPaused,
    isOnBreak,
    scheduledBreaks,
    nextBreakIn,
    timeLeft,
    isFinished,
  ]);

  /* ----------------------------- actions ----------------------------- */

  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  const startManualBreak = () => {
    if (!taskData || manualBreaksLeft <= 0) return;

    const { breakDuration } = getBreakInfo(taskData.duration);

    setIsOnBreak(true);
    setBreakTimeLeft(breakDuration * 60);
    setBreaksTaken((b) => b + 1);
    setManualBreaksLeft((b) => b - 1);
  };

  const finishBreak = () => {
    setIsOnBreak(false);
    setBreakTimeLeft(0);
  };

  const extendSession = (minutes: number) => {
    setTimeLeft(minutes * 60);
    setIsPaused(false);
    setIsFinished(false);
  };

  return {
    // time
    timeLeft,
    breakTimeLeft,
    isPaused,
    isFinished,

    // break
    isOnBreak,
    breaksTaken,
    manualBreaksLeft,
    nextBreakIn,
    showBreakHeadsUp,

    // actions
    pause,
    resume,
    startManualBreak,
    finishBreak,
    extendSession,
  };
}
