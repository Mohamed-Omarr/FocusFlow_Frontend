"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PasswordSettings({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  setShowPasswordPopup,
}) {
  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur-xl p-8 shadow-xl space-y-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Change Password</h2>

      <div className="space-y-6">
        <div>
          <Label>Current Password</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowPasswordPopup(true)}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
