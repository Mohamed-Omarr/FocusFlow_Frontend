"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function requestPasswordReset(email: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
