import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useContentItem, useMyPurchases, getSignedAssetUrl } from "@/hooks/useContent";
import { useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/transitions/Reveal";
import { SEO } from "@/components/SEO";
import { Lock, Play, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function ContentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: item, isLoading } = useContentItem(slug ?? "");
  const { data: purchases = [] } = useMyPurchases();

  const owned = !!item && (item.is_free || purchases.some((p: any) => p.item_id === item.id));

  const { data: assets = [] } = useQuery({
    queryKey: ["content_assets_public", item?.id],
    enabled: !!item?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("content_assets")
        .select("*")
        .eq("item_id", item!.id)
        .is("lesson_id", null)
        .order("position");
      return data ?? [];
    },
  });

  const { data: modules = [] } = useQuery({
    queryKey: ["course_modules_public", item?.id],
    enabled: !!item && item.kind === "course",
    queryFn: async () => {
      const { data: mods } = await supabase
        .from("course_modules")
        .select("*, course_lessons(*)")
        .eq("item_id", item!.id)
        .order("position");
      return data_sort(mods ?? []);
    },
  });

  const getOrPurchase = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!item) return;
    if (item.is_free) {
      const { error } = await supabase.from("content_purchases").insert({
        user_id: user.id,
        item_id: item.id,
      });
      if (error && !error.message.includes("duplicate")) toast.error(error.message);
      else toast.success("Unlocked! Find it in your Library.");
      return;
    }
    // Paid — go to cart/checkout flow with a content marker
    toast.info("Checkout for paid content coming soon.");
  };

  const openAsset = async (assetId: string, isPreview: boolean) => {
    if (!owned && !isPreview) {
      toast.error("Purchase to access this file.");
      return;
    }
    try {
      const url = await getSignedAssetUrl(assetId);
      window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) return <AppLayout><div className="p-10 text-center text-muted-foreground">Loading…</div></AppLayout>;
  if (!item) return <AppLayout><div className="p-10 text-center">Not found.</div></AppLayout>;

  return (
    <AppLayout>
      <SEO title={`${item.title} — ASIKON`} description={item.summary ?? undefined} />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <Reveal>
          {item.cover_url && (
            <img src={item.cover_url} alt={item.title} className="w-full h-56 sm:h-80 object-cover rounded-2xl" />
          )}
        </Reveal>
        <Reveal className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">{item.kind}</Badge>
            {item.level && <Badge variant="secondary">{item.level}</Badge>}
            {item.is_featured && <Badge>Featured</Badge>}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">{item.title}</h1>
          {item.summary && <p className="text-muted-foreground text-lg">{item.summary}</p>}
          <div className="flex items-center gap-4 pt-2">
            <div className="text-2xl font-bold">
              {item.is_free ? "Free" : `৳${item.price}`}
              {item.original_price && (
                <span className="ml-2 text-base text-muted-foreground line-through">৳{item.original_price}</span>
              )}
            </div>
            <Button onClick={getOrPurchase} variant="premium" size="lg" disabled={owned}>
              {owned ? "Owned — Open in Library" : item.is_free ? "Get free access" : "Purchase"}
            </Button>
          </div>
        </Reveal>

        {item.description_md && (
          <Reveal className="glass rounded-2xl p-5 whitespace-pre-wrap text-sm leading-relaxed">
            {item.description_md}
          </Reveal>
        )}

        {assets.length > 0 && (
          <Reveal className="space-y-3">
            <h2 className="font-display text-xl font-semibold">Files</h2>
            <ul className="space-y-2">
              {assets.map((a: any) => (
                <li
                  key={a.id}
                  className="glass rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => openAsset(a.id, a.is_preview)}
                >
                  {a.kind === "video" ? <Play className="h-4 w-4 text-primary" /> :
                   a.kind === "pdf" ? <FileText className="h-4 w-4 text-primary" /> :
                   <Download className="h-4 w-4 text-primary" />}
                  <span className="flex-1 text-sm">{a.title ?? a.kind}</span>
                  {!owned && !a.is_preview && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                  {a.is_preview && <Badge variant="outline" className="text-[10px]">Preview</Badge>}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {item.kind === "course" && modules.length > 0 && (
          <Reveal className="space-y-3">
            <h2 className="font-display text-xl font-semibold">Curriculum</h2>
            {modules.map((m: any) => (
              <div key={m.id} className="glass rounded-2xl p-4 space-y-2">
                <div className="font-semibold">{m.title}</div>
                {m.summary && <p className="text-xs text-muted-foreground">{m.summary}</p>}
                <ul className="space-y-1">
                  {(m.course_lessons ?? []).sort((a: any, b: any) => a.position - b.position).map((l: any) => (
                    <li key={l.id} className="flex items-center gap-2 text-sm py-1.5 border-t border-border/30">
                      <Play className="h-3.5 w-3.5 text-primary" />
                      <span className="flex-1">{l.title}</span>
                      <span className="text-xs text-muted-foreground">{l.duration_min} min</span>
                      {l.is_preview && <Badge variant="outline" className="text-[10px]">Preview</Badge>}
                      {!owned && !l.is_preview && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </AppLayout>
  );
}

function data_sort(arr: any[]) {
  return [...arr].sort((a, b) => a.position - b.position);
}
