"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PasswordModal({ open, setOpen, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50">
      <div className="bg-card border rounded-2xl p-6 max-w-md w-full space-y-4">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Confirm Password Change</h3>
        </div>

        <p className="text-muted-foreground">
          Are you sure you want to update your password?
        </p>

        <div className="flex justify-end gap-3">
          <Button className="px-5 py-2 bg-muted rounded-xl" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            className="px-5 py-2 bg-primary text-primary-foreground rounded-xl"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
