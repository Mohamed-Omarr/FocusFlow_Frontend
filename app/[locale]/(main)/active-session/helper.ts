"use server";

import { callMicroCoachingAI, generateShortFocusTip } from "@/lib/ai/generateShortFocusTip";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redis } from "@/lib/upstash/upstash";
import { randomUUID } from "crypto";

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

// ☕ Manual BREAKS
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

// finished/completed active session
export async function finish_active_session(sessionId:string,reflections:{mood:string,energy:string,distractions:string[],notes:string|null}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("active_sessions").update({
    session_status:"finished",extension_started_at:null,reflection_energy:reflections.energy,reflection_mood:reflections.mood,reflection_distractions:reflections.distractions,reflection_distraction_note:reflections.notes,
  }).eq("id",sessionId).eq("session_status", "finished_pending_extension");

  if (error) throw new Error(error.message);
  
  await invalidateCache(supabase);

  const ress = await generateShortFocusTip();
console.log(ress);

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
export async function completeOnBoarding(answers:{focus_rhythm:string,session_length:string,main_struggle:string,goal_orientation:string}) {
  
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("complete_onboarding",{focus_rhythm:answers.focus_rhythm, session_length:answers.session_length,  main_struggle:answers.main_struggle, goal_orientation:answers.goal_orientation})

  if (error) throw new Error(error.message);
  return true;
}



// test
//  async function handleAiTipsTwoSession(userId: string, sessionData: any) {
//   const key = `user:${userId}:recent_sessions`;
//   const tempSessionId = randomUUID();
//   const sessionDataWithTempId = {
//   tempSessionId, // temporary unique identifier
//   status: sessionData.status,
//   planned_duration: sessionData.planned_duration,
//   extended_duration: sessionData.extended_duration,
//   total_pause: sessionData.total_pause,
//   energy: sessionData.energy,
//   distractions: sessionData.distractions,
//   mood: sessionData.mood,
//   cancel_reason: sessionData.cancel_reason
//   };

//   //  Save session to Redis list
//   await redis.lpush(key, JSON.stringify(sessionDataWithTempId));

//   //  Check length
//   const count = await redis.llen(key);

//   if (count >= 2) {
//     //  Get last 2 sessions
//     const sessions = await redis.lrange(key, 0, 1); // newest first
//     const parsedSessions = sessions.map(s => JSON.parse(s)).reverse(); // oldest first

//     // Call AI to generate tips
//     const tips = await callMicroCoachingAI(userId,parsedSessions);

//     // Save tips in Supabase table "short_ai_tips"
//     const supabase = await createServerSupabaseClient();
//     await supabase.from("short_ai_tips").insert({
//       user_id: userId,
//       session_ids: parsedSessions.map(s => s.tempSessionId), // temporary IDs
//       tips,
//       used: false
//     });

//     //  Clear Redis cache for next 2-session cycle
//     await redis.del(key);
//   }
// }
