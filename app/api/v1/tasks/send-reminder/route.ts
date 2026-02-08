import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

/**
 * POST /api/tasks/send-reminder
 * Called by QStash
 */
export const POST = verifySignatureAppRouter(
  async (req: Request) => {
    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "Missing taskId" },
        { status: 400 }
      );
    }

    // 2️⃣ Admin client (service role supabase Admin) -- only used here
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: task, error } = await adminSupabase
  .from("tasks")
  .select(`
    id,
    name,
    reminder,
    single_date,
    date_start,
    date_end,
    reminded_at,
    next_reminder_at,
    user_id
  `)
  .eq("id", taskId)
  .single();

if (error || !task?.user_id) {
  return NextResponse.json({ skipped: true });
}

// get user email via Admin API
const { data: user, error: authError } = await adminSupabase.auth.admin.getUserById(task.user_id);

if (authError || !user.user.email) {
  return NextResponse.json({ skipped: true });
}

  const userEmail = user.user.email;

    
  if (task.reminded_at) {
        return NextResponse.json({ skipped: true });
      }

    // 3️⃣ Send email via Loops
    try {
  const res = await axios.post(
    "https://app.loops.so/api/v1/transactional",
    {
      email: userEmail,
      transactionalId: "cmldv15o77a990izbpq8dbost", // exact template ID
      dataVariables: {
        taskName: task.name, // must match placeholders in template
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Loops transactional response:", res.data);
    } catch (err: any) {
      console.error("Loops transactional error:", err.response?.data || err.message);
    }

    // 4️⃣ Mark as reminded
    const { data: updatedTask, error: updateError } = await adminSupabase
      .from("tasks")
      .update({ reminded_at: new Date().toISOString() })
      .eq("id", task.id);

    if (updateError) console.error("Supabase update failed:", updateError);
   

    return NextResponse.json({ success: true });
  }
);
