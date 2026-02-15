"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function resetUserPassword(password: string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    throw new Error("Unauthorized or invalid reset session");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });
  await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
