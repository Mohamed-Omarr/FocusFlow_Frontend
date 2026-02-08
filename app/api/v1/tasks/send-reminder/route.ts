import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import axios from "axios";

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

    const supabase = await createServerSupabaseClient();

    const { data: task, error } = await supabase
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
        user:profile (
          email
        )
      `)
      .eq("id", taskId)
      .single();

    // task deleted / invalid
    if (error || !task || !task.user?.email) {
      return NextResponse.json({ skipped: true });
    }
if (task.reminded_at) {
      return NextResponse.json({ skipped: true });
    }

    // 3️⃣ Send email via Loops
    try {
  const res = await axios.post(
    "https://app.loops.so/api/v1/transactional",
    {
      email: task.user.email,
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
    await supabase
      .from("tasks")
      .update({ reminded_at: new Date().toISOString() })
      .eq("id", task.id);

    return NextResponse.json({ success: true });
  }
);
