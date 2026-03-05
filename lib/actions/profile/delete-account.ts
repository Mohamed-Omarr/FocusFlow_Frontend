"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function deleteAccount() {
  // 1️⃣ Get current user (normal auth)
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("Unauthorized");
  }

  // 2️⃣ Admin client (service role supabase Admin) -- only used here and in (send-reminder)
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3️⃣ Delete user
  const { error } = await adminSupabase.auth.admin.deleteUser(user.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
