import { NextResponse } from "next/server";
import { Langfuse } from "langfuse";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { startActiveObservation } from "@langfuse/tracing";
import { langfuseSpanProcessor } from "@/instrumentation";  

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_BASE_URL!,
});

const groq = new Groq({
  apiKey: process.env.Groq_SECRET_KEY!,
});

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

    if (msg.role === "user") {
      content = JSON.stringify(snapshot);
    }

    return { role: msg.role, content };
  });
}

export async function POST(req: Request) {
  return await startActiveObservation("ai-insights-cron", async (rootSpan) => {
    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const auth = req.headers.get("authorization");

    if (auth !== `Bearer ${process.env.CRON_SECRET_SERVER}`) {
      rootSpan.update({
        level: "ERROR",
        output: "Unauthorized",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: allUsers, error: userError } = await adminSupabase
      .from("profile")
      .select("user_id");

    if (userError || !allUsers) {
      rootSpan.update({
        level: "ERROR",
        output: "Failed to fetch users",
      });
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    rootSpan.update({
      metadata: {
        totalUsers: String(allUsers.length),
      }
    });

    const log: Record<string, any> = {};
    const allInsights: Record<string, any[]> = {};

    for (const user of allUsers) {
      const userId = user.user_id;
      
      // Create a span for each user's processing
      await startActiveObservation(`process-user-${userId}`, async (userSpan) => {
        log[userId] = { steps: [], errors: {}, insertedRows: 0 };

        try {
          // 1️⃣ Get snapshot
          const { data: snapshot, error: snapshotError } = await adminSupabase.rpc(
            "get_ai_user_snapshot",
            { p_user_id: userId }
          );

          log[userId].steps.push({ step: "snapshot", snapshot });
          
          if (snapshotError || !snapshot) {
            log[userId].errors.snapshot = snapshotError || "Snapshot is empty";
            userSpan.update({
              level: "WARNING",
              output: "No snapshot available",
            });
            return;
          }

          // 2️⃣ Get Langfuse prompt
          let promptArray: any[] = [];
          let config: any = {};
          try {
            const prompt = await langfuse.getPrompt("ai_coach_v1");
            log[userId].steps.push({ step: "langfusePrompt", prompt });

            if (!Array.isArray(prompt.prompt)) throw new Error("Prompt is not an array");
            promptArray = prompt.prompt;
            config = (prompt as any).config || {};
          } catch (e: any) {
            log[userId].errors.prompt = e.message;
            userSpan.update({
              level: "ERROR",
              output: `Prompt error: ${e.message}`,
            });
            return;
          }

          // 3️⃣ Normalize messages
          let messages: { role: string; content: string }[] = [];
          try {
            messages = normalizeLangfuseMessages(promptArray, snapshot);
            log[userId].steps.push({ step: "normalizedMessages", messages });
            if (!messages || messages.length === 0) throw new Error("No messages to send to Groq");
          } catch (e: any) {
            log[userId].errors.normalization = e.message;
            userSpan.update({
              level: "ERROR",
              output: `Normalization error: ${e.message}`,
            });
            return;
          }

          // 4️⃣ Call Groq AI with nested generation
          await startActiveObservation("groq-ai-call", async (generation) => {
            generation.update({
              input: messages,
              model: config.model || "llama-3.3-70b-versatile",
              metadata: {
                temperature: String(config.temperature ?? 0.7),
                max_tokens: String(config.max_tokens ?? 500),
              }
            });

            let completion: any;
            try {
              completion = await groq.chat.completions.create({
                model: config.model || "llama-3.3-70b-versatile",
                temperature: config.temperature ?? 0.7,
                max_tokens: config.max_tokens ?? 500,
                messages,
              });

              log[userId].steps.push({ step: "groqRaw", completion });
            } catch (e: any) {
              log[userId].errors.groq = e.message;
              generation.update({
                level: "ERROR",
                output: `Groq error: ${e.message}`,
              });
              return;
            }

            const raw = completion.choices?.[0]?.message?.content;
            
            if (!raw) {
              log[userId].errors.emptyResponse = "Groq returned empty content";
              generation.update({
                level: "ERROR",
                output: "Empty response from Groq",
              });
              return;
            }

            generation.update({
              output: raw,
            });

            // 5️⃣ Parse JSON
            let insights: any[];
            try {
              insights = JSON.parse(raw);
              log[userId].steps.push({ step: "parsedInsights", insights });
            } catch (e) {
              log[userId].errors.invalidJSON = raw;
              generation.update({
                level: "ERROR",
                output: "Invalid JSON from Groq",
              });
              return;
            }

            // 6️⃣ Save to Supabase
            const rows = insights.map((i: any) => ({
              user_id: userId,
              type: i.type,
              message: i.message,
              confidence: i.confidence,
              context: i.context?.reason,
            }));

            if (rows.length > 0) {
              const { error: insertError } = await adminSupabase.from("ai_insights").insert(rows);
              if (insertError) {
                log[userId].errors.insert = insertError;
                generation.update({
                  level: "ERROR",
                  output: `Insert error: ${insertError.message}`,
                });
              } else {
                log[userId].insertedRows = rows.length;
                allInsights[userId] = insights;
                generation.update({
                  metadata: {
                    insertedRows: String(rows.length),
                  }
                });
              }
            } else {
              log[userId].steps.push({ step: "noInsightsToInsert" });
            }

          }, { asType: "generation" });

          userSpan.update({
            output: `Processed ${log[userId].insertedRows} insights`,
          });

        } catch (outerError: any) {
          log[userId].errors.unexpected = outerError.message;
          userSpan.update({
            level: "ERROR",
            output: `Unexpected error: ${outerError.message}`,
          });
        }
      });
    }

    rootSpan.update({
      output: {
        totalUsers: allUsers.length,
        totalInsights: Object.keys(allInsights).length,
      }
    });
    
    await langfuseSpanProcessor.forceFlush()

    return NextResponse.json({
      ok: true,
      message: "Cron AI run completed (full debug)",
      insights: allInsights,
      log,
    });
  });
}