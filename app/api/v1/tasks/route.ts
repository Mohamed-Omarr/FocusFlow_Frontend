import { base_url } from "@/lib/axios/axiosClient";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { qstash } from "@/lib/upstash/qstash";
import { NextResponse } from "next/server";

/**
 * GET /api/tasks
 * Fetch all tasks for the authenticated user
 */
export async function GET() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("completed", false)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/tasks
 * Create a new task
 */


function combineDateAndTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, 0);
}
/**
 * POST /api/tasks
 * Create a new task
 */


export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();
  const body = await req.json();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      name: body.name,
      category: body.category,
      date_type: body.date_type,
      single_date: body.single_date ?? null,
      date_start: body.date_start ?? null,
      date_end: body.date_end ?? null,
      reminder: body.reminder ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 2️⃣ Schedule reminder(s)
  if (body.reminder) {
    // --- Single date ---
    if (data.single_date) {
      const reminderDate = combineDateAndTime(
        data.single_date,
        body.reminder
      );

      const unixTime = Math.floor(reminderDate.getTime() / 1000);

      const res = await qstash.publish({
        url: `${base_url}/api/v1/tasks/send-reminder`,
        body: JSON.stringify({ taskId: data.id }),
        notBefore: unixTime,
      });

      await supabase
        .from("tasks")
        .update({ qstash_message_id: res.messageId })
        .eq("id", data.id);
    }

    // --- Date range (daily reminders) ---
    if (data.date_start && data.date_end) {
      let current = new Date(data.date_start);
      const end = new Date(data.date_end);

      while (current <= end) {
        const date = current.toISOString().split("T")[0];

        const reminderDate = combineDateAndTime(
          date,
          body.reminder
        );

        const unixTime = Math.floor(reminderDate.getTime() / 1000);

        await qstash.publish({
          url: `${base_url}/api/v1/tasks/send-reminder`,
          body: JSON.stringify({ taskId: data.id }),
          notBefore: unixTime,
        });

        current.setDate(current.getDate() + 1);
      }
    }
  }

  return NextResponse.json(data, { status: 201 });
}

