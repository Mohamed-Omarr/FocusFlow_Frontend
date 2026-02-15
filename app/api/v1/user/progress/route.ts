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

  /* User progress */
  const { data: progress, error: progressError } = await supabase
    .from("user_progress_insights")
    .select("current_streak, longest_streak")
    .eq("user_id", user.id)
    .single();

  if (progressError) {
    return NextResponse.json({ error: progressError.message }, { status: 400 });
  }

  /*  Active bridge challenge */
  const { data: activeChallenge, error: challengeError } = await supabase
    .from("bridge_challenges")
    .select("target_sessions, completed_sessions")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (challengeError) {
    return NextResponse.json(
      { error: "No active bridge challenge found" },
      { status: 404 }
    );
  }

  /*  Final response */
  return NextResponse.json({
    current_streak: progress.current_streak ?? 0,
    longest_streak: progress.longest_streak ?? 0,
    targetStars:activeChallenge.target_sessions ?? 0,
    currentStars:activeChallenge.completed_sessions ?? 0,
  });
}
