"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PasswordSchemaType } from "@/lib/zod/settings/validation/password";

export async function updatePasswordAction(formData: PasswordSchemaType) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  //  Re-authenticate user with current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: formData.currentPassword,
  });

  if (signInError) {
    throw new Error("Current password is incorrect");
  }

  //  Update password
  const { error } = await supabase.auth.updateUser({
    password: formData.newPassword,
  });

  if (error) {
    throw new Error("Failed to update password");
  }

  return { success: true };
}
