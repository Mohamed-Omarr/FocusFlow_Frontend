'use server'
import { createServerSupabaseClient } from "@/lib/supabase/server";
import crypto from "crypto";
import Groq from "groq-sdk";
import { Langfuse } from "langfuse";
import { startActiveObservation } from "@langfuse/tracing";

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_BASE_URL!,
});

const groq = new Groq({
  apiKey: process.env.Groq_SECRET_KEY!,
});

function createSessionPairHash(sessionIds: string[]) {
  const sorted = [...sessionIds].sort();
  const combined = sorted.join("_");
  return crypto.createHash("sha256").update(combined).digest("hex");
}

function normalizeLangfuseMessages(
  promptArray: any[],
  snapshot: any
): { role: "system" | "user"; content: string }[] {
  return promptArray.map((msg) => {
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

    if (msg.role === "user") {
      content = JSON.stringify(snapshot, null, 2);
    }

    return {
      role: msg.role,
      content,
    };
  });
}

export async function generateShortFocusTip() {
  return await startActiveObservation("generate-short-focus-tip", async (span) => {
    try {
      const supabase = await createServerSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Unauthorized");

      // Fetch last 2 completed sessions
      const { data: sessions, error: sessionError } = await supabase
        .from("session_history")
        .select("*")
        .eq("user_id", user.id)
        .eq("auto_finished", false)
        .order("created_at", { ascending: false })
        .limit(2);

      if (sessionError) throw sessionError;
      
      if (!sessions || sessions.length < 2) {
        span.update({
          output: "Not enough sessions",
        });
        return;
      }

      const sessionIds = [sessions[0].id, sessions[1].id];
      const sessionPairHash = createSessionPairHash(sessionIds);

      // Prevent duplicate tip generation
      const { data: existing } = await supabase
        .from("short_ai_tips")
        .select("id")
        .eq("user_id", user.id)
        .eq("session_pair_hash", sessionPairHash)
        .maybeSingle();

      if (existing) {
        span.update({
          output: "Tip already exists",
        });
        return;
      }

      // Get Langfuse prompt
      const prompt = await langfuse.getPrompt("short-focus-tip-v1");

      if (!Array.isArray(prompt.prompt)) {
        throw new Error("Langfuse prompt is not a message array");
      }

      // Build snapshot
      const snapshot = {
        session_1: sessions[0],
        session_2: sessions[1],
      };

      // Normalize messages for Groq
      const messages = normalizeLangfuseMessages(prompt.prompt, snapshot);

      // Create a nested generation for the Groq call
      await startActiveObservation("groq-llm-call", async (generation) => {
        generation.update({
          input: messages,
          model: "llama-3.3-70b-versatile",
          metadata: {
            temperature: 0.4,
            max_tokens: 200,
          }
        });

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          temperature: 0.4,
          max_tokens: 200,
          messages,
        });

        const raw = completion.choices?.[0]?.message?.content;

        if (!raw) {
          throw new Error("AI returned empty response");
        }

        generation.update({
          output: raw,
        });

        // Parse strict JSON
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new Error("AI did not return valid JSON");
        }

        if (!parsed.tip_1 || !parsed.tip_2) {
          throw new Error("AI response missing required fields");
        }

        // Save to DB
        const { error: insertError } = await supabase
          .from("short_ai_tips")
          .insert({
            user_id: user.id,
            session_ids: sessionIds,
            session_pair_hash: sessionPairHash,
            tips: parsed,
          });

        if (insertError && insertError.code !== "23505") {
          throw insertError;
        }

        span.update({
          output: parsed,
        });

      }, { asType: "generation" });

    } catch (error) {
      console.error("Generate tip error:", error);
      span.update({
        level: "ERROR",
        output: String(error),
      });
      throw error;
    }
  });
}