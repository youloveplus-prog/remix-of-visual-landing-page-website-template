import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { convertToModelMessages, streamText, type UIMessage } from "npm:ai@6.0.177";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";
import { ASIKON_SYSTEM_PROMPT } from "../_shared/system-prompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const MAX_MESSAGES = 40;
    const MAX_CHARS_PER_MESSAGE = 8000;
    const MAX_TOTAL_CHARS = 60000;

    const body = await req.json();
    const messages = (body?.messages ?? []) as UIMessage[];
    const threadId = body?.threadId as string | undefined;
    if (!threadId || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Missing threadId or messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: `Too many messages (max ${MAX_MESSAGES})` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let totalChars = 0;
    for (const m of messages) {
      const text = (m?.parts ?? [])
        .map((p: any) => (typeof p?.text === "string" ? p.text : ""))
        .join("");
      if (text.length > MAX_CHARS_PER_MESSAGE) {
        return new Response(
          JSON.stringify({ error: `Message too long (max ${MAX_CHARS_PER_MESSAGE} chars)` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      totalChars += text.length;
    }
    if (totalChars > MAX_TOTAL_CHARS) {
      return new Response(
        JSON.stringify({ error: `Conversation too large (max ${MAX_TOTAL_CHARS} chars)` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Verify thread ownership
    const { data: thread, error: threadErr } = await supabase
      .from("ai_threads")
      .select("id, user_id, title")
      .eq("id", threadId)
      .maybeSingle();
    if (threadErr || !thread || thread.user_id !== user.id) {
      return new Response(JSON.stringify({ error: "Thread not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Persist last user message
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "user") {
      await supabase.from("ai_messages").insert({
        thread_id: threadId,
        user_id: user.id,
        role: "user",
        parts: lastMsg.parts ?? [],
      });
      // Auto-title if still default
      if (thread.title === "New chat") {
        const text =
          (lastMsg.parts ?? [])
            .map((p: any) => (p.type === "text" ? p.text : ""))
            .join(" ")
            .trim()
            .slice(0, 60) || "New chat";
        await supabase.from("ai_threads").update({ title: text }).eq("id", threadId);
      }
    }

    const gateway = createLovableAiGatewayProvider(LOVABLE_API_KEY);
    const model = gateway("google/gemini-3-flash-preview");

    const result = streamText({
      model,
      system: ASIKON_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      headers: corsHeaders,
      onFinish: async ({ messages: finalMessages }) => {
        const assistant = finalMessages[finalMessages.length - 1];
        if (assistant?.role !== "assistant") return;

        // Extract the [ASIKON step=... hint=... topic=... attempt=...] header
        // the system prompt requires on the first line of every reply.
        const text = (assistant.parts ?? [])
          .map((p: any) => (p?.type === "text" ? p.text : ""))
          .join("");
        const headerRe = /^\s*\[ASIKON\s+([^\]]+)\]/;
        const m = text.match(headerRe);

        let socratic_step: string | null = null;
        let hint_level: number | null = null;
        let topic_hint: string | null = null;

        if (m) {
          const fields = m[1];
          const pairs: Record<string, string> = {};
          for (const pm of fields.matchAll(/(\w+)=([^\s\]]+)/g)) {
            pairs[pm[1].toLowerCase()] = pm[2];
          }
          const rawStep = pairs.step?.toLowerCase();
          if (["understand", "plan", "try", "check"].includes(rawStep)) {
            socratic_step = rawStep;
          }
          if (pairs.hint && /^[0-5]$/.test(pairs.hint)) {
            hint_level = parseInt(pairs.hint, 10);
          }
          if (pairs.topic) topic_hint = pairs.topic;
        }

        await supabase.from("ai_messages").insert({
          thread_id: threadId,
          user_id: user.id,
          role: "assistant",
          parts: assistant.parts ?? [],
          socratic_step,
          hint_level,
          topic_hint,
        });

        // Update thread-level Socratic state so the rail persists across reloads.
        const threadPatch: Record<string, unknown> = {};
        if (socratic_step) threadPatch.active_step = socratic_step;
        if (hint_level !== null) threadPatch.last_hint_level = hint_level;
        if (Object.keys(threadPatch).length > 0) {
          await supabase.from("ai_threads").update(threadPatch).eq("id", threadId);
        }
      },
    });
  } catch (err) {
    console.error("ai-tutor-chat error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
