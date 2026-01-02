"use client";
import { useEffect, useRef, useState } from "react";

export function useCountdown(seconds: number, isRunning: boolean) {
  const [display, setDisplay] = useState(seconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync ONLY when backend seconds change
  useEffect(() => {
    setDisplay(seconds);
  }, [seconds]);

  // Visual ticking only
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setDisplay((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  return display;
}
