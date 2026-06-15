import { Flame } from "lucide-react";
import { useLearnerProfile } from "@/hooks/useLearnerProfile";

export function StreakTile() {
  const { data: profile } = useLearnerProfile();
  const streak = profile?.streak_days ?? 0;
  const xp = profile?.xp ?? 0;

  const label = streak > 0
    ? `${streak}-day streak`
    : "Start your streak";
  const sub = xp > 0 ? `${xp.toLocaleString()} XP total` : "+0 XP today";

  return (
    <div
      className="midnight-tile midnight-glow midnight-shine p-5 h-40 flex flex-col justify-between overflow-hidden"
      style={{ background: "hsl(var(--primary) / 0.08)", borderColor: "hsl(var(--primary) / 0.25)" }}
    >
      <div className="relative z-10 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
        <Flame className="h-5 w-5" />
      </div>
      <div className="relative z-10">
        <h3 className="font-display font-bold text-base text-foreground">{label}</h3>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-primary mt-1">{sub}</p>
      </div>
    </div>
  );
}
