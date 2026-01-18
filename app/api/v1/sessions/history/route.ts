import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * 
 * Fetch all session history for the authenticated user
 */

// --- Types ---
type SessionHistory = {
    id: string; 
    task_id: string; 

    start_time: string; // timestamptz (ISO string)
    end_time: string; // timestamptz (ISO string)

    planned_duration_minutes: number;
    extended_time_minutes: number | null;
    total_pause_minutes: number | null;
    total_break_minutes: number | null;

    is_canceled: boolean;
    cancel_reason: string | null;

   created_at: string; // timestamptz (ISO string)

    task_name: string;
    task_category: string;

    pauses: {
        reason: string;
    }[]; // jsonb
};

export type SessionHistoryResponse = {
   data: SessionHistory | [];
};

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("session_history")
    .select(`
    id,
    task_id,
    start_time,
    end_time,
    planned_duration_minutes,
    extended_time_minutes,
    total_pause_minutes,
    total_break_minutes,
    is_canceled,
    cancel_reason,
    created_at,
    task_name,
    task_category,
    pauses
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}
