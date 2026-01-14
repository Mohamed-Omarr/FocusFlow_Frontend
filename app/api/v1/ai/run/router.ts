import { NextResponse } from "next/server";
import { Langfuse } from "langfuse";
import Groq from "groq-sdk";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_HOST!,
});

const groq = new Groq({
  apiKey: process.env.Groq_SECRET_KEY!,
});

const supabaseAdmin = await createServerSupabaseClient();

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  console.log("Running in cron mode");

  // 1️⃣ Cron / Edge Function mode
  if (auth === `Bearer ${process.env.CRON_SECRET_SERVER}`) {

    // Fetch all users from Supabase
    const { data: users, error: usersError } = await supabaseAdmin
      .from("profile")
      .select("id");

    if (usersError || !users) {
      return NextResponse.json(
        { error: "Failed to fetch users for cron run" },
        { status: 500 }
      );
    }

    for (const user of users) {
      const userId = user.id;

      // 1. Get user snapshot
      const { data: snapshot, error } = await supabaseAdmin.rpc(
        "get_ai_user_snapshot",
        { p_user_id: userId }
      );
      if (!snapshot || error) {
        console.error(`Snapshot failed for user ${userId}:`, error);
        continue;
      }

      // 2. Get prompt & config
      const prompt = await langfuse.getPrompt("focusflow_ai_coach");
      const systemMessage = prompt.messages[0].content;
      const config = prompt.config;

      // 3. Call Groq AI
      const completion = await groq.chat.completions.create({
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: JSON.stringify(snapshot) },
        ],
      });

      const raw = completion.choices[0].message?.content;
      let insights;
      try {
        insights = JSON.parse(raw || "[]");
      } catch {
        console.error(`Invalid JSON for user ${userId}:`, raw);
        continue;
      }

      // 4. Save insights
      const rows = insights.map((i: any) => ({
        user_id: userId,
        type: i.type,
        message: i.message,
      }));

      const { error: insertError } = await supabaseAdmin
        .from("ai_insights")
        .insert(rows);

      if (insertError) {
        console.error(`Insert failed for user ${userId}:`, insertError);
      }
    }

    return NextResponse.json({ ok: true, message: "Cron AI run completed" });
  }

  // 2️⃣ Normal user mode
  else {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = data.user.id;

    // Same logic as before for a single user
    const { data: snapshot, error } = await supabaseAdmin.rpc(
      "get_ai_user_snapshot",
      { p_user_id: userId }
    );

    if (error || !snapshot) {
      console.error(error);
      return NextResponse.json({ error: "Snapshot failed" }, { status: 500 });
    }

    const prompt = await langfuse.getPrompt("focusflow_ai_coach");
    const systemMessage = prompt.messages[0].content;
    const config = prompt.config;

    const completion = await groq.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.max_tokens,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: JSON.stringify(snapshot) },
      ],
    });

    const raw = completion.choices[0].message?.content;
    let insights;
    try {
      insights = JSON.parse(raw || "[]");
    } catch {
      console.error("Invalid JSON:", raw);
      return NextResponse.json({ error: "Bad AI output" }, { status: 500 });
    }

    const rows = insights.map((i: any) => ({
      user_id: userId,
      type: i.type,
      message: i.message,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("ai_insights")
      .insert(rows);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, insights });
  }
}
