"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CustomTimeInput } from "./CustomTimeInput";
import { BreakTimeSelector } from "./BreakTimeSelector";
import { TaskType } from "../../task-planner/types";
import { useAxiosGet, useAxiosMutation } from "@/lib/axios/useAxiosQuery";

type TaskList = Pick<TaskType, "id" | "name" | "category">;

export function TaskListSection() {
  const router = useRouter();
  const { data: tasks = [] } = useAxiosGet<TaskList[]>(
    ["tasks"],
    "/api/v1/tasks/daily"
  );

  const [timerDuration, setTimerDuration] = useState<"1" | "60" | "custom">(
    "1"
  );

  const [customMinutes, setCustomMinutes] = useState("");
  const [customValid, setCustomValid] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [breakMode, setBreakMode] = useState<"auto" | "manual">("auto");
  const [isOpen, setIsOpen] = useState(false);

  const sessionLength =
    timerDuration === "custom" ? Number(customMinutes) : Number(timerDuration);
  const { mutate } = useAxiosMutation("/api/v1/sessions/active", "POST");

  const handleStartSession = () => {
    if (!selectedTask) {
      alert("Please select a task to start a focus session");
      return;
    }

    if (timerDuration === "custom" && (!customValid || customMinutes === "")) {
      alert("Please enter a valid custom duration (25–360).");
      return;
    }

    const duration =
      timerDuration === "custom"
        ? Number(customMinutes)
        : Number(timerDuration);

    mutate({
      id: tasks.find((t) => t.id === selectedTask)?.id,
      duration: duration,
      breaktime_type: breakMode,
    });
    // router.push("/active-session");
  };

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="w-full bg-card text-card-foreground rounded-3xl p-4 border border-border shadow-lg cursor-pointer"
    >
      {/* Header */}
      <div
        className="flex justify-between items-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <h2 className="text-2xl font-semibold text-foreground">
          Start a Focus Session
        </h2>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl text-foreground"
        >
          ▼
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden mt-5"
          >
            {/* SELECT TASK */}
            <div className="mb-5">
              <Label className="mb-2 block text-foreground">Select Task</Label>
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks available today.
                </p>
              ) : (
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-2xl"
                >
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
                <Label className="mb-2 block text-foreground">
                  Timer Duration
                </Label>
                <div className="flex gap-3 mb-3">
                  {["1", "60", "custom"].map((dur) => (
                    <Button
                      key={dur}
                      variant={timerDuration === dur ? "default" : "outline"}
                      onClick={() =>
                        setTimerDuration(dur as "1" | "60" | "custom")
                      }
                      className="flex-1 rounded-2xl py-3"
                    >
                      {dur === "1" ? "1 min" : dur === "60" ? "1 hr" : "Custom"}
                    </Button>
                  ))}
                </div>

                {timerDuration === "custom" && (
                  <CustomTimeInput
                    value={customMinutes}
                    onChange={setCustomMinutes}
                    onValidChange={setCustomValid}
                  />
                )}
              </motion.div>
            )}

            {/* BREAK TIME SELECTOR */}
            {selectedTask && timerDuration !== "1" && sessionLength >= 25 && (
              <BreakTimeSelector
                duration={sessionLength}
                breakMode={breakMode}
                setBreakMode={setBreakMode}
              />
            )}

            {/* START */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <Button
                className="w-full py-4 rounded-2xl"
                disabled={
                  !selectedTask || (timerDuration === "custom" && !customValid)
                }
                onClick={handleStartSession}
              >
                Start
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
