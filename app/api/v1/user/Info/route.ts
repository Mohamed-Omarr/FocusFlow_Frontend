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
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2️⃣ Fetch profile
    const { data, error } = await supabase
      .from("profile")
      .select("username, email, avatar, language")
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    // 3️⃣ Return client-ready shape
    return NextResponse.json({
      name: data.username,
      email: data.email,
      avatar: data.avatar,
      language: data.language
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
