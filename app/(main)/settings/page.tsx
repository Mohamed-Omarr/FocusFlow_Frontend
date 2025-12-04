"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export default function SettingsPage() {
  const [profileName, setProfileName] = useState("User");
  const [profileEmail, setProfileEmail] = useState("user@example.com");
  const [language, setLanguage] = useState("english");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [defaultSession, setDefaultSession] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [autoBreak, setAutoBreak] = useState(true);
  const [adaptiveTimer, setAdaptiveTimer] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [volume, setVolume] = useState([70]);
  const [trackDistractions, setTrackDistractions] = useState(true);
  const [trackMood, setTrackMood] = useState(true);
  const [weeklyInsights, setWeeklyInsights] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [uiDensity, setUiDensity] = useState("comfortable");

  return (
    <main className="flex flex-col gap-8 p-6">
      <div
        className="
    mb-8
    border border-border/50
    backdrop-blur-xl
    bg-background/60
    rounded-full
    px-6
    py-3
  "
      >
        <h1 className="text-2xl font-bold text-foreground">
          Settings
          <br />
          <span className="text-sm font-normal text-muted-foreground">
            Control your settings Track your productivity across categories
          </span>
        </h1>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6">
        {/* Tabs List */}
        <TabsList className="flex md:flex-col h-full overflow-x-auto md:w-60 gap-2 p-2 rounded-xl bg-muted/50 border no-scrollbar">
          {[
            "profile",
            "general",
            "timer",
            "notifications",
            "tracking",
            "appearance",
          ].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="w-full justify-start">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tabs Content */}
        <div className="flex-1">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-10">
            {/* PROFILE */}
            <TabsContent value="profile" className="space-y-6 max-w-md">
              <h2 className="text-xl font-semibold">Profile</h2>
              <div className="grid gap-4">
                <div>
                  <Label>Profile Name</Label>
                  <Input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            {/* GENERAL */}
            <TabsContent value="general" className="space-y-6 max-w-md">
              <h2 className="text-xl font-semibold">General</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="turkish">Turkish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Time Format</Label>
                  <Select value={timeFormat} onValueChange={setTimeFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24-Hour</SelectItem>
                      <SelectItem value="12h">12-Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* TIMER */}
            <TabsContent value="timer" className="space-y-6 max-w-md">
              <h2 className="text-xl font-semibold">Focus Timer</h2>
              <div className="grid gap-4">
                <div>
                  <Label>Default Session (minutes)</Label>
                  <Input
                    type="number"
                    value={defaultSession}
                    onChange={(e) => setDefaultSession(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Break Duration</Label>
                  <Input
                    type="number"
                    value={breakDuration}
                    onChange={(e) => setBreakDuration(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-center-between">
                  <span>Auto Break</span>
                  <Switch checked={autoBreak} onCheckedChange={setAutoBreak} />
                </div>
                <div className="flex flex-center-between">
                  <span>Adaptive Timer</span>
                  <Switch
                    checked={adaptiveTimer}
                    onCheckedChange={setAdaptiveTimer}
                  />
                </div>
              </div>
            </TabsContent>

            {/* NOTIFICATIONS */}
            <TabsContent value="notifications" className="space-y-6 max-w-md">
              <h2 className="text-xl font-semibold">Notifications</h2>
              <div className="grid gap-4">
                <div className="flex flex-center-between">
                  <span>Daily Reminder</span>
                  <Switch
                    checked={dailyReminder}
                    onCheckedChange={setDailyReminder}
                  />
                </div>
                <div className="flex flex-center-between">
                  <span>Email Notifications</span>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div>
                  <Label>Sound Volume</Label>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TRACKING */}
            <TabsContent value="tracking" className="space-y-6 max-w-md">
              <h2 className="text-xl font-semibold">Tracking & Insights</h2>
              <div className="grid gap-4">
                <div className="flex flex-center-between">
                  <span>Track Distractions</span>
                  <Switch
                    checked={trackDistractions}
                    onCheckedChange={setTrackDistractions}
                  />
                </div>
                <div className="flex flex-center-between">
                  <span>Track Mood</span>
                  <Switch checked={trackMood} onCheckedChange={setTrackMood} />
                </div>
                <div className="flex flex-center-between">
                  <span>Weekly Insights</span>
                  <Switch
                    checked={weeklyInsights}
                    onCheckedChange={setWeeklyInsights}
                  />
                </div>
              </div>
            </TabsContent>

            {/* APPEARANCE */}
            <TabsContent value="appearance" className="space-y-6 max-w-md">
              <h2 className="text-xl font-semibold">Appearance</h2>
              <div className="grid gap-4">
                <div>
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>UI Density</Label>
                  <Select value={uiDensity} onValueChange={setUiDensity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-center-between">
                  <span>Reduce Motion</span>
                  <Switch
                    checked={reduceMotion}
                    onCheckedChange={setReduceMotion}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </main>
  );
}
