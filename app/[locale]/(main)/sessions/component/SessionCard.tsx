"use client";
import {
  Calendar,
  Clock,
  Coffee,
  PauseCircle,
  Timer,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function SessionCard({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false);

  function formatTimeUTC(value?: string | Date) {
    if (!value) return "--:--";

    const date = typeof value === "string" ? new Date(value) : value;

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }

  function formatDateUTC(value?: string | Date) {
    if (!value) return "--";

    const date = typeof value === "string" ? new Date(value) : value;

    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    });
  }

  return (
    <>
      {/* CARD */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setIsOpen(true);
          }
        }}
        className="p-5 rounded-2xl border shadow-sm transition hover:shadow-md hover:border-primary  focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <div className="mb-3">
          <h3 className="font-medium text-base">{session.task_name}</h3>
        </div>

        {(session.is_canceled ||
          (session.pauses && session.pauses.length > 0)) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {session.cancel_reason && (
              <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-500/10 text-red-500">
                <XCircle className="w-3 h-3" />
                <span>Canceled</span>
              </div>
            )}
            {session.pauses && (
              <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-500">
                <PauseCircle className="w-3 h-3" />
                <span>Pauses</span>
              </div>
            )}
          </div>
        )}

        <div className="">
          <div className="small-muted-text">
            <div className="flex flex-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{session.planned_duration_minutes} minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex-center-all z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="rounded-lg shadow-lg max-w-md w-full p-6 relative bg-popover text-popover-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 font-bold text-xl hover:text-gray-300"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-4">{session.task_name}</h2>

            <div className="grid grid-cols-2 gap-4 mb-4 small-muted-text">
              <div>
                <div className="flex flex-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </div>
                <p className="font-medium">
                  {" "}
                  {formatDateUTC(session.created_at)}
                </p>
              </div>
              <div>
                <div className="flex flex-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Duration</span>
                </div>
                <p className="font-medium">
                  {session.planned_duration_minutes} minutes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 small-muted-text">
              <div>
                <div className="flex flex-center gap-1">
                  <Timer className="w-4 h-4" />
                  <span>Time Range</span>
                </div>
                <p className="font-medium">
                  {formatTimeUTC(session.start_time)} –{" "}
                  {formatTimeUTC(session.end_time)}{" "}
                </p>
              </div>
              <div>
                <div className="flex flex-center gap-1">
                  <Coffee className="w-4 h-4" />
                  <span>Breaks</span>
                </div>
                <p className="font-medium">
                  {session.total_break_minutes} minutes
                </p>
              </div>
            </div>

            {session.is_canceled && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex flex-center gap-2 text-sm font-medium text-red-500 mb-1">
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Reason</span>
                </div>
                <p className="text-sm">{session.cancel_reason}</p>
              </div>
            )}

            {session.pauses && session.pauses.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 text-sm font-medium text-orange-500 mb-1">
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause Reason</span>
                </div>
                <div className="text-sm">
                  {session.pauses.map((pause, index) => (
                    <p key={index}>{pause.reason}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
