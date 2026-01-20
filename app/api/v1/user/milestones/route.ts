import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  /* ---------- AUTH ---------- */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* ---------- CHECK IF USER STARTED (COMPLETED ANY TASK) ---------- */
  const { data: hasCompletedTask } = await supabase
    .from("tasks")
    .select("id")
    .eq("user_id", user.id)
    .eq("completed", true)
    .limit(1)
    .maybeSingle();

  // 🚨 New user → no milestones at all
  if (!hasCompletedTask) {
    return NextResponse.json([]);
  }

  /* ---------- FETCH MILESTONES ---------- */
  const { data: milestones, error: milestoneError } = await supabase
    .from("milestones")
    .select("id, title, description, icon, created_at")
    .order("created_at", { ascending: true });

  if (milestoneError) {
    return NextResponse.json({ error: milestoneError.message }, { status: 400 });
  }

  /* ---------- FETCH ACHIEVED ---------- */
  const { data: achievedRows, error: achievedError } = await supabase
    .from("user_milestones")
    .select("milestone_id, achieved_at")
    .eq("user_id", user.id);

  if (achievedError) {
    return NextResponse.json({ error: achievedError.message }, { status: 400 });
  }

  /* ---------- MAP ACHIEVEMENTS ---------- */
  const achievedMap = new Map(
    achievedRows.map((r) => [r.milestone_id, r.achieved_at]),
  );

  const now = Date.now();

  const response = milestones
    .map((m) => {
      const achievedAt = achievedMap.get(m.id);

      if (achievedAt) {
        const diff = now - new Date(achievedAt).getTime();

        // ❌ achieved but older than 24h → hide
        if (diff > 24 * 60 * 60 * 1000) {
          return null;
        }

        // ✅ achieved within 24h → spotlight
        return {
          id: m.id,
          title: m.title,
          description: m.description,
          icon: m.icon,
          achieved: true,
        };
      }

      // ⏳ upcoming milestone
      return {
        id: m.id,
        title: m.title,
        description: m.description,
        icon: m.icon,
        achieved: false,
      };
    })
    .filter(Boolean);

  return NextResponse.json(response);
}
