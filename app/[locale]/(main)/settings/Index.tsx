"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, SettingsIcon, Lock, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

import ProfileSettings from "./component/ProfileSettings";
import GeneralSettings from "./component/GeneralSettings";
import PasswordSettings from "./component/PasswordSettings";
import AccountSettings from "./component/AccountSettings";
import PasswordModal from "./component/PasswordModal";
import DeleteAccountModal from "./component/DeleteAccountModal";

import { deleteAccount } from "@/lib/actions/delete-account";

interface UserInformation {
  username: string;
  email: string;
  avatar: string;
}

export default function SettingsClient({ user }: { user: UserInformation }) {
  const router = useRouter();

  /* ============================
        Local editable state
     ============================ */
  const [profileName, setProfileName] = useState(user.username);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  /* ============================
        Delete account handler
     ============================ */
  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await deleteAccount();
      router.replace("/login");
    } catch (err: any) {
      alert(err.message || "Failed to delete account");
    } finally {
      setDeletingAccount(false);
      setShowDeletePopup(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl border p-8 mb-10 bg-card/50">
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your account preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="flex flex-col lg:flex-row gap-6">
          <TabsList className="flex lg:flex-col lg:w-64 gap-2 p-3 rounded-2xl bg-card/50 border">
            <TabsTrigger value="profile">
              <User /> Profile
            </TabsTrigger>
            <TabsTrigger value="general">
              <SettingsIcon /> General
            </TabsTrigger>
            <TabsTrigger value="password">
              <Lock /> Password
            </TabsTrigger>
            <TabsTrigger value="account">
              <Shield /> Account
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="profile">
              <ProfileSettings
                avatarUrl={avatarUrl}
                setAvatarUrl={setAvatarUrl}
                profileName={profileName}
                setProfileName={setProfileName}
                profileEmail={user.email}
              />
            </TabsContent>

            <TabsContent value="general">
              <GeneralSettings />
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

      {/* Modals */}
      <PasswordModal
        open={showPasswordPopup}
        setOpen={setShowPasswordPopup}
        onConfirm={() => console.log("Password updated")}
      />

      <DeleteAccountModal
        open={showDeletePopup}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteAccount}
        loading={deletingAccount}
      />
    </main>
  );
}
