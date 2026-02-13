"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InterruptionModal } from "./component/InterruptionModal";
import { useSessionTimer } from "./component/useSessionTimer";
import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import { createSupabaseClient } from "@/lib/supabase/client";
import { SessionCheckoutForm } from "./component/SessionCheckoutForm";
import { ActiveSessionResponse, InterruptionType } from "./types";
import { queryClient } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";

export default function ActiveSessionPage() {
  const router = useRouter();

  const { data, isLoading } = useAxiosGet<ActiveSessionResponse>(
    ["active_session"],
    "/sessions/active",
  );

  const {
    timeLeft,
    breakTimeLeft,
    nextBreakIn,
    showBreakHeadsUp,
    pause,
    resume,
    cancel,
    startManualBreak,
    finishBreak,
  } = useSessionTimer(data?.session ?? null, data?.remaining_seconds);

  const [interruptionOpen, setInterruptionOpen] = useState(false);
  const [interruptionType, setInterruptionType] =
    useState<InterruptionType>("pause");
  const [manualConfirmOpen, setManualConfirmOpen] = useState(false);

  /* ----------------------------- Handlers ----------------------------- */

  const handlePauseClick = () => {
    setInterruptionType("pause");
    setInterruptionOpen(true);
  };
  const handleCancelClick = () => {
    setInterruptionType("cancel");
    setInterruptionOpen(true);
  };
  const handleInterruptionConfirm = async (reason: string) => {
    setInterruptionOpen(false);
    if (interruptionType === "pause") await pause(reason);
    if (interruptionType === "cancel") await cancel(reason);
  };

  /* ----------------------------- Supabase Realtime ----------------------------- */
  const supabase = createSupabaseClient();
  useEffect(() => {
    const channel = supabase
      .channel("active_sessions")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "active_sessions" },
        async (payload) => {
          queryClient.invalidateQueries({
            queryKey: ["active_session"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return null;

  const isOnBreak = data.session.is_on_break;
  const activeSeconds = data.session.is_on_break ? breakTimeLeft : timeLeft;
  const displayMinutes = String(Math.floor(activeSeconds / 60)).padStart(
    2,
    "0",
  );
  const displaySeconds = String(activeSeconds % 60).padStart(2, "0");

  /* ----------------------------- Render ----------------------------- */
  if (data.session.session_status === "finished_pending_extension") {
    return <SessionCheckoutForm sessionId={data?.session.id} />;
  }

  return (
    <>
      <InterruptionModal
        open={interruptionOpen}
        onOpenChange={setInterruptionOpen}
        type={interruptionType}
        sessionId={data.session.task_name}
        onConfirm={handleInterruptionConfirm}
        onCancel={() => setInterruptionOpen(false)}
      />

      {manualConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-card p-6 rounded-2xl w-80 text-center">
            <p className="mb-4 text-lg font-medium">
              Do you want to take a break now?
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  startManualBreak();
                  setManualConfirmOpen(false);
                }}
              >
                Sure
              </Button>
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
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-primary/30 rounded-2xl mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium uppercase tracking-wider">
              {isOnBreak ? "Break Time" : "Active Session"}
            </span>
            <p className="font-bold">{data.session.task_name}</p>
          </div>
        </div>

        {/* Auto break heads-up */}
        {data.session.breaktime_type === "auto" &&
          !isOnBreak &&
          showBreakHeadsUp &&
          nextBreakIn !== null && (
            <div className="mb-4 px-6 py-3 bg-yellow-100 border border-yellow-300 rounded-2xl text-center">
              <p className="font-medium text-yellow-800">
                Break coming in {Math.floor(nextBreakIn / 60)}:
                {String(nextBreakIn % 60).padStart(2, "0")}
              </p>
            </div>
          )}

        {/* Timer */}
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
            <div className="text-center text-7xl font-mono font-bold">
              {displayMinutes}:{displaySeconds}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <Button
            onClick={() =>
              data.session.is_paused ? resume() : handlePauseClick()
            }
            disabled={isOnBreak}
          >
            {data.session.is_paused ? "Resume" : "Pause"}
          </Button>
          <Button variant="destructive" onClick={handleCancelClick}>
            Cancel
          </Button>
          {data.session.breaktime_type === "manual" && (
            <Button
              onClick={
                isOnBreak ? finishBreak : () => setManualConfirmOpen(true)
              }
            >
              {isOnBreak ? "Finish Break" : "Manual Break"}
            </Button>
          )}
        </div>
      </main>
    </>
  );
}
