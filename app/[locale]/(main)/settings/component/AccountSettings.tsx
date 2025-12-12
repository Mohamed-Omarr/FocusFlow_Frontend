"use client";

import { AlertCircle, Trash2 } from "lucide-react";

export default function AccountSettings({ setShowDeletePopup }) {
  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur-xl p-8 shadow-xl space-y-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Account Management</h2>

      <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-6">
        <AlertCircle className="w-5 h-5 text-destructive mb-2" />

        <h3 className="font-semibold text-destructive text-lg mb-2">Danger Zone</h3>

        <p className="text-sm text-muted-foreground mb-4">
          Permanently delete your account and all data. This cannot be undone.
        </p>

        <button
          onClick={() => setShowDeletePopup(true)}
          className="px-5 py-2 bg-destructive text-destructive-foreground rounded-lg inline-flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}
