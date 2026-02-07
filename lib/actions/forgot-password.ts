"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { base_url } from "../axios/axiosClient";

export async function requestPasswordReset(email: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${base_url}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
