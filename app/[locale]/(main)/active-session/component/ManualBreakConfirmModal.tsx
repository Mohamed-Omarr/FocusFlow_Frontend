"use client";

import { Button } from "@/components/ui/button";

interface ManualBreakConfirmDialogProps {
  open: boolean;
  breakDuration: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ManualBreakConfirmModal({
  open,
  breakDuration,
  onConfirm,
  onCancel,
}: ManualBreakConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-card p-6 rounded-2xl w-80 text-center">
        <p className="mb-4 text-lg font-medium">
          Do you want to take a break now? <br />
          Duration: {breakDuration} min
        </p>
        <div className="flex justify-center gap-4">
          <Button
            className="px-4 py-2 rounded-xl bg-primary text-white"
            onClick={onConfirm}
          >
            Sure
          </Button>
          <Button
            className="px-4 py-2 rounded-xl bg-gray-300 text-black"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
