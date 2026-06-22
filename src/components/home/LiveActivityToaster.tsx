import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useLiveActivity } from "@/hooks/useLiveActivity";
import { useLiveActivitySettings } from "@/hooks/useLiveActivitySettings";
import { useHomeAnnouncements } from "@/hooks/useHomeAnnouncements";
import {
  describeActivity,
  activityEmoji,
  timeAgoLabel,
} from "@/lib/live-activity";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const TOASTED_ANNOUNCEMENTS_KEY = "live-activity-announced";

function readToasted(): Set<string> {
  try { return new Set(JSON.parse(sessionStorage.getItem(TOASTED_ANNOUNCEMENTS_KEY) ?? "[]")); }
  catch { return new Set(); }
}
function persistToasted(s: Set<string>) {
  try { sessionStorage.setItem(TOASTED_ANNOUNCEMENTS_KEY, JSON.stringify([...s])); } catch {}
}

/**
 * Periodically fires social-proof toasts based on real activity, and shows
 * any admin-pushed announcement marked `show_as_toast` once per session.
 * Silent for users who prefer reduced motion, and pauses while the tab is hidden.
 */
export function LiveActivityToaster({ delayMs = 6000 }: { delayMs?: number }) {
  const reduced = usePrefersReducedMotion();
  const { data: settings } = useLiveActivitySettings();
  const { data: items = [] } = useLiveActivity(12);
  const { data: announcements = [] } = useHomeAnnouncements();
  const cursor = useRef(0);
  const timer = useRef<number | null>(null);

  // Force-pushed announcement toasts (once per session per id).
  useEffect(() => {
    const toasted = readToasted();
    let dirty = false;
    for (const a of announcements) {
      if (!a.show_as_toast || toasted.has(a.id)) continue;
      toast(a.title, {
        description: a.body ?? undefined,
        duration: 7000,
      });
      toasted.add(a.id);
      dirty = true;
    }
    if (dirty) persistToasted(toasted);
  }, [announcements]);

  // Periodic activity toasts.
  useEffect(() => {
    if (reduced) return;
    if (!settings?.toast_enabled) return;
    if (items.length === 0) return;

    const intervalMs = Math.max(5, settings.toast_interval_seconds) * 1000;

    const fire = () => {
      if (document.hidden) return;
      const a = items[cursor.current % items.length];
      cursor.current += 1;
      const { title, description } = describeActivity(a);
      toast(`${activityEmoji(a.kind)}  ${title}`, {
        description: `${description} · ${timeAgoLabel(a.occurredAt)}`,
        duration: 4500,
      });
    };

    const start = window.setTimeout(() => {
      fire();
      timer.current = window.setInterval(fire, intervalMs);
    }, delayMs);

    return () => {
      window.clearTimeout(start);
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [reduced, settings?.toast_enabled, settings?.toast_interval_seconds, items, delayMs]);

  return null;
}
