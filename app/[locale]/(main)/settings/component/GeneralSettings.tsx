"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GeneralSettings({ language, setLanguage, theme, setTheme }) {
  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur-xl p-8 shadow-xl space-y-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">General Settings</h2>

      <div className="flex items-start gap-10">
        {/* Language */}
        <div>
          <Label>Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="turkish">Turkish</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Theme */}
        <div>
          <Label>Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-40 h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
