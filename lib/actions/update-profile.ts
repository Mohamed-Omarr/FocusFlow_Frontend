"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProfileSchema } from "../zod/settings/validation/profile";

export async function updateProfile(data: ProfileSchema) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("Unauthorized");
  }

  let avatarUrl: string | undefined;

  /* ============================
      Upload avatar (overwrite)
     ============================ */
  if (data.avatar) {
    const fileExt = data.avatar.name.split(".").pop(); // png  | jpeg
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile_avatars")
      .upload(filePath, data.avatar, {
        upsert: true,          // 👈 overwrite old avatar
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error(uploadError);
      throw new Error("Failed to upload avatar");
    }

    const { data: publicUrl } = supabase.storage
      .from("profile_avatars")
      .getPublicUrl(filePath);

    avatarUrl = publicUrl.publicUrl;
  }

  /* ============================
      Update profile table
     ============================ */
  const { error } = await supabase
    .from("profile")
    .update({
      username: data.username,
      ...(avatarUrl && { avatar: avatarUrl }),
    })
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update profile");
  }
}
