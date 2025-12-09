"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CustomTimeInput } from "./CustomTimeInput";
import { BreakTimeSelector } from "./BreakTimeSelector";

interface TaskList {
  id: string;
  name: string;
  category: string;
}

export function TaskListSection() {
  const router = useRouter();

  const [tasks] = useState<TaskList[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("focusflow-tasks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [timerDuration, setTimerDuration] = useState<"1" | "60" | "custom">("1");
  const [customMinutes, setCustomMinutes] = useState("");
  const [customValid, setCustomValid] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [breakMode, setBreakMode] = useState<"auto" | "manual">("auto");
  const [isOpen, setIsOpen] = useState(false);

  const sessionLength = timerDuration === "custom" ? Number(customMinutes) : Number(timerDuration);

  const handleStartSession = () => {
    if (!selectedTask) {
      alert("Please select a task to start a focus session");
      return;
    }

    if (timerDuration === "custom" && (!customValid || customMinutes === "")) {
      alert("Please enter a valid custom duration (25–360).");
      return;
    }

    const duration = timerDuration === "custom" ? Number(customMinutes) : Number(timerDuration);

    // send to backend
    sessionStorage.setItem(
      "currentTask",
      JSON.stringify({
        name: tasks.find(t => t.id === selectedTask)?.name,
        duration,
        breakMode,
      })
    );

    router.push("/active-session");
  };

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="w-full bg-white dark:bg-card rounded-3xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-center" onClick={() => setIsOpen(prev => !prev)}>
        <h2 className="text-2xl font-semibold">Start a Focus Session</h2>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-xl">
          ▼
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="content" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: "easeInOut" }} className="overflow-hidden">
            <div className="mt-5">
              {/* SELECT TASK */}
              <div className="mb-5">
                <Label className="mb-2 block">Select Task</Label>
                {tasks.length === 0 ? (
                  <p className="text-sm text-gray-400">No tasks available today.</p>
                ) : (
                  <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
                    <option value="">Choose a task...</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.name} {task.category ? `(${task.category})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* TIMER BUTTONS */}
              {selectedTask && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Label className="mb-2 block">Timer Duration</Label>
                  <div className="flex gap-3 mb-3">
                    {["1", "60", "custom"].map((dur) => (
                      <Button key={dur} variant={timerDuration === dur ? "default" : "outline"} onClick={() => setTimerDuration(dur as "1" | "60" | "custom")} className="flex-1 rounded-2xl py-3">
                        {dur === "1" ? "1 min" : dur === "60" ? "1 hr" : "Custom"}
                      </Button>
                    ))}
                  </div>

                  {timerDuration === "custom" && (
                    <CustomTimeInput value={customMinutes} onChange={setCustomMinutes} onValidChange={setCustomValid} />
                  )}
                </motion.div>
              )}

              {/* BREAK TIME SELECTOR */}
              {selectedTask && timerDuration !== "1" && sessionLength >= 25 && (
                <BreakTimeSelector duration={sessionLength} breakMode={breakMode} setBreakMode={setBreakMode} />
              )}

              {/* START */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                <Button className="w-full py-4 rounded-2xl" disabled={!selectedTask || (timerDuration === "custom" && !customValid)} onClick={handleStartSession}>
                  Start
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
