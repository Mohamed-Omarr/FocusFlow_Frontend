"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CustomTimeInput } from "./CustomTimeInput";
import { BreakTimeSelector } from "./BreakTimeSelector";
import { TaskType } from "../../task-planner/types";
import { useAxiosGet, useAxiosMutation } from "@/lib/axios/useAxiosQuery";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";
import { CreateTaskModal } from "../../task-planner/component/CreateTaskModal";
import { Plus } from "lucide-react";
import { TipsPopup } from "./TipsPopup";

type TaskList = Pick<TaskType, "id" | "name" | "category">;

export function TaskListSection() {
  const { data: tasks = [] } = useAxiosGet<TaskList[]>(
    ["tasks"],
    "/tasks/daily",
  );
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [timerDuration, setTimerDuration] = useState<"25" | "60" | "custom">(
    "25",
  );
  const [customMinutes, setCustomMinutes] = useState("");
  const [customValid, setCustomValid] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [breakMode, setBreakMode] = useState<"auto" | "manual">("auto");
  const [isOpen, setIsOpen] = useState(false);

  const [showTips, setShowTips] = useState(false);


  const router = useRouter();

  const sessionLength =
    timerDuration === "custom" ? Number(customMinutes) : Number(timerDuration);

  const { mutate } = useAxiosMutation("/sessions/active", "POST", {
    onSuccess: () => {
      router.push("/active-session");
    },
  });

  // const handleStartSession = () => {
  //   if (!selectedTask) return;

  //   const duration =
  //     timerDuration === "custom"
  //       ? Number(customMinutes)
  //       : Number(timerDuration);

  //   mutate({
  //     id: selectedTask,
  //     duration,
  //     breaktime_type: breakMode,
  //   });
  // };

    const handleStartSession = () => {
    if (!selectedTask) return;
    setShowTips(true);
  };

    const handleConfirmStart = () => {
    const duration =
      timerDuration === "custom"
        ? Number(customMinutes)
        : Number(timerDuration);

    mutate({
      id: selectedTask,
      duration,
      breaktime_type: breakMode,
    });
  };

  return (
    <motion.div
      layout
      transition={{
        layout: {
          type: "spring",
          stiffness: 110,
          damping: 24,
          mass: 1.05,
        },
      }}
      className="w-full bg-card text-card-foreground rounded-3xl p-4 border border-border shadow-lg"
    >
      {/* Header */}
      <motion.div
        layout="position"
        className="flex justify-between items-center cursor-pointer select-none"
        onClick={() => setIsOpen((p) => !p)}
      >
        <h2 className="text-2xl font-semibold text-foreground ">
          Start a Focus Session
        </h2>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 20,
          }}
          className="text-xl text-foreground cursor-pointer"
        >
          ▼
        </motion.span>
      </motion.div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            layout
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: 0.2,
                delay: 0.02,
              },
            }}
            className="mt-5"
          >
            {/* SELECT TASK */}
            <motion.div layout className="mb-5">
              <Label className="mb-2 block text-foreground">Select Task</Label>

              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks available today.
                </p>
              ) : (
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                  <SelectTrigger className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-2xl focus:outline-none cursor-pointer focus:ring-2 focus:ring-ring">
                    <SelectValue placeholder="Choose a task..." />
                  </SelectTrigger>

                  <SelectContent className="rounded-2xl">
                    {tasks.map((task) => (
                      <SelectItem
                        key={task.id}
                        value={task.id}
                        className="cursor-pointer"
                      >
                        {task.name}
                        {task.category ? ` (${task.category})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </motion.div>

            {/* Create Task Button */}
            <motion.div layout className="mb-5">
              <Button
                onClick={() => setShowCreateForm(true)}
                className="flex flex-center gap-2 px-4 py-2 bg-primary btn-text rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 text-sm shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            </motion.div>

            {/* TIMER */}
            <AnimatePresence mode="wait">
              {selectedTask && (
                <motion.div
                  layout
                  key="timer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { duration: 0.25 } }}
                >
                  <Label className="mb-2 block text-foreground">
                    Timer Duration
                  </Label>

                  <div className="flex gap-3 mb-3">
                    {["25", "60", "custom"].map((dur) => (
                      <Button
                        key={dur}
                        variant={timerDuration === dur ? "default" : "outline"}
                        onClick={() =>
                          setTimerDuration(dur as "25" | "60" | "custom")
                        }
                        className="flex-1 rounded-2xl py-3 cursor-pointer"
                      >
                        {dur === "25"
                          ? "25 min"
                          : dur === "60"
                            ? "1 hr"
                            : "Custom"}
                      </Button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {timerDuration === "custom" && (
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CustomTimeInput
                          value={customMinutes}
                          onChange={setCustomMinutes}
                          onValidChange={setCustomValid}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BREAK MODE */}
            <AnimatePresence>
              {selectedTask && sessionLength >= 25 && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span>Break Mode</span>
                  <BreakTimeSelector
                    duration={sessionLength}
                    breakMode={breakMode}
                    setBreakMode={setBreakMode}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* START */}
            <motion.div layout className="mt-6">
              <Button
                className="w-full py-4 rounded-2xl cursor-pointer"
                disabled={
                  !selectedTask || (timerDuration === "custom" && !customValid)
                }
                onClick={handleStartSession}
              >
                continue
              </Button>
            </motion.div>

            {/* Create Task Modal */}
            {showCreateForm && (
              <CreateTaskModal
                show={showCreateForm}
                setShowCreateForm={setShowCreateForm}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

        {/* Tips Popup */}
      <TipsPopup
        open={showTips}
        onOpenChange={setShowTips}
        onConfirmStart={handleConfirmStart}
      />
    </motion.div>
  );
}
