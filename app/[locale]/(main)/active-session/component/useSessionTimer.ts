"use client";

import { ActiveSessionData } from "../types";
import {
  cancel_session,
  end_manual_break,
  pause_session,
  resume_session,
  start_manual_break,
} from "../helper";
import { useCountdown } from "./UseCountdown";

export function useSessionTimer(
  task: ActiveSessionData | null,
  timer_remaining_seconds: number, // result of get_active_timer RPC
  active_break_remaining_seconds:number,
) {
  
  /* ----------------------------- focus countdown ----------------------------- */

  const isFocusRunning =
    !!task && !task.is_paused && !task.is_on_break;

  const timeLeft = useCountdown(
    timer_remaining_seconds,
    isFocusRunning && timer_remaining_seconds > 0
  );
  /* ----------------------------- break countdown ----------------------------- */

  const breakSeconds = active_break_remaining_seconds ?? 0

  const breakTimeLeft = useCountdown(
    breakSeconds,
    !!task?.is_on_break
  );

  /* ----------------------------- auto break heads-up ----------------------------- */

  let nextBreakIn: number | null = null;
  let showBreakHeadsUp = false;

  if (
    task &&
    task.breaktime_type === "auto" &&
    task.allowed_break_count > 0 &&
    !task.is_on_break
  ) {
    const totalSeconds =
      (task.planned_duration_minutes + task.extended_time_minutes) * 60;

    const elapsed = totalSeconds - timeLeft;

    const breakPoints = Array.from(
      { length: task.allowed_break_count },
      (_, i) =>
        Math.round(
          ((i + 1) / (task.allowed_break_count + 1)) * totalSeconds
        )
    );

    const upcoming = breakPoints.find((b) => b > elapsed);

    if (upcoming) {
      nextBreakIn = upcoming - elapsed;
      showBreakHeadsUp = nextBreakIn <= 60;
    }
  }

  /* ----------------------------- actions ----------------------------- */

  const startManualBreak = async () => {
    if (
      !task ||
      task.is_on_break ||
      task.is_paused ||
      task.breaks_taken >= task.allowed_break_count
    )
      return;

    await start_manual_break();
  };

  const finishBreak = async () => {
    if (!task?.is_on_break) return;
    await end_manual_break();
  };

  const pause = async (reason: string) => {
    if (!task || task.is_paused || task.is_on_break) return;
    await pause_session(reason);
  };

  const resume = async () => {
    if (!task || !task.is_paused) return;
    await resume_session();
  };

  const cancel = async (reason: string) => {
    await cancel_session(reason); 
  };

  return {
    timeLeft,
    breakTimeLeft,
    nextBreakIn,
    showBreakHeadsUp,
    startManualBreak,
    finishBreak,
    pause,
    resume,
    cancel,
  };
}
