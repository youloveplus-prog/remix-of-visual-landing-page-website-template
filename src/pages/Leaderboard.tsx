import { SITE_URL } from "@/config/site";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Reveal } from "@/components/transitions/Reveal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Flame, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

type Row = {
  user_id: string;
  xp: number;
  streak_days: number;
  longest_streak: number;
  profile: { username: string | null; full_name: string | null; avatar_url: string | null } | null;
};

const medalClass = (i: number) =>
  i === 0
    ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
    : i === 1
    ? "bg-zinc-400/15 text-zinc-300 border-zinc-400/30"
    : i === 2
    ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
    : "bg-secondary text-foreground/70 border-border";

const Leaderboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", "xp"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learner_profiles")
        .select("user_id, xp, streak_days, longest_streak")
        .order("xp", { ascending: false })
        .limit(50);
      if (error) throw error;

      const ids = (data ?? []).map((r) => r.user_id);
      if (ids.length === 0) return [] as Row[];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .in("id", ids);

      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return (data ?? []).map((r) => ({
        ...r,
        profile: map.get(r.user_id) ?? null,
      })) as Row[];
    },
  });

  return (
    <AppLayout>
      <SEO
        title="Leaderboard — top learners on ASIKON"
        description="See the learners with the most XP and longest streaks on ASIKON. Climb the ranks one daily mission at a time."
        url={`${SITE_URL}/leaderboard`}
      />

      <Reveal as="section" className="pt-16 pb-10 sm:pt-24 sm:pb-14 lg:pt-32">
        <div className="container-editorial text-center max-w-3xl">
          <p className="eyebrow-bar mb-4 justify-center">Leaderboard</p>
          <h1 className="display-1 mb-4">The top of the class.</h1>
          <p className="body-lg text-muted-foreground">
            Updated continuously. Climb by completing daily missions and keeping your streak alive.
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="pb-24">
        <div className="container-editorial max-w-3xl">
          <ol className="space-y-3">
            {isLoading &&
              [...Array(8)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}

            {!isLoading && (!data || data.length === 0) && (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <Trophy className="size-7 mx-auto text-foreground/60" aria-hidden />
                <h2 className="font-display text-xl font-semibold mt-4">No rankings yet</h2>
                <p className="text-sm text-muted-foreground mt-1">Be the first to complete a lesson.</p>
              </div>
            )}

            {data?.map((row, i) => {
              const name =
                row.profile?.full_name ||
                row.profile?.username ||
                "Anonymous learner";
              const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
              return (
                <li key={row.user_id}>
                  <Link
                    to={`/profile/${row.user_id}`}
                    className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex items-center gap-4 transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <div
                      className={`size-11 rounded-xl border grid place-items-center font-display font-semibold tabular-nums shrink-0 ${medalClass(i)}`}
                      aria-label={`Rank ${i + 1}`}
                    >
                      {i < 3 ? <Crown className="size-4" aria-hidden /> : i + 1}
                    </div>
                    <Avatar className="size-10">
                      <AvatarImage src={row.profile?.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[14px] truncate">{name}</p>
                      <p className="text-[11.5px] text-muted-foreground flex items-center gap-2">
                        <Flame className="size-3.5 text-foreground/60" aria-hidden />
                        {row.streak_days}-day streak · best {row.longest_streak}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-semibold tabular-nums">{row.xp.toLocaleString()}</p>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">XP</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </Reveal>
    </AppLayout>
  );
};

export default Leaderboard;
