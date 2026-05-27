import { Link } from "react-router-dom";
import { useContentItems, type ContentKind } from "@/hooks/useContent";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";

const META: Record<ContentKind, { title: string; subtitle: string; eyebrow: string }> = {
  digital: { title: "Digital Products", subtitle: "Downloadable templates, ebooks, source files & more.", eyebrow: "Shop" },
  course:  { title: "Courses", subtitle: "Structured multi-module learning paths.", eyebrow: "Learn" },
  service: { title: "Services", subtitle: "Done-for-you packages and 1-on-1 sessions.", eyebrow: "Hire" },
};

export function ContentList({ kind }: { kind: ContentKind }) {
  const { data: items = [], isLoading } = useContentItems({ kind, limit: 100 });
  const m = META[kind];

  return (
    <AppLayout>
      <SEO title={`${m.title} — ASIKON`} description={m.subtitle} />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <SectionHeader eyebrow={m.eyebrow} title={m.title} subtitle={m.subtitle} />

        {isLoading ? (
          <p className="text-center py-10 text-muted-foreground text-sm">Loading…</p>
        ) : items.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center text-muted-foreground">
            Nothing published yet. Check back soon.
          </div>
        ) : (
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((i) => (
              <Link
                key={i.id}
                to={`/content/${i.slug}`}
                className="glass rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform"
              >
                {i.cover_url ? (
                  <img src={i.cover_url} alt={i.title} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-primary/30 to-primary/10" />
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    {i.level && <Badge variant="secondary" className="text-[10px]">{i.level}</Badge>}
                    {i.is_featured && <Badge className="text-[10px]">Featured</Badge>}
                  </div>
                  <h3 className="font-semibold leading-tight line-clamp-2">{i.title}</h3>
                  {i.summary && <p className="text-xs text-muted-foreground line-clamp-2">{i.summary}</p>}
                  <div className="pt-1 font-bold">
                    {i.is_free ? "Free" : `৳${i.price}`}
                    {i.original_price && (
                      <span className="ml-2 text-xs text-muted-foreground line-through font-normal">
                        ৳{i.original_price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </Reveal>
        )}
      </div>
    </AppLayout>
  );
}

export default function DigitalList() {
  return <ContentList kind="digital" />;
}
