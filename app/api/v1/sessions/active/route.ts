import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redis } from "@/lib/upstash/upstash";
import { NextResponse } from "next/server";


// --- Types ---
export type ActiveSessionData = {
  id: string;
  task_name: string;
  planned_duration_minutes: number;
  is_on_break: boolean;
  allowed_break_count: number;
  breaktime_type: string;
  break_duration_minutes: number;
  breaks_taken: number;
  session_status: string;
  is_paused: boolean;
  extended_time_minutes: number;
};

export type ActiveSessionResponse = {
  session: ActiveSessionData | null;
  remaining_seconds: number;
};

// --- Helper: Heal Redis from Postgres ---
async function handleRedisMiss(userId: string, supabase: any, cacheKey: string): Promise<ActiveSessionResponse> {
  console.log("Redis Miss: Healing from Postgres...");

  const { data: session } = await supabase
    .from("active_sessions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!session) {
    return { session: null, remaining_seconds: 0 };
  }

  const { data: dbRemaining } = await supabase.rpc("get_active_timer");
  const now = Date.now();

  // Reconstruct the internal Redis state
  const newState = {
    ...session,
    target_end_time: session.is_paused ? null : now + (dbRemaining * 1000),
    remaining_when_paused: session.is_paused ? dbRemaining : null,
  };

  await redis.set(cacheKey, newState, { ex: 86400 });

  return {
    session: {
      id: session.id,
      task_name: session.task_name,
      planned_duration_minutes: session.planned_duration_minutes,
      is_on_break: session.is_on_break,
      allowed_break_count: session.allowed_break_count,
      breaktime_type: session.breaktime_type,
      break_duration_minutes: session.break_duration_minutes,
      breaks_taken: session.breaks_taken,
      session_status: session.session_status,
      is_paused: session.is_paused,
      extended_time_minutes: session.extended_time_minutes || 0,
    },
    remaining_seconds: dbRemaining,
  };
}

// --- Main GET Route ---
export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cacheKey = `timer:${user.id}`;
  const now = Date.now();

  try {
    let cached: any = await redis.get(cacheKey);

    // 1. If Redis is empty, run the Healing Logic
    if (!cached) {
      const fallback = await handleRedisMiss(user.id, supabase, cacheKey);
      return NextResponse.json(fallback);
    }

    let remaining = 0;

    // 2. LOGIC: Calculate remaining time or handle Paused state
    if (cached.is_paused) {
      // Time is frozen while paused. Do not check for 0.
      remaining = cached.remaining_when_paused || 0;
    } 
    else if (cached.session_status === 'running') {
      remaining = Math.max(0, Math.floor((cached.target_end_time - now) / 1000));

      // 3. Status Transition: Only move to pending extension if currently running
      if (remaining <= 0) {
        remaining = 0;
        cached.session_status = 'finished_pending_extension';
        cached.extension_started_at = new Date().toISOString();

        // Sync Redis
        await redis.set(cacheKey, cached, { ex: 86400 });

        // Sync Postgres (Satisfy check constraints)
        await supabase
          .from("active_sessions")
          .update({ 
            session_status: 'finished_pending_extension',
            extension_started_at: cached.extension_started_at 
          })
          .eq("id", cached.id);
      }
    } 
    else if (cached.session_status === 'finished_pending_extension') {
      remaining = 0;
    }

    // 4. Return the standard response
    const response: ActiveSessionResponse = {
      session: {
        id: cached.id,
        task_name: cached.task_name,
        planned_duration_minutes: cached.planned_duration_minutes,
        is_on_break: cached.is_on_break,
        allowed_break_count: cached.allowed_break_count,
        breaktime_type: cached.breaktime_type,
        break_duration_minutes: cached.break_duration_minutes,
        breaks_taken: cached.breaks_taken,
        session_status: cached.session_status,
        is_paused: cached.is_paused,
        extended_time_minutes: cached.extended_time_minutes || 0,
      },
      remaining_seconds: remaining
    };

    return NextResponse.json(response);

  } catch (err) {
    console.error("Timer GET Error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await req.json();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Start session in Postgres (The Source of Truth)
  // We need to fetch the returned row to get fields like 'task_name' and 'id'
  const { data: session_id, error } = await supabase.rpc("start_session", { 
    p_task_id: body.id, 
    p_planned_minutes: body.duration, 
    p_breaktime_type: body.breaktime_type 
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // 2. Fetch the fresh session row to cache it correctly
  const { data: fullSession } = await supabase
    .from("active_sessions")
    .select("*")
    .eq("id", session_id)
    .single();

  if (!fullSession) return NextResponse.json({ error: "Session creation failed" }, { status: 500 });

  // 3. SEED REDIS (The "Fast Lane")
  // We calculate the Target Time once.
  const targetEndTime = Date.now() + (body.duration * 60 * 1000);
  
  // We store the DB row + our Redis logic fields
  const redisState = {
    ...fullSession, // This spreads id, task_name, allowed_break_count, etc.
    target_end_time: targetEndTime,
    remaining_when_paused: null, 
  };

  await redis.set(`timer:${user.id}`, redisState, { ex: 86400 });

  return NextResponse.json({ success: true, session_id }, { status: 201 });
}