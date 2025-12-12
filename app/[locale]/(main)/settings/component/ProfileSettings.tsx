"use client";

import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileSettings({
  avatarUrl,
  setAvatarUrl,
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
}) {
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatarUrl(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur-xl p-8 shadow-xl space-y-8">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-6 border-b pb-8">
        <div className="relative group">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border"
          />

          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer"
          >
            <Upload className="w-6 h-6 text-white" />
          </label>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-6 max-w-xl mx-auto">
        <div className="space-y-2">
          <Label>Username</Label>
          <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Email Address</Label>
          <Input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
        </div>

        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl mt-4">
          Save Changes
        </button>
      </div>
    </div>
  );
}
