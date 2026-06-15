import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useContentItems, type ContentKind } from "@/hooks/useContent";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

const META: Record<ContentKind, { title: string; subtitle: string; eyebrow: string; placeholder: string }> = {
  digital: { title: "Digital Products", subtitle: "Downloadable templates, ebooks, source files & more.", eyebrow: "Shop", placeholder: "Search digital products..." },
  course:  { title: "Courses", subtitle: "Structured multi-module learning paths.", eyebrow: "Learn", placeholder: "Search courses..." },
  service: { title: "Services", subtitle: "Done-for-you packages and 1-on-1 sessions.", eyebrow: "Hire", placeholder: "Search services..." },
};

export function ContentList({ kind }: { kind: ContentKind }) {
  const { data: items = [], isLoading } = useContentItems({ kind, limit: 100 });
  const m = META[kind];
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((i) =>
      [i.title, i.summary ?? "", (i.tags ?? []).join(" "), i.category ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(t)
    );
  }, [items, q]);

  return (
    <AppLayout>
      <SEO title={`${m.title} — ASIKON`} description={m.subtitle} />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <SectionHeader eyebrow={m.eyebrow} title={m.title} subtitle={m.subtitle} />

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={m.placeholder}
            className="pl-10 pr-10 h-10 bg-secondary border-border focus:border-primary"
          />
          {q && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7" onClick={() => setQ("")}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-center py-10 text-muted-foreground text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center text-muted-foreground">
            {q ? `No results for "${q}".` : "Nothing published yet. Check back soon."}
          </div>
        ) : (
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((i) => (
              <Link
                key={i.id}
                to={kind === "course" ? `/courses/${i.slug}` : `/content/${i.slug}`}
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
