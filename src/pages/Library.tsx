import { Link } from "react-router-dom";
import { useMyPurchases } from "@/hooks/useContent";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";

export default function Library() {
  const { data = [], isLoading } = useMyPurchases();

  return (
    <AppLayout>
      <SEO title="My Library — ASIKON" description="Your purchased and unlocked content." />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <SectionHeader eyebrow="Yours" title="My Library" subtitle="Everything you've unlocked, in one place." />

        {isLoading ? (
          <p className="text-center py-10 text-muted-foreground text-sm">Loading…</p>
        ) : data.length === 0 ? (
          <div className="glass rounded-2xl py-16 text-center text-muted-foreground">
            Nothing unlocked yet. Browse <Link to="/courses" className="text-primary underline">courses</Link>,{" "}
            <Link to="/digital" className="text-primary underline">digital products</Link>, or{" "}
            <Link to="/services" className="text-primary underline">services</Link>.
          </div>
        ) : (
          <Reveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((p: any) => {
              const i = p.content_items;
              if (!i) return null;
              return (
                <Link
                  key={p.item_id}
                  to={`/content/${i.slug}`}
                  className="glass rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform"
                >
                  {i.cover_url ? (
                    <img src={i.cover_url} alt={i.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-primary/30 to-primary/10" />
                  )}
                  <div className="p-4 space-y-1">
                    <Badge variant="outline" className="text-[10px] capitalize">{i.kind}</Badge>
                    <h3 className="font-semibold leading-tight line-clamp-2">{i.title}</h3>
                  </div>
                </Link>
              );
            })}
          </Reveal>
        )}
      </div>
    </AppLayout>
  );
}
