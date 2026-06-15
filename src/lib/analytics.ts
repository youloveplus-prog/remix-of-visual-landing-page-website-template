import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent =
  | "search_performed"
  | "product_viewed"
  | "cart_add"
  | "content_viewed"
  | "mentor_waitlist_joined"
  | "ai_tutor_message"
  | "content_purchased"
  | "legal_toc_click"
  | "legal_scroll_depth"
  | "legal_section_viewed";

/**
 * Fire-and-forget event logging. Writes to `user_activity_log` via RLS
 * (users insert their own rows). Silently no-ops for unauthenticated users.
 */
export async function track(event: AnalyticsEvent, meta: Record<string, unknown> = {}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("user_activity_log").insert({
      user_id: user.id,
      event_type: event,
      meta: meta as never,
    });
  } catch {
    // never throw from analytics
  }
}
