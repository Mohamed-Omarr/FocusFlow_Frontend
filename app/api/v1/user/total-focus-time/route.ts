import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  /* Auth */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* RPC */
  const { data, error } = await supabase.rpc("get_focus_time_stats");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      {
        week_focus_hours: 0,
        week_focus_percent: 0,
        total_focus_hours: 0,
      },
      { status: 200 }
    );
  }

  const {
    week_focus_hours,
    week_focus_percent,
    total_focus_hours,
  } = data[0];

  return NextResponse.json(
    {
    week_focus_hours,
    week_focus_percent,
    total_focus_hours,
    },
    { status: 200 }
  );
}
