"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { User, SettingsIcon, Lock, Shield } from "lucide-react";
import ProfileSettings from "./component/ProfileSettings";
import GeneralSettings from "./component/GeneralSettings";
import PasswordSettings from "./component/PasswordSettings";
import AccountSettings from "./component/AccountSettings";
import PasswordModal from "./component/PasswordModal";
import DeleteAccountModal from "./component/DeleteAccountModal";

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

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="rounded-2xl border p-8 mb-10 bg-card/50 backdrop-blur-xl">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your account preferences and configurations
          </p>
        </div>

        <Tabs
          defaultValue="profile"
          className="flex flex-col lg:flex-row gap-6"
        >
          {/* Sidebar */}
          <TabsList
            className="
  flex lg:flex-col h-fit lg:w-64 shrink-0 gap-2 
  p-3 rounded-2xl bg-card/50 backdrop-blur-xl 
  border border-border/50 shadow-lg 
  overflow-x-auto lg:overflow-visible
"
          >
            <TabsTrigger
              value="profile"
              className="
      w-full justify-start gap-3
      data-[state=active]:bg-primary/10 
      data-[state=active]:text-primary
      transition-all duration-200
    "
            >
              <User className="w-4 h-4" /> Profile
            </TabsTrigger>

            <TabsTrigger
              value="general"
              className="
      w-full justify-start gap-3
      data-[state=active]:bg-primary/10 
      data-[state=active]:text-primary
      transition-all duration-200
    "
            >
              <SettingsIcon className="w-4 h-4" /> General
            </TabsTrigger>

            <TabsTrigger
              value="password"
              className="
      w-full justify-start gap-3
      data-[state=active]:bg-primary/10 
      data-[state=active]:text-primary
      transition-all duration-200
    "
            >
              <Lock className="w-4 h-4" /> Password
            </TabsTrigger>

            <TabsTrigger
              value="account"
              className="
      w-full justify-start gap-3
      data-[state=active]:bg-primary/10 
      data-[state=active]:text-primary
      transition-all duration-200
    "
            >
              <Shield className="w-4 h-4" /> Account
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <div className="flex-1">
            <TabsContent value="profile">
              <ProfileSettings
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                profileName={profileName}
                setProfileName={setProfileName}
                profileEmail={profileEmail}
                setProfileEmail={setProfileEmail}
              />
            </TabsContent>

            <TabsContent value="general">
              <GeneralSettings
                language={language}
                setLanguage={setLanguage}
                theme={theme}
                setTheme={setTheme}
              />
            </TabsContent>

            <TabsContent value="password">
              <PasswordSettings
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                setShowPasswordPopup={setShowPasswordPopup}
              />
            </TabsContent>

            <TabsContent value="account">
              <AccountSettings setShowDeletePopup={setShowDeletePopup} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* MODALS */}
      <PasswordModal
        open={showPasswordPopup}
        setOpen={setShowPasswordPopup}
        onConfirm={() => {
          console.log("Password updated");
        }}
      />

      <DeleteAccountModal
        open={showDeletePopup}
        setOpen={setShowDeletePopup}
        onConfirm={() => {
          console.log("Account deleted");
        }}
      />
    </main>
  );
}
