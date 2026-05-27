import { SectionHeader } from "@/components/ui/section-header";
import { ContentTable } from "@/components/admin/content/ContentTable";

export default function AdminServices() {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Library"
        title="Services"
        subtitle="Bookable sessions or fixed-scope deliverables, fulfilled by your team."
      />
      <ContentTable kind="service" newLabel="New service" />
    </div>
  );
}
