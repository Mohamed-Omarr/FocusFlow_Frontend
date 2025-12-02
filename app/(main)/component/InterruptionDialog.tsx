"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { storage } from "@/lib/storage";
import { Coffee, Phone, Users, Brain, Clock, HelpCircle } from "lucide-react";

type InterruptionType = "pause" | "cancel";

interface InterruptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: InterruptionType;
  sessionId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const PAUSE_REASONS = [
  { value: "break", label: "Taking a short break", icon: Coffee },
  { value: "phone", label: "Phone call", icon: Phone },
  { value: "meeting", label: "Meeting / Interruption", icon: Users },
  { value: "mental_fatigue", label: "Mental fatigue", icon: Brain },
  { value: "other", label: "Other reason", icon: HelpCircle },
];

const CANCEL_REASONS = [
  { value: "wrong_task", label: "Wrong task selected", icon: HelpCircle },
  { value: "urgent_matter", label: "Urgent matter came up", icon: Clock },
  { value: "too_long", label: "Session too long", icon: Clock },
  { value: "lost_focus", label: "Lost focus completely", icon: Brain },
  { value: "not_ready", label: "Not ready to focus", icon: Coffee },
  { value: "other", label: "Other reason", icon: HelpCircle },
];

export function InterruptionDialog({
  open,
  onOpenChange,
  type,
  sessionId,
  onConfirm,
  onCancel,
}: InterruptionDialogProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const reasons = type === "pause" ? PAUSE_REASONS : CANCEL_REASONS;
  const title = type === "pause" ? "Why are you pausing?" : "Why are you stopping?";
  const description =
    type === "pause"
      ? "Help us understand your break patterns to improve your focus sessions."
      : "Understanding why you stopped helps us provide better insights.";

  const handleConfirm = () => {
    if (!selectedReason) return;

    storage.addInterruption({
      id: crypto.randomUUID(),
      sessionId,
      type,
      reason: selectedReason,
      customReason: selectedReason === "other" ? customReason : undefined,
      createdAt: new Date().toISOString(),
    });

    setSelectedReason("");
    setCustomReason("");
    onConfirm();
  };

  const handleCancel = () => {
    setSelectedReason("");
    setCustomReason("");
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <RadioGroup
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="space-y-3"
          >
            {reasons.map(({ value, label, icon: Icon }) => (
              <div key={value} className="flex items-center space-x-3">
                <RadioGroupItem value={value} id={value} />
                <Label
                  htmlFor={value}
                  className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === "other" && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason">Please specify:</Label>
              <Input
                id="custom-reason"
                placeholder="Enter your reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Go Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedReason || (selectedReason === "other" && !customReason)}
            className="bg-primary text-primary-foreground"
          >
            {type === "pause" ? "Pause Session" : "Stop Session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
