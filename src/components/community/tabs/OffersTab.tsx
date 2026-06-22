import { useEffect, useState } from "react";
import { Loader2, Tag, Clock, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Promotion {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  cta_label: string | null;
  cta_url: string | null;
  ends_at: string | null;
  starts_at: string | null;
}

function timeLeft(ends_at: string | null) {
  if (!ends_at) return null;
  const ms = new Date(ends_at).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const days = Math.floor(ms / 86400000);
  const hrs = Math.floor((ms % 86400000) / 3600000);
  if (days > 0) return `${days}d ${hrs}h left`;
  const mins = Math.floor((ms % 3600000) / 60000);
  return `${hrs}h ${mins}m left`;
}

export function OffersTab() {
  const [offers, setOffers] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const nowIso = new Date().toISOString();
      const { data } = await supabase
        .from("promotions")
        .select("id,title,subtitle,image_url,cta_label,cta_url,ends_at,starts_at")
        .eq("is_active", true)
        .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
        .order("position", { ascending: true });
      setOffers((data as Promotion[]) ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="px-4 py-16 text-center space-y-3">
        <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center">
          <Tag className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold">No active offers</h3>
        <p className="text-sm text-muted-foreground">Check back soon for fresh deals.</p>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-4">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        <h2 className="font-display text-lg font-semibold">Current offers</h2>
        <Badge variant="secondary" className="ml-auto">{offers.length}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {offers.map((o) => {
          const tl = timeLeft(o.ends_at);
          const cta = o.cta_url ?? "/shop";
          const isExternal = /^https?:\/\//.test(cta);
          return (
            <article
              key={o.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <img
                  src={o.image_url}
                  alt={o.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {tl && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-background/85 backdrop-blur px-2 py-1 text-[11px] font-medium">
                    <Clock className="h-3 w-3" /> {tl}
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-display font-semibold leading-tight line-clamp-2">{o.title}</h3>
                {o.subtitle && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{o.subtitle}</p>
                )}
                <Button asChild size="sm" className="w-full mt-2">
                  {isExternal ? (
                    <a href={cta} target="_blank" rel="noopener noreferrer">
                      {o.cta_label ?? "View offer"} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <Link to={cta}>{o.cta_label ?? "View offer"}</Link>
                  )}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
