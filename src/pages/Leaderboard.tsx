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

const medal = (i: number) =>
  i === 0
    ? "from-amber-400 to-yellow-600"
    : i === 1
    ? "from-zinc-300 to-zinc-500"
    : i === 2
    ? "from-orange-400 to-amber-700"
    : "from-primary/30 to-primary/60";

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
        url="https://asikonpro.lovable.app/leaderboard"
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
              <div className="glass-strong rounded-3xl p-12 text-center">
                <Trophy className="size-8 mx-auto text-primary" aria-hidden />
                <h2 className="font-display text-2xl mt-4">No rankings yet</h2>
                <p className="text-muted-foreground mt-1">Be the first to complete a lesson.</p>
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
                    className="glass-strong rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition hover:translate-y-[-2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <div
                      className={`size-12 rounded-xl bg-gradient-to-br ${medal(i)} grid place-items-center text-background font-display font-semibold shrink-0`}
                      aria-label={`Rank ${i + 1}`}
                    >
                      {i < 3 ? <Crown className="size-5" aria-hidden /> : i + 1}
                    </div>
                    <Avatar className="size-10">
                      <AvatarImage src={row.profile?.avatar_url ?? undefined} alt="" />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold truncate">{name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Flame className="size-3.5 text-primary" aria-hidden />
                        {row.streak_days}-day streak · best {row.longest_streak}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl font-semibold">{row.xp.toLocaleString()}</p>
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
