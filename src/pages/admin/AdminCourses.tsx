import { SectionHeader } from "@/components/ui/section-header";
import { ContentTable } from "@/components/admin/content/ContentTable";

export default function AdminCourses() {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Library"
        title="Courses"
        subtitle="Build multi-module courses with video lessons, notes, and previews."
      />
      <ContentTable kind="course" newLabel="New course" />
    </div>
  );
}
