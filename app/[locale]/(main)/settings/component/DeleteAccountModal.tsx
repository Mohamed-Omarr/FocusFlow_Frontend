"use client";

import { AlertCircle } from "lucide-react";

export default function DeleteAccountModal({ open, setOpen, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-4 z-50">
      <div className="bg-card border border-destructive p-6 rounded-2xl max-w-md w-full space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <h3 className="text-xl font-bold text-destructive">Delete Account</h3>
        </div>

        <p className="text-muted-foreground">
          This action cannot be undone. All your data will be permanently deleted.
        </p>

        <div className="flex justify-end gap-3">
          <button className="px-5 py-2 bg-muted rounded-xl" onClick={() => setOpen(false)}>
            Cancel
          </button>

          <button
            className="px-5 py-2 bg-destructive text-destructive-foreground rounded-xl"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Yes, delete my account
          </button>
        </div>
      </div>
    </div>
  );
}
