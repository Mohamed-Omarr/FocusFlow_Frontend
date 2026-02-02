"use client";

import LangSwitcher from "@/app/component/LangSwitcher";
import { ModeToggle } from "@/components/theme-mode/ModeToggle";
import { Label } from "@/components/ui/label";

export default function GeneralSettings() {
  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur-xl p-8 shadow-xl space-y-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">General Settings</h2>

      <div className="flex items-start gap-10">
        {/* Language */}
        <div>
          <Label>Language</Label>
          <LangSwitcher />
        </div>

        {/* Theme */}
        <div>
          <Label>Theme</Label>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
