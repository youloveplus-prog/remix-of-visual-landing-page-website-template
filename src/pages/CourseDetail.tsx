import { Navigate, useParams } from "react-router-dom";
import { Search, Sparkles, Users, MessageCircle, BookmarkPlus } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useContentItem } from "@/hooks/useContent";
import { CourseVideoCard } from "@/components/course-detail/CourseVideoCard";
import { CourseMetaRow } from "@/components/course-detail/CourseMetaRow";
import { CourseDescription } from "@/components/course-detail/CourseDescription";
import { CourseProgressCard } from "@/components/course-detail/CourseProgressCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CrossLinkChips } from "@/components/connect/CrossLinkChips";
import { RelatedRail } from "@/components/connect/RelatedRail";
import { useRecommendations } from "@/hooks/useRecommendations";
import { buildCourseDetail } from "@/data/courseDetails";
import { resolveContentRoute } from "@/lib/contentRouting";
import { useKindMismatchTelemetry } from "@/lib/useKindMismatchTelemetry";

export default function CourseDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: item, isLoading } = useContentItem(slug);

  // Guard: /courses/:slug must only render courses. If the slug resolves to
  // a service or digital download, bounce to its canonical route.
  const redirectTo = resolveContentRoute("course", item?.kind, slug);
  useKindMismatchTelemetry("course", redirectTo, item?.kind, slug);
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  const detail = buildCourseDetail({
    title: item?.title,
    description: item?.description_md
      ? item.description_md.split(/\n\n+/).filter(Boolean)
      : undefined,
    videoPoster: item?.cover_url ?? undefined,
    duration: item?.duration_min ? `${Math.max(1, Math.round(item.duration_min / 60))} hrs` : undefined,
  });

  const { items: related, isLoading: relatedLoading } = useRecommendations({ kind: "course", slug });
  const topicQuery = encodeURIComponent(detail.title);

  return (
    <AppLayout>
      <SEO title={`${detail.title} — ASIKON Courses`} description={detail.description[0]} />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <Breadcrumbs
            eyebrow="Course"
            items={[
              { label: "Learn", to: "/learn" },
              { label: "All Courses", to: "/courses" },
              { label: detail.title },
            ]}
          />
          <button
            aria-label="Search"
            className="w-10 h-10 grid place-items-center rounded-full surface-panel hover:bg-muted transition-colors shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          <div className="space-y-5 min-w-0">
            <CourseVideoCard poster={detail.videoPoster} title={detail.title} resumeKey={slug} />
            <CourseMetaRow
              instructorName={detail.instructorName}
              instructorHandle={detail.instructorHandle}
              instructorAvatar={detail.instructorAvatar}
              rating={detail.rating}
              duration={detail.duration}
              lessons={detail.lessons}
            />
            <CourseDescription title={detail.title} paragraphs={detail.description} />

            <CrossLinkChips
              eyebrow="Keep going"
              links={[
                { label: "Ask AI Tutor about this", to: `/ai-tutor?topic=${topicQuery}`, icon: Sparkles },
                { label: "Book a mentor", to: "/mentors", icon: Users },
                { label: "Discuss in Community", to: "/community", icon: MessageCircle },
                { label: "Save to Library", to: "/library", icon: BookmarkPlus },
              ]}
            />

            {isLoading && (
              <p className="text-xs text-muted-foreground">Loading latest course data…</p>
            )}
          </div>

          <CourseProgressCard
            completed={detail.progress.completed}
            total={detail.progress.total}
            items={detail.progress.items}
          />
        </div>

        <RelatedRail
          eyebrow="You may also like"
          title="Continue your journey"
          items={related}
          isLoading={relatedLoading}
          viewAllHref="/courses"
          viewAllLabel="Browse all courses"
        />
      </div>
    </AppLayout>
  );
}
