import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
  const supabase = await createServerSupabaseClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch latest tips row
    const { data, error } = await supabase
      .from("short_ai_tips")
      .select("tips")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch tips" },
        { status: 500 }
      );
    }

    // If no tips found
    if (!data || !data.tips) {
      return NextResponse.json({
        tip_1: null,
        tip_2: null,
      });
    }

    // Return JSONB values
    return NextResponse.json(data.tips);

  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
