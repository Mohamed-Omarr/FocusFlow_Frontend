"use server";

import { redirect } from "@/i18n/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function logout(local_lang:string) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    throw new Error("Unauthorized or invalid reset session");
  }

  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message);
  }

  redirect({href:"/login",locale:local_lang}); 
}
