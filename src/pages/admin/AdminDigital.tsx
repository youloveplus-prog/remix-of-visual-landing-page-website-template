import { SectionHeader } from "@/components/ui/section-header";
import { ContentTable } from "@/components/admin/content/ContentTable";

export default function AdminDigital() {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Library"
        title="Digital Products"
        subtitle="Sell downloadable files — ebooks, templates, source files, audio packs."
      />
      <ContentTable kind="digital" newLabel="New digital product" />
    </div>
  );
}
