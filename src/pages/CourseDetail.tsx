import { Navigate, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { useContentItem } from "@/hooks/useContent";
import { CourseBreadcrumb } from "@/components/course-detail/CourseBreadcrumb";
import { CourseVideoCard } from "@/components/course-detail/CourseVideoCard";
import { CourseMetaRow } from "@/components/course-detail/CourseMetaRow";
import { CourseDescription } from "@/components/course-detail/CourseDescription";
import { CourseProgressCard } from "@/components/course-detail/CourseProgressCard";
import { buildCourseDetail } from "@/data/courseDetails";
import { resolveContentRoute } from "@/lib/contentRouting";

export default function CourseDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: item, isLoading } = useContentItem(slug);

  // Guard: /courses/:slug must only render courses. If the slug resolves to
  // a service or digital download, bounce to its canonical route.
  const redirectTo = resolveContentRoute("course", item?.kind, slug);
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  const detail = buildCourseDetail({
    title: item?.title,
    description: item?.description_md
      ? item.description_md.split(/\n\n+/).filter(Boolean)
      : undefined,
    videoPoster: item?.cover_url ?? undefined,
    duration: item?.duration_min ? `${Math.max(1, Math.round(item.duration_min / 60))} hrs` : undefined,
  });

  return (
    <AppLayout>
      <SEO title={`${detail.title} — ASIKON Courses`} description={detail.description[0]} />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <CourseBreadcrumb
            items={[
              { label: "Our Courses", to: "/learn" },
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
      </div>
    </AppLayout>
  );
}
