"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function check_active_session_helper() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    throw new Error("Unauthorized or invalid reset session");
  }

   const { data: session } = await supabase
    .from("active_sessions")
    .select("session_status")
    .eq("user_id", user.id)
    .in("session_status", ["running", "finished_pending_extension"])
    .single();

  if (!session) {
    return false;
  }
    return true;
}
