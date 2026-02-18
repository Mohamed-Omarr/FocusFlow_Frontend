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
  const auth = req.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET_SERVER}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: allUsers, error: userError } = await supabaseAdmin
    .from("profile")
    .select("user_id");

  if (userError || !allUsers) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  // For returning debug info
  const debug: Record<string, any> = {};
  const allInsights: Record<string, any[]> = {};

  for (const user of allUsers) {
    const userId = user.user_id;

    // 1️⃣ Get snapshot
    const { data: snapshot, error: snapshotError } = await supabaseAdmin.rpc(
      "get_ai_user_snapshot",
      { p_user_id: userId }
    );

    debug[userId] = { snapshot, errors: {} };

    if (!snapshot || snapshotError) {
      debug[userId].errors.snapshot = snapshotError || "Snapshot is empty";
      continue;
    }

    // 2️⃣ Get Langfuse prompt
    let promptArray: any[] = [];
    let config: any = {};
    try {
      const prompt = await langfuse.getPrompt("ai_coach_v1");
      if (!Array.isArray(prompt.prompt)) throw new Error("Prompt is not an array");
      promptArray = prompt.prompt;
      config = (prompt as any).config || {};
    } catch (e: any) {
      debug[userId].errors.prompt = e.message;
      continue;
    }

    // 3️⃣ Normalize messages
    let messages: { role: string; content: string }[] = [];
    try {
      messages = normalizeLangfuseMessages(promptArray, snapshot);
      debug[userId].messages = messages;
    } catch (e: any) {
      debug[userId].errors.normalization = e.message;
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
      debug[userId].groqRaw = completion.choices?.[0]?.message?.content || "";
    } catch (e: any) {
      debug[userId].errors.groq = e.message;
      continue;
    }

    const raw = completion.choices?.[0]?.message?.content;
    if (!raw) {
      debug[userId].errors.emptyResponse = "Groq returned empty content";
      continue;
    }

    // 5️⃣ Parse JSON
    let insights: any[];
    try {
      insights = JSON.parse(raw);
      debug[userId].parsedInsights = insights;
    } catch (e) {
      debug[userId].errors.invalidJSON = raw;
      continue;
    }

    // 6️⃣ Save to Supabase if there are insights
    const rows = insights.map((i: any) => ({
      user_id: userId,
      type: i.type,
      message: i.message,
      confidence: i.confidence,
      context: i.context?.reason,
    }));

    if (rows.length > 0) {
      const { error: insertError } = await supabaseAdmin.from("ai_insights").insert(rows);
      if (insertError) debug[userId].errors.insert = insertError;
      allInsights[userId] = insights;
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Cron AI run completed (debug mode)",
    insights: allInsights,
    debug,
  });
}