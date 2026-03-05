import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase.rpc("get_weekly_focus_chart");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // data is already shaped for the chart
  return NextResponse.json(Array.isArray(data) ? data : []);
}
