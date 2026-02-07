import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DAY = 24 * 60 * 60 * 1000;

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

  /* ---------- CHECK USER STARTED ---------- */
  const { data: hasCompletedTask } = await supabase
    .from("tasks")
    .select("id")
    .eq("user_id", user.id)
    .eq("completed", true)
    .limit(1)
    .maybeSingle();

  if (!hasCompletedTask) {
    return NextResponse.json([]);
  }

  /* ---------- FETCH MILESTONES ---------- */
  const { data: milestones, error: milestoneError } = await supabase
    .from("milestones")
    .select("id, title, description, icon, type, order_index")
    .order("order_index", { ascending: true, nullsFirst: false });

  if (milestoneError) {
    return NextResponse.json(
      { error: milestoneError.message },
      { status: 400 },
    );
  }

  /* ---------- FETCH ACHIEVED ---------- */
  const { data: achievedRows, error: achievedError } = await supabase
    .from("user_milestones")
    .select("milestone_id, achieved_at")
    .eq("user_id", user.id);

  if (achievedError) {
    return NextResponse.json(
      { error: achievedError.message },
      { status: 400 },
    );
  }

  const achievedMap = new Map(
    achievedRows.map((r) => [r.milestone_id, r.achieved_at]),
  );

  /* ---------- PROGRESSION STATE ---------- */
  const progression = milestones.filter(
    (m) => m.type === "progression" && m.order_index !== null,
  );

  const lastAchievedOrder = progression.reduce((max, m) => {
    return achievedMap.has(m.id)
      ? Math.max(max, m.order_index!)
      : max;
  }, 0);

  const now = Date.now();

  /* ---------- VISIBILITY RULES ---------- */
  const visible = milestones
    .map((m) => {
      const achievedAt = achievedMap.get(m.id);

      // 🟡 EVENT → show only if achieved (recent)
      if (m.type === "event") {
        if (!achievedAt) return null;

        const diff = now - new Date(achievedAt).getTime();
        if (diff > DAY) return null;

        return {
          ...m,
          achieved: true,
        };
      }

      // 🔵 PROGRESSION
      if (m.order_index === lastAchievedOrder) {
        // latest achieved
        if (!achievedAt) return null;

        const diff = now - new Date(achievedAt).getTime();
        if (diff > DAY) return null;

        return {
          ...m,
          achieved: true,
        };
      }

      if (m.order_index === lastAchievedOrder + 1) {
        // next step
        return {
          ...m,
          achieved: false,
        };
      }

      return null;
    })
    .filter(Boolean);

  return NextResponse.json(visible);
}
