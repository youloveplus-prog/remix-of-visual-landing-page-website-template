import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Clock, Target, Sparkles, Users, MessageCircle, GraduationCap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
import { DetailSection } from "@/components/ui/detail-section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CrossLinkChips } from "@/components/connect/CrossLinkChips";
import { RelatedRail } from "@/components/connect/RelatedRail";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useLesson, useLessonCompletions } from "@/hooks/useTracks";
import { useCompleteLesson } from "@/hooks/useTodayMission";
import { useAuth } from "@/hooks/useAuth";
import { copy } from "@/copy/copy";
import { db } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";

export default function LessonDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: lesson, isLoading } = useLesson(id);
  const { data: done } = useLessonCompletions();
  const complete = useCompleteLesson();

  const { data: trackRow } = useQuery({
    queryKey: ["track_by_id", lesson?.track_id],
    enabled: !!lesson?.track_id,
    queryFn: async () => {
      const { data } = await db.from("tracks").select("slug,name").eq("id", lesson!.track_id).maybeSingle();
      return data as { slug: string; name: string } | null;
    },
  });

  if (isLoading) {
    return (
      <AppLayout>
        <MobilePage maxWidth="reading">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </MobilePage>
      </AppLayout>
    );
  }
  if (!lesson) {
    return (
      <AppLayout>
        <MobilePage maxWidth="reading">
          <div className="py-20 text-center text-muted-foreground">Lesson not found.</div>
        </MobilePage>
      </AppLayout>
    );
  }

  const isDone = done?.has(lesson.id);
  const canComplete = !!user && !isDone;

  return (
    <AppLayout>
      <SEO
        title={lesson?.title ? `${lesson.title} — Lesson` : "Lesson"}
        description="Continue your Asikon learning journey with this lesson."
        type="article"
      />
      <MobilePage maxWidth="reading" spacing="space-y-7" className="pb-sticky-cta lg:pb-6">
        {trackRow && (
          <Link to={`/track/${trackRow.slug}`} className="inline-flex items-center text-[13px] text-muted-foreground hover:text-foreground gap-1 active:opacity-60 transition-opacity">
            <ArrowLeft className="h-3.5 w-3.5" /> {trackRow.name}
          </Link>
        )}

        <PageHero
          title={lesson.title}
          meta={
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {lesson.duration_min} min
            </span>
          }
        />

        {lesson.video_url && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-muted border border-border/40">
            <video controls src={lesson.video_url} className="w-full h-full" />
          </div>
        )}

        {lesson.outcome && (
          <DetailSection divided={false}>
            <div className="flex items-start gap-3 rounded-xl bg-muted/40 border border-border/40 p-4">
              <Target className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-1">{copy.lesson.outcomeLabel}</p>
                <p className="text-[14px] leading-relaxed">{lesson.outcome}</p>
              </div>
            </div>
          </DetailSection>
        )}

        {lesson.content_md ? (
          <DetailSection title="Lesson">
            <div className="prose prose-base dark:prose-invert max-w-[65ch] leading-relaxed prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-pre:rounded-xl prose-pre:bg-muted">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content_md}</ReactMarkdown>
            </div>
          </DetailSection>
        ) : !lesson.video_url ? (
          <p className="text-[14px] text-muted-foreground italic">
            Content for this lesson is being prepared. The mission still counts when you mark it complete below.
          </p>
        ) : null}

        {/* Desktop inline action */}
        <div className="hidden lg:flex items-center gap-3 pt-2">
          {isDone ? (
            <span className="inline-flex items-center gap-2 text-success font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4" /> {copy.lesson.completed}
            </span>
          ) : (
            <Button size="lg" disabled={!canComplete || complete.isPending} onClick={() => complete.mutate(lesson.id)}>
              {complete.isPending ? "Saving…" : copy.lesson.markComplete}
            </Button>
          )}
          {!user && <Link to="/auth" className="text-[13px] text-primary underline">Sign in to track progress</Link>}
        </div>
      </MobilePage>

      {/* Mobile sticky action */}
      <StickyActionBar>
        {isDone ? (
          <div className="flex items-center justify-center gap-2 text-success font-semibold text-sm py-2">
            <CheckCircle2 className="h-4 w-4" /> {copy.lesson.completed}
          </div>
        ) : (
          <Button size="lg" className="w-full" disabled={!canComplete || complete.isPending} onClick={() => complete.mutate(lesson.id)}>
            {complete.isPending ? "Saving…" : copy.lesson.markComplete}
          </Button>
        )}
      </StickyActionBar>
    </AppLayout>
  );
}
