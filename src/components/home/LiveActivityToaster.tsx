import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  generateLiveActivity,
  describeActivity,
  activityEmoji,
} from "@/lib/live-activity";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Props {
  /** ms between toasts */
  intervalMs?: number;
  /** ms before the first toast */
  delayMs?: number;
}

/**
 * Periodically fires small social-proof toasts (recent purchases, reviews, …)
 * to add a sense of liveness to the app. Silent for users who prefer reduced
 * motion, and pauses while the tab is hidden.
 */
export function LiveActivityToaster({ intervalMs = 18000, delayMs = 6000 }: Props) {
  const reduced = usePrefersReducedMotion();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;

    const fire = () => {
      if (document.hidden) return;
      const a = generateLiveActivity();
      const { title, description } = describeActivity(a);
      toast(`${activityEmoji(a.kind)}  ${title}`, {
        description: `${description} · ${a.minutesAgo}m ago`,
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
  }, [reduced, intervalMs, delayMs]);

  return null;
}
