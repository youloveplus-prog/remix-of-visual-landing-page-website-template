import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { GraduationCap, ShoppingBag, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ActivityEvent {
  id: string;
  type: "lesson" | "order";
  label: string;
  timestamp: string;
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d} days ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? "" : "s"} ago`;
  return `${Math.floor(mo / 12)} year${mo < 24 ? "" : "s"} ago`;
}

function useRecentActivity(userId?: string) {
  return useQuery({
    queryKey: ["profile-activity", userId],
    enabled: !!userId,
    queryFn: async (): Promise<ActivityEvent[]> => {
      const [completions, orders] = await Promise.all([
        supabase
          .from("lesson_completions")
          .select("id, completed_at, lessons(title)")
          .eq("user_id", userId!)
          .order("completed_at", { ascending: false })
          .limit(5),
        supabase
          .from("orders")
          .select("id, created_at, order_items(id)")
          .eq("user_id", userId!)
          .order("created_at", { ascending: false })
          .limit(2),
      ]);

      const events: ActivityEvent[] = [];
      for (const c of completions.data ?? []) {
        const title = (c as any).lessons?.title ?? "a lesson";
        events.push({
          id: `lesson-${c.id}`,
          type: "lesson",
          label: `Completed ${title}`,
          timestamp: c.completed_at as string,
        });
      }
      for (const o of orders.data ?? []) {
        const count = (o as any).order_items?.length ?? 0;
        events.push({
          id: `order-${o.id}`,
          type: "order",
          label: `Ordered ${count} item${count === 1 ? "" : "s"}`,
          timestamp: o.created_at as string,
        });
      }
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return events.slice(0, 5);
    },
  });
}

export function ProfileActivityFeed({ userId }: { userId?: string }) {
  const [open, setOpen] = useState(true);
  const { data, isLoading } = useRecentActivity(userId);

  if (!userId) return null;
  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Recent Activity
        </p>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="space-y-2 px-3 pb-3">
          {isLoading && (
            <li className="h-12 rounded-lg bg-muted/40 animate-pulse" />
          )}
          {(data ?? []).map((e) => (
            <li
              key={e.id}
              className="flex items-start gap-3 pl-3 pr-2 py-2 rounded-lg border-l-2 border-primary/60 bg-secondary/20"
            >
              <div className="mt-0.5 text-primary">
                {e.type === "lesson" ? <GraduationCap className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{e.label}</p>
                <p className="text-[11px] text-muted-foreground">{relativeTime(e.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
