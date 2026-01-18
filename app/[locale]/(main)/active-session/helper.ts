"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redis } from "@/lib/upstash/upstash";

// Helper to get User ID and handle Cache Invalidation
async function invalidateCache(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await redis.del(`timer:${user.id}`);
  }
}

// ⏸️ PAUSE
export async function pause_session(reason: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("pause_session", { p_reason: reason });

  if (error) throw new Error(error.message);

  await invalidateCache(supabase); // Clear Redis
  return true;
}

// ▶️ RESUME
export async function resume_session() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("resume_session");

  if (error) throw new Error(error.message);

  await invalidateCache(supabase); // Clear Redis
  return true;
}

// ➕ EXTEND
export async function extend_session(minutes: number) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("extend_session", { p_minutes: minutes });

  if (error) throw new Error(error.message);

  await invalidateCache(supabase); // Clear Redis
  return true;
}

// 🛑 CANCEL
export async function cancel_session(reason: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("cancel_session", { p_reason: reason });

  if (error) throw new Error(error.message);

  await invalidateCache(supabase); // Clear Redis
  return true;
}

// ☕ BREAKS
export async function start_manual_break() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("start_manual_break");

  if (error) throw new Error(error.message);

  await invalidateCache(supabase);
  return true;
}

export async function end_manual_break() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("end_manual_break");

  if (error) throw new Error(error.message);

  await invalidateCache(supabase);
  return true;
}


// session reflection
export async function save_session_reflection(selectedDistractions,distractionNote,mood,energy) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("active_sessions").update({
    session_status:"finished",extension_started_at:null,
  }).eq("id",sessionId).eq("session_status", "finished_pending_extension");

  if (error) throw new Error(error.message);

  await invalidateCache(supabase);

  return true;
}


// finished/completed active session
export async function finish_active_session(sessionId:string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("active_sessions").update({
    session_status:"finished",extension_started_at:null,
  }).eq("id",sessionId).eq("session_status", "finished_pending_extension");

  if (error) throw new Error(error.message);

  await invalidateCache(supabase);

  return true;
}


// check user if onboarding true
export async function checkuseronboarding() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data,error } = await supabase.from("profile").select("onboarding_completed").eq("user_id",user?.id).single();

  if (error) throw new Error(error.message);
  return data;
}

// Complete onboarding
export async function completeOnBoarding() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("complete_onboarding",{focus_rhythm:'Most days', session_length:'25',  main_struggle:'Getting started', goal_orientation:'Building the habit'})

  if (error) throw new Error(error.message);
  return true;
}