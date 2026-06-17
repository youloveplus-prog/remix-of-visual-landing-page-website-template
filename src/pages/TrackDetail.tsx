import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Clock, Lock, Play, ArrowLeft, Users, Star, BookOpen, Award } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
import { DetailSection } from "@/components/ui/detail-section";
import { MetaItem } from "@/components/ui/meta-row";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";
import { useTrack, useTrackLessons, useLessonCompletions } from "@/hooks/useTracks";
import { useLearnerProfile, useUpsertLearnerProfile } from "@/hooks/useLearnerProfile";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function TrackDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { data: track, isLoading } = useTrack(slug);
  const { data: lessons = [] } = useTrackLessons(track?.id);
  const { data: done } = useLessonCompletions();
  const { data: profile } = useLearnerProfile();
  const upsert = useUpsertLearnerProfile();

  const completed = lessons.filter((l) => done?.has(l.id)).length;
  const total = lessons.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const isActive = profile?.active_track_id === track?.id;
  const totalDuration = lessons.reduce((s, l) => s + (l.duration_min || 0), 0);

  const setActive = async () => {
    if (!track) return;
    await upsert.mutateAsync({ active_track_id: track.id });
    toast.success(`${track.name} is now your active track`);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <MobilePage maxWidth="reading">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </MobilePage>
      </AppLayout>
    );
  }

  if (!track) {
    return (
      <AppLayout>
        <MobilePage maxWidth="reading">
          <div className="py-20 text-center text-muted-foreground">Track not found.</div>
        </MobilePage>
      </AppLayout>
    );
  }

  const ctaLabel = isActive ? "Continue learning" : "Make this my active track";

  return (
    <AppLayout>
      <SEO
        title={track?.name ? `${track.name} — Learning Track` : "Learning Track"}
        description={track?.description ?? "Follow a curated learning track on Asikon."}
        type="article"
      />
      <MobilePage maxWidth="reading" spacing="space-y-8" className="pb-sticky-cta lg:pb-6">
        <Link to="/" className="inline-flex items-center text-[13px] text-muted-foreground hover:text-foreground gap-1 active:opacity-60 transition-opacity">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </Link>

        <PageHero
          eyebrow="Learning Track"
          title={track.name}
          subtitle={track.description || undefined}
          meta={
            <>
              <MetaItem icon={BookOpen} label={total === 1 ? "lesson" : "lessons"} value={total} />
              <MetaItem icon={Clock} label="min" value={totalDuration} />
              <MetaItem icon={Star} label="4.8" />
              <MetaItem icon={Users} label="1.2k enrolled" />
            </>
          }
        />

        <DetailSection title="Your progress" divided={false}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-muted-foreground">
                {completed} of {total} complete
              </span>
              <span className="font-semibold tabular-nums">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
            {isActive && (
              <p className="text-[12px] text-primary font-medium pt-1">Active track</p>
            )}
          </div>
        </DetailSection>

        <DetailSection title="Curriculum">
          <ol className="divide-y divide-border/40 -mx-1">
            {lessons.map((l, i) => {
              const isDone = done?.has(l.id);
              const isLocked = !user && !l.is_preview;
              return (
                <li key={l.id}>
                  <Link
                    to={isLocked ? "/auth" : `/lesson/${l.id}`}
                    className="flex items-center gap-3 py-3.5 px-1 active:opacity-60 transition-opacity"
                  >
                    <span className="grid place-items-center h-9 w-9 rounded-full bg-muted/60 text-[12px] font-semibold tabular-nums shrink-0">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[14px] truncate">{l.title}</p>
                      <p className="text-[12px] text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> {l.duration_min} min
                        {l.is_preview && <span className="ml-1 text-primary">· Free preview</span>}
                      </p>
                    </div>
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    ) : isLocked ? (
                      <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <Play className="h-4 w-4 text-foreground/60 shrink-0" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </DetailSection>

        <DetailSection title="What you'll earn">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: Award, label: "Verified completion certificate" },
              { icon: CheckCircle2, label: "Hands-on project portfolio" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-start gap-2.5 text-[13px]">
                <Icon className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* Desktop inline CTA */}
        {user && !isActive && (
          <div className="hidden lg:block">
            <Button size="lg" onClick={setActive} disabled={upsert.isPending} className="w-full">
              {ctaLabel}
            </Button>
          </div>
        )}
      </MobilePage>

      {/* Mobile sticky CTA */}
      {user && (
        <StickyActionBar>
          <Button
            size="lg"
            className="w-full"
            onClick={isActive ? undefined : setActive}
            disabled={upsert.isPending}
            asChild={isActive}
          >
            {isActive ? <Link to={`/lesson/${lessons[0]?.id || ""}`}>Continue learning</Link> : <span>{ctaLabel}</span>}
          </Button>
        </StickyActionBar>
      )}
    </AppLayout>
  );
}
