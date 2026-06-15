import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Realtime presence for legal pages. Each visitor joins a per-page channel and
 * broadcasts their current section index. Returns a count of concurrent
 * viewers per section.
 */
export function useLegalPresence(page: string, currentSection: number) {
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [total, setTotal] = useState(0);
  const keyRef = useRef<string>(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );

  const channelName = useMemo(() => `legal-presence:${page}`, [page]);

  useEffect(() => {
    const channel = supabase.channel(channelName, {
      config: { presence: { key: keyRef.current } },
    });

    const recompute = () => {
      const state = channel.presenceState() as Record<
        string,
        Array<{ section?: number }>
      >;
      const next: Record<number, number> = {};
      let count = 0;
      for (const arr of Object.values(state)) {
        const meta = arr[0];
        count += 1;
        if (typeof meta?.section === "number") {
          next[meta.section] = (next[meta.section] ?? 0) + 1;
        }
      }
      setCounts(next);
      setTotal(count);
    };

    channel
      .on("presence", { event: "sync" }, recompute)
      .on("presence", { event: "join" }, recompute)
      .on("presence", { event: "leave" }, recompute)
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ section: currentSection, ts: Date.now() });
        }
      });

    return () => {
      void channel.untrack();
      void supabase.removeChannel(channel);
    };
    // Only resubscribe when the page key changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName]);

  // Update tracked section without resubscribing.
  useEffect(() => {
    const channel = supabase.getChannels().find((c) => c.topic === `realtime:${channelName}`);
    if (channel && channel.state === "joined") {
      void channel.track({ section: currentSection, ts: Date.now() });
    }
  }, [currentSection, channelName]);

  return { counts, total };
}
