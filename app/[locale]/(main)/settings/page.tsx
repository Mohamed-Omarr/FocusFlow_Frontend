import { createServerSupabaseClient } from "@/lib/supabase/server";
import SettingsClient from "./Index";

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // or redirect
  }

  const { data, error } = await supabase
    .from("profile")
    .select("username, email, avatar")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    throw new Error("Failed to load profile");
  }

  return (
    <SettingsClient
      user={{
        username: data.username,
        email: data.email,
        avatar: data.avatar,
      }}
    />
  );
}
