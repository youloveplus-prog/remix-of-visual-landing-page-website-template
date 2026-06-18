import { SITE_URL } from "@/config/site";
import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Clock, ArrowRight, Bot, Flame, Trophy, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { MobileSection } from "@/components/ui/mobile-section";
import { MobileCard } from "@/components/ui/mobile-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { SEO } from "@/components/SEO";
import { TodayMissionCard } from "@/features/mission/TodayMissionCard";
import { StreakBadge } from "@/features/progress/StreakBadge";
import { XPBar } from "@/features/progress/XPBar";
import { useTracks, useLessonCompletions } from "@/hooks/useTracks";
import { useLearnerProfile } from "@/hooks/useLearnerProfile";
import { useAuth } from "@/hooks/useAuth";
import { MyCoursesSection } from "@/components/learn/MyCoursesSection";
import { NextTopicCard } from "@/components/learn/NextTopicCard";
import { cn } from "@/lib/utils";

export default function Learn() {
  const { user } = useAuth();
  const { data: profile } = useLearnerProfile();
  const { data: tracks = [], isLoading: tracksLoading } = useTracks();
  const { data: done } = useLessonCompletions();

  const activeTrack = tracks.find((t) => t.id === profile?.active_track_id);
  const otherTracks = tracks.filter((t) => t.id !== profile?.active_track_id);

  return (
    <AppLayout>
      <SEO
        title="Learn — Asikon"
        description="Your personal learning hub. Daily missions, guided tracks, and a 24/7 AI tutor."
        url={`${SITE_URL}/learn`}
      />
      <MobilePage maxWidth="wide" spacing="space-y-6">
        {/* Header */}
        <header className="flex items-start justify-between gap-3 pt-1">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Learn
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold leading-tight mt-0.5">
              Keep your streak alive
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              One small lesson today. That's the whole game.
            </p>
          </div>
          {user && (
            <StreakBadge days={profile?.streak_days ?? 0} className="shrink-0 mt-1" />
          )}
        </header>

        {/* Today's mission */}
        <TodayMissionCard />

        {/* Mastery-driven next topic */}
        {user && <NextTopicCard />}

        {/* Progress strip (signed-in only) */}
        {user && (
          <MobileCard variant="glass" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Your progress
              </span>
              <Link to="/profile" className="text-[12px] font-medium text-primary inline-flex items-center gap-0.5">
                Profile <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <XPBar xp={profile?.xp ?? 0} />
            <div className="grid grid-cols-3 gap-2 pt-1">
              <Stat icon={Flame} value={profile?.streak_days ?? 0} label="streak" />
              <Stat icon={Trophy} value={done?.size ?? 0} label="done" />
              <Stat icon={Sparkles} value={profile?.xp ?? 0} label="xp" />
            </div>
          </MobileCard>
        )}

        {/* AI Tutor banner */}
        <Link
          to="/ai-tutor"
          className="block group rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 sm:p-5 pressable"
        >
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <span aria-hidden className="absolute inset-0 -m-3 rounded-full blur-2xl bg-primary/30 opacity-70" />
              <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground shadow-md">
                <Bot className="h-6 w-6" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Asikon AI · 24/7
              </p>
              <h3 className="font-display text-base sm:text-lg font-semibold leading-tight mt-0.5">
                Ask anything — get clear answers
              </h3>
              <p className="text-[12.5px] text-muted-foreground mt-0.5 line-clamp-1">
                Explain a concept, quiz me, plan revision.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-0.5 transition-transform shrink-0" />
          </div>
        </Link>

        {/* My enrolled courses */}
        <MyCoursesSection />

        {/* Continue learning */}
        {activeTrack && (
          <MobileSection title="Continue where you left off">
            <TrackRow track={activeTrack} doneIds={done} active />
          </MobileSection>
        )}

        {/* Browse tracks */}
        <MobileSection
          title={activeTrack ? "Explore more tracks" : "Pick your track"}
          subtitle={activeTrack ? undefined : "Pick one focused thing. You can switch any time."}
        >
          {tracksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : otherTracks.length === 0 && !activeTrack ? (
            <MobileCard variant="soft" className="text-center text-sm text-muted-foreground py-8">
              No tracks yet. Check back soon.
            </MobileCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherTracks.map((t, i) => (
                <TrackRow key={t.id} track={t} doneIds={done} index={i} />
              ))}
            </div>
          )}
        </MobileSection>

        {/* Quick actions */}
        <MobileSection title="Quick actions">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <QuickTile to="/prompts" icon={Sparkles} label="Prompt library" />
            <QuickTile to="/revision" icon={BookOpen} label="Revision" />
            <QuickTile to="/courses" icon={BookOpen} label="Courses" />
            <QuickTile to="/ai-tutor" icon={Bot} label="AI tutor" />
          </div>
        </MobileSection>
      </MobilePage>
    </AppLayout>
  );
}

function Stat({ icon: Icon, value, label }: { icon: any; value: number; label: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/60 px-2.5 py-2 flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-semibold tabular-nums leading-none">{value}</p>
        <p className="text-[10.5px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function TrackRow({
  track,
  doneIds,
  active,
  index = 0,
}: {
  track: { id: string; slug: string; name: string; description: string | null; icon: string | null };
  doneIds?: Set<string>;
  active?: boolean;
  index?: number;
}) {
  // Lightweight placeholder progress — TrackDetail computes the real value.
  return (
    <Link
      to={`/track/${track.slug}`}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border bg-card p-3.5 pressable",
        active ? "border-primary/40 bg-primary/5" : "border-border/60",
      )}
      style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
    >
      <div
        className={cn(
          "h-11 w-11 rounded-xl grid place-items-center text-lg shrink-0",
          active
            ? "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground"
            : "bg-secondary/60 text-foreground/80",
        )}
        aria-hidden
      >
        {track.icon ? <span>{track.icon}</span> : <BookOpen className="h-5 w-5" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[14px] font-semibold leading-tight truncate">{track.name}</p>
          {active && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
              Active
            </span>
          )}
        </div>
        {track.description && (
          <p className="text-[12px] text-muted-foreground leading-snug mt-0.5 line-clamp-1">
            {track.description}
          </p>
        )}
        {active && (
          <div className="mt-2">
            <Progress value={Math.min(100, (doneIds?.size ?? 0) * 10)} className="h-1" />
          </div>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
    </Link>
  );
}

function QuickTile({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/60 bg-card p-3 pressable text-center"
    >
      <span className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="text-[12px] font-medium leading-tight">{label}</span>
    </Link>
  );
}
