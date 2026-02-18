import { NextResponse } from "next/server";
import { Langfuse } from "langfuse";
import Groq from "groq-sdk";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_BASE_URL!,
});

const groq = new Groq({
  apiKey: process.env.Groq_SECRET_KEY!,
});

// Helper: normalize Langfuse prompt messages to Groq
function normalizeLangfuseMessages(promptArray: any[], snapshot: any) {
  return promptArray.map((msg: any) => {
    let content = "";

    if (typeof msg.content === "string") {
      content = msg.content;
    } else if (Array.isArray(msg.content)) {
      content = msg.content
        .filter((c: any) => c.type === "text")
        .map((c: any) => c.text)
        .join("\n");
    } else {
      throw new Error(`Invalid content for role ${msg.role}`);
    }

    // Replace snapshot placeholder for user role
    if (msg.role === "user") {
      content = JSON.stringify(snapshot);
    }

    return { role: msg.role, content };
  });
}

export async function POST(req: Request) {
  const supabaseAdmin = await createServerSupabaseClient();

  // Only allow cron calls
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET_SERVER}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch all users
  const { data: allUsers, error: userError } = await supabaseAdmin
    .from("profile")
    .select("user_id");

  if (userError || !allUsers) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  for (const user of allUsers) {
    const userId = user.user_id;

    // 1️⃣ Get snapshot for the user
    const { data: snapshot, error: snapshotError } = await supabaseAdmin.rpc(
      "get_ai_user_snapshot",
      { p_user_id: userId }
    );

    if (!snapshot || snapshotError) {
      console.error(`Snapshot failed for user ${userId}:`, snapshotError);
      continue;
    }

    // 2️⃣ Get Langfuse prompt
    let promptArray: any[] = [];
    let config: any = {};

    try {
      const prompt = await langfuse.getPrompt("ai_coach_v1");
      if (!Array.isArray(prompt.prompt)) {
        throw new Error("Prompt is not an array");
      }
      promptArray = prompt.prompt;
      config = (prompt as any).config || {};
    } catch (e: any) {
      console.error(`Failed to get prompt for user ${userId}:`, e.message);
      continue;
    }

    // 3️⃣ Normalize messages for Groq
    let messages: { role: string; content: string }[];
    try {
      messages = normalizeLangfuseMessages(promptArray, snapshot);
    } catch (e: any) {
      console.error(`Invalid Langfuse messages for user ${userId}:`, e.message);
      continue;
    }

    // 4️⃣ Call Groq AI
    let completion: any;
    try {
      completion = await groq.chat.completions.create({
        model: config.model || "llama-3.3-70b-versatile",
        temperature: config.temperature ?? 0.7,
        max_tokens: config.max_tokens ?? 500,
        messages,
      });
    } catch (e: any) {
      console.error(`Groq completion failed for user ${userId}:`, e.message);
      continue;
    }

    const raw = completion.choices?.[0]?.message?.content;
    if (!raw) {
      console.error(`Empty completion for user ${userId}`);
      continue;
    }

    // 5️⃣ Parse JSON insights
    let insights: any[];
    try {
      insights = JSON.parse(raw);
    } catch {
      console.error(`Invalid JSON from Groq for user ${userId}:`, raw);
      continue;
    }

    // 6️⃣ Save insights to Supabase
    const rows = insights.map((i: any) => ({
      user_id: userId,
      type: i.type,
      message: i.message,
      confidence: i.confidence,
      context: i.context?.reason,
    }));

    const { error: insertError } = await supabaseAdmin
      .from("ai_insights")
      .insert(rows);

    if (insertError) {
      console.error(`Insert failed for user ${userId}:`, insertError);
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Cron AI run completed for all users",
  });
}
