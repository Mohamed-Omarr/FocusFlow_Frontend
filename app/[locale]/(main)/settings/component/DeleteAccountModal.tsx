"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteAccountModal({
  open,
  onCancel,
  onConfirm,
  loading,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-destructive rounded-2xl p-6 max-w-md w-full space-y-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <h3 className="text-xl font-bold text-destructive">
            Delete Account
          </h3>
        </div>

        <p className="text-muted-foreground">
          This action cannot be undone. All your data will be permanently deleted.
        </p>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 bg-muted rounded-xl"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2 bg-destructive text-destructive-foreground rounded-xl"
          >
            {loading ? "Deleting..." : "Yes, delete my account"}
          </Button>
        </div>
      </div>
    </div>
  );
}
