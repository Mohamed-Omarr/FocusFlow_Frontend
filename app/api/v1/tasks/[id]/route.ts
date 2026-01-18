import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * PATCH /api/tasks/:id
 * Update a task params: Promise<{ slug: string }>
 */
export async function PATCH(req: Request, {
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerSupabaseClient();
  const body = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task_id = (await params).id;

  const { data, error } = await supabase
    .from("tasks")
    .update({
      name: body.title,
      category: body.category,
      date_type: body.date_type,
      single_date: body.single_date,
      date_start: body.date_start,
      date_end: body.date_end,
      reminder: body.reminder,
      postponed:true,
      updated_at: new Date(),
    })
    .eq("id", task_id)
    .eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
export async function DELETE(_: Request, {
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
const task_id = (await params).id
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", task_id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Task deleted successfully" });
}
