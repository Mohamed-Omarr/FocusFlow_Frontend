"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Trash2,
  Lock,
  AlertCircle,
  User,
  SettingsIcon,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [profileName, setProfileName] = useState("User");
  const [profileEmail, setProfileEmail] = useState("user@example.com");
  const [language, setLanguage] = useState("english");
  const [theme, setTheme] = useState("dark");

  const [avatarUrl, setAvatarUrl] = useState("/team.jpg");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    setShowPasswordPopup(true);
  };

  const confirmPasswordUpdate = () => {
    // Here you would make an API call to update the password
    console.log("Password updated successfully");
    setShowPasswordPopup(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const confirmDeleteAccount = () => {
    // Here you would make an API call to delete the account
    console.log("Account deleted");
    setShowDeletePopup(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl p-8">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="relative">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage your account preferences and configurations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Tabs
          defaultValue="profile"
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Sidebar Navigation */}
          <TabsList className="flex lg:flex-col h-fit lg:w-64 shrink-0 gap-2 p-3 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-lg overflow-x-auto lg:overflow-visible">
            <TabsTrigger
              value="profile"
              className="w-full justify-start gap-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="w-full justify-start gap-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <SettingsIcon className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="w-full justify-start gap-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <Lock className="w-4 h-4" />
              Password
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="w-full justify-start gap-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
            >
              <Shield className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Content Area */}
          <div className="flex-1">
            <TabsContent value="profile" className="m-0">
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="p-8 space-y-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-6 pb-8 border-b border-border/50">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <img
                        src={avatarUrl || "/placeholder.svg"}
                        alt="Profile Avatar"
                        className="relative w-32 h-32 rounded-full object-cover border-4 border-border/50 shadow-lg transition-transform duration-300 group-hover:scale-105"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300"
                      >
                        <div className="text-center">
                          <Upload className="w-6 h-6 text-white mx-auto mb-1" />
                          <span className="text-xs text-white font-medium">
                            Upload
                          </span>
                        </div>
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Click to upload new avatar
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        JPG, PNG or GIF (max. 2MB)
                      </p>
                    </div>
                  </div>

                  {/* Profile Fields */}
                  <div className="space-y-6 max-w-xl mx-auto">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Username</Label>
                      <Input
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="h-12 bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="h-12 bg-background/50 border-border/50"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="general" className="m-0">
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-xl p-8">
                <div className="space-y-8 max-w-xl mx-auto">
                  {/* Title + Border Under It */}
                  <div className="pb-4 border-b border-border/60">
                    <h2 className="text-2xl font-bold">General Settings</h2>
                  </div>

                  {/* INLINE LANGUAGE + THEME */}
                  <div className="flex items-start gap-10">
                    {/* Language */}
                    <div className="flex flex-row gap-2">
                      <Label className="text-sm font-medium">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-40 h-12 bg-background/50 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="turkish">Turkish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Theme (Dark / Light / System — same state: theme + setTheme) */}
                    <div className="flex flex-row gap-2">
                      <Label className="text-sm font-medium">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-40 h-12 bg-background/50 border-border/50">
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
              </div>
            </TabsContent>

            <TabsContent value="password" className="m-0">
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-xl p-8">
                <div className="space-y-8 max-w-xl mx-auto">
                  <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Change Password</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Update your password to keep your account secure
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Current Password
                      </Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="h-12 bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        New Password
                      </Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        className="h-12 bg-background/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Confirm New Password
                      </Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="h-12 bg-background/50 border-border/50"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handlePasswordUpdate}
                        disabled={
                          !currentPassword || !newPassword || !confirmPassword
                        }
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="m-0">
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-xl p-8">
                <div className="space-y-8 max-w-xl mx-auto">
                  <div className="flex items-center gap-3 pb-6 border-b border-border/50">
                    <div className="p-3 bg-destructive/10 rounded-xl">
                      <Shield className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Account Management</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage your account settings and data
                      </p>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-destructive text-lg mb-2">
                          Danger Zone
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Permanently delete your account and all associated
                          data. This action cannot be undone.
                        </p>
                        <button
                          onClick={() => setShowDeletePopup(true)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {showPasswordPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border/50 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Confirm Password Change</h3>
            </div>
            <p className="text-muted-foreground">
              Are you sure you want to update your password? You'll need to use
              your new password on your next login.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowPasswordPopup(false)}
                className="px-5 py-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmPasswordUpdate}
                className="px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-destructive/50 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/10 rounded-xl">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-destructive">
                Delete Account
              </h3>
            </div>
            <p className="text-muted-foreground">
              Are you absolutely sure? This action cannot be undone. All your
              data, sessions, and analytics will be permanently deleted from our
              servers.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-5 py-2.5 bg-muted hover:bg-muted/80 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="px-5 py-2.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
