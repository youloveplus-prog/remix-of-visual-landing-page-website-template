import { useQuery } from "@tanstack/react-query";
import { Flame, Trophy, Clock, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLearnerProfile } from "@/hooks/useLearnerProfile";
import { db } from "@/lib/db";

function useWeeklyStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["weekly-stats", user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 7);
      const { data } = await db
        .from("lesson_completions")
        .select("lesson_id, completed_at, lessons(duration_min)")
        .eq("user_id", user!.id)
        .gte("completed_at", since.toISOString());
      const rows = (data ?? []) as any[];
      const minutes = rows.reduce((s, r) => s + (r.lessons?.duration_min ?? 0), 0);
      return { missions: rows.length, minutes };
    },
  });
}

export function ProgressSnapshot() {
  const { data: profile } = useLearnerProfile();
  const { data: stats } = useWeeklyStats();
  const xp = profile?.xp ?? 0;
  const streak = profile?.streak_days ?? 0;
  const xpPct = Math.min(100, (xp % 100));

  return (
    <section className="section-x">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-2">This week</p>
      <div className="grid grid-cols-4 gap-2">
        <RingStat icon={Trophy} label="XP" value={xp} pct={xpPct} />
        <Stat icon={Flame} label="Streak" value={`${streak}d`} />
        <Stat icon={Clock} label="Minutes" value={stats?.minutes ?? 0} />
        <Stat icon={Target} label="Done" value={stats?.missions ?? 0} />
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3 flex flex-col items-center justify-center text-center">
      <Icon className="h-4 w-4 text-foreground mb-1" />
      <span className="font-bold text-sm leading-none tabular-nums">{value}</span>
      <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

function RingStat({ icon: Icon, label, value, pct }: { icon: any; label: string; value: any; pct: number }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3 flex flex-col items-center justify-center text-center relative">
      <div
        className="absolute inset-2 rounded-xl opacity-20"
        style={{ background: `conic-gradient(hsl(var(--foreground)) ${pct}%, transparent 0)` }}
        aria-hidden
      />
      <Icon className="h-4 w-4 text-foreground mb-1 relative" />
      <span className="font-bold text-sm leading-none relative tabular-nums">{value}</span>
      <span className="text-[10px] text-muted-foreground mt-1 relative">{label}</span>
    </div>
  );
}
