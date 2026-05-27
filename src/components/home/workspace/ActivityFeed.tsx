import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Award, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/db";
import { SectionHeader } from "@/components/ui/section-header";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function useActivity() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["activity-feed", user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async () => {
      const [{ data: comps }, { data: miles }] = await Promise.all([
        db.from("lesson_completions")
          .select("id, completed_at, xp_awarded, lessons(title)")
          .eq("user_id", user!.id)
          .order("completed_at", { ascending: false })
          .limit(5),
        db.from("milestones")
          .select("id, kind, unlocked_at")
          .eq("user_id", user!.id)
          .order("unlocked_at", { ascending: false })
          .limit(3),
      ]);
      const items = [
        ...((comps ?? []) as any[]).map((c) => ({
          id: `c-${c.id}`,
          at: c.completed_at,
          icon: CheckCircle2,
          accent: "text-foreground",
          text: `Completed "${c.lessons?.title ?? "a lesson"}"`,
          meta: `+${c.xp_awarded} XP`,
        })),
        ...((miles ?? []) as any[]).map((m) => ({
          id: `m-${m.id}`,
          at: m.unlocked_at,
          icon: Award,
          accent: "text-foreground",
          text: `Unlocked ${m.kind.replace(/_/g, " ")}`,
          meta: "Badge",
        })),
      ].sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 6);
      return items;
    },
  });
}

export function ActivityFeed() {
  const { data: items } = useActivity();
  if (!items || items.length === 0) return null;

  return (
    <section className="section-x">
      <SectionHeader title="Recent activity" subtitle="Your last few wins" />
      <ul className="rounded-2xl glass border border-border/60 divide-y divide-border/40 overflow-hidden">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <li key={it.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-card border border-border/60 flex items-center justify-center shrink-0">
                <Icon className={`h-4 w-4 ${it.accent}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{it.text}</p>
                <p className="text-[11px] text-muted-foreground">{timeAgo(it.at)}</p>
              </div>
              <span className="text-[11px] font-semibold text-primary shrink-0">{it.meta}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
