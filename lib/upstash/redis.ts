
import { createServerSupabaseClient } from "../supabase/server";
import { redis } from "./upstash";

export async function GET() {
const supabase = await createServerSupabaseClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  const cacheKey = `timer:${user?.id}`;

  // 1. Try to get time from Redis (takes 2ms)
  const cached = await redis.get(cacheKey);
  if (cached) return Response.json(cached);

  // 2. If not in Redis, run your Step 9 SQL (takes 100ms+)
  const { data } = await supabase.rpc('get_active_timer');

  // 3. Save to Redis for 10 seconds so the next refresh is instant
  if (data) {
    await redis.set(cacheKey, data, { ex: 10 });
  }

  return Response.json(data);
}