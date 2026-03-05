import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // 1️⃣ Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Fetch data
    const { data, error } = await supabase
      .from("ai_insights")
      .select("type, message")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }) 
      .limit(3);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { message: "Failed to fetch weekly suggestions" },
        { status: 500 },
      );
    }

    // 3️⃣ Return the array directly
    return NextResponse.json(data);
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
