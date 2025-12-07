"use client";
import {
  Calendar,
  Clock,
  Coffee,
  PauseCircle,
  Target,
  Timer,
  XCircle,
} from "lucide-react";
import { useState } from "react";

export default function SessionCard({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="p-5 rounded-2xl border shadow-sm transition hover:shadow-md hover:border-primary cursor-pointer">
        <div className="flex items-start justify-between mb-3 ">
          <h3 className="font-medium text-base">{session.name}</h3>
          <span className="text-sm px-2 py-1 rounded font-medium bg-primary btn-text">
            {session.score}
          </span>
        </div>

        {(session.cancelReason || session.pauseReason) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {session.cancelReason && (
              <div className="flex flex-center gap-1 text-xs px-2 py-1 rounded bg-red-500/10 text-red-500">
                <XCircle className="w-3 h-3" />
                <span>Canceled</span>
              </div>
            )}
            {session.pauseReason && (
              <div className="flex flex-center gap-1 text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-500">
                <PauseCircle className="w-3 h-3" />
                <span>Paused</span>
              </div>
            )}
          </div>
        )}

        <div className=" flex-center-between">
          <div className="flex flex-center gap-4 small-muted-text">
            <div className="flex flex-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{session.duration}</span>
            </div>
            <div className="flex flex-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>Score</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-sm font-medium hover:underline text-primary"
          >
            Read more
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50  flex-center-all z-50 p-4">
          <div className="rounded-lg shadow-lg max-w-md w-full p-6 relative bg-popover text-popover-foreground">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 font-bold text-xl hover:text-gray-300"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-4">{session.name}</h2>

            <div className="grid grid-cols-2 gap-4 mb-4 small-muted-text">
              <div>
                <div className="flex flex-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </div>
                <p className="font-medium">{session.date}</p>
              </div>
              <div>
                <div className="flex flex-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Duration</span>
                </div>
                <p className="font-medium">{session.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 small-muted-text">
              <div>
                <div className="flex flex-center gap-1">
                  <Timer className="w-4 h-4" />
                  <span>Time Range</span>
                </div>
                <p className="font-medium">
                  {session.startTime} - {session.endTime}
                </p>
              </div>
              <div>
                <div className="flex flex-center gap-1">
                  <Coffee className="w-4 h-4" />
                  <span>Breaks</span>
                </div>
                <p className="font-medium">
                  {session.breaks} {session.breaks === 1 ? "break" : "breaks"}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-center gap-2 small-muted-text">
                <Target className="w-4 h-4" />
                <span>Score</span>
              </div>
              <div className="flex flex-center gap-2 mt-1">
                <span className="text-lg px-3 py-1 rounded font-medium bg-primary btn-text">
                  {session.score}
                </span>
                <span className="text-muted-foreground text-sm">/ 100</span>
              </div>
            </div>

            {session.cancelReason && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex flex-center gap-2 text-sm font-medium text-red-500 mb-1">
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Reason</span>
                </div>
                <p className="text-sm">{session.cancelReason}</p>
              </div>
            )}

            {session.pauseReason && (
              <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex flex-center gap-2 text-sm font-medium text-orange-500 mb-1">
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause Reason</span>
                </div>
                <p className="text-sm">{session.pauseReason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
