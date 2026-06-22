import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  GraduationCap,
  ShoppingBag,
  ChevronDown,
  Award,
  Star,
  MessageSquare,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type EventKind =
  | "lesson_completed"
  | "order_placed"
  | "badge_earned"
  | "review_posted"
  | "post_created"
  | "level_up";

interface ActivityEvent {
  id: string;
  type: EventKind;
  label: string;
  timestamp: string;
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

const ICONS: Record<EventKind, React.ComponentType<{ className?: string }>> = {
  lesson_completed: GraduationCap,
  order_placed: ShoppingBag,
  badge_earned: Award,
  review_posted: Star,
  post_created: MessageSquare,
  level_up: TrendingUp,
};

const LABELS: Record<EventKind, (meta: any) => string> = {
  lesson_completed: () => "Completed a lesson",
  order_placed: () => "Placed an order",
  badge_earned: (meta) => `Earned badge "${meta?.badge ?? "new badge"}"`,
  review_posted: () => "Posted a review",
  post_created: () => "Shared a post",
  level_up: (meta) => `Reached level ${meta?.level ?? "up"}`,
};

function useRecentActivity(userId?: string) {
  return useQuery({
    queryKey: ["profile-activity-log", userId],
    enabled: !!userId,
    queryFn: async (): Promise<ActivityEvent[]> => {
      const { data, error } = await supabase
        .from("user_activity_log" as any)
        .select("id, event_type, meta, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.warn("[ProfileActivityFeed] activity log error", error.message);
        return [];
      }

      return (data ?? []).map((row: any) => {
        const t = row.event_type as EventKind;
        const labelFn = LABELS[t];
        return {
          id: row.id,
          type: t,
          label: labelFn ? labelFn(row.meta || {}) : row.event_type,
          timestamp: row.created_at,
        };
      });
    },
  });
}

export function ProfileActivityFeed({ userId }: { userId?: string }) {
  const [open, setOpen] = useState(true);
  const { data, isLoading } = useRecentActivity(userId);

  if (!userId) return null;

  return (
    <section className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Recent Activity
        </p>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="px-3 pb-3">
          {isLoading ? (
            <ul className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" />
              ))}
            </ul>
          ) : !data || data.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2 px-3">
              No activity yet. Complete a lesson or place an order to see it here.
            </p>
          ) : (
            <ol className="relative ml-3 pl-4 border-l border-border/60 space-y-3 py-1">
              {data.map((e) => {
                const Icon = ICONS[e.type] ?? Sparkles;
                return (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[1.4rem] top-1 h-5 w-5 rounded-full bg-primary/15 text-primary flex items-center justify-center ring-2 ring-background">
                      <Icon className="h-3 w-3" />
                    </span>
                    <p className="text-sm">{e.label}</p>
                    <p className="text-[11px] text-muted-foreground">{relativeTime(e.timestamp)}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
