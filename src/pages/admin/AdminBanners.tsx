import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowDown, ArrowUp, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type Kind = "hero" | "offer";

interface Banner {
  id: string;
  kind: Kind;
  image_url: string;
  link_url: string | null;
  alt_text: string | null;
  display_order: number;
  is_active: boolean;
}

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function BannerManager({ kind }: { kind: Kind }) {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ image_url: "", link_url: "", alt_text: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-home-banners", kind],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("home_banners")
        .select("*")
        .eq("kind", kind)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Banner[];
    },
  });

  const invalidate = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ["admin-home-banners", kind] }),
      qc.invalidateQueries({ queryKey: ["home-banners", kind] }),
    ]);

  const create = useMutation({
    mutationFn: async () => {
      if (!form.image_url) throw new Error("Image is required");
      const nextOrder = (data?.length ?? 0);
      const { error } = await (supabase as any).from("home_banners").insert({
        kind,
        image_url: form.image_url,
        link_url: form.link_url || null,
        alt_text: form.alt_text || null,
        display_order: nextOrder,
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      await invalidate();
      setForm({ image_url: "", link_url: "", alt_text: "" });
      toast.success("Banner added");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<Banner> & { id: string }) => {
      const { id, ...rest } = patch;
      const { error } = await (supabase as any).from("home_banners").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("home_banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await invalidate();
      toast.success("Banner removed");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleFile = async (file: File) => {
    if (!ALLOWED.includes(file.type)) {
      toast.error("Use JPG, PNG, WEBP, or GIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Max 5 MB.");
      return;
    }
    const ext = file.name.split(".").pop() ?? "jpg";
    setUploading(true);
    try {
      const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("home-banners").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("home-banners").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: pub.publicUrl }));
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const move = (b: Banner, dir: -1 | 1) => {
    if (!data) return;
    const idx = data.findIndex((x) => x.id === b.id);
    const swap = data[idx + dir];
    if (!swap) return;
    update.mutate({ id: b.id, display_order: swap.display_order });
    update.mutate({ id: swap.id, display_order: b.display_order });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 p-4 space-y-3 liquid-glass">
        <h3 className="font-semibold">
          Add new {kind === "hero" ? "Hero" : "Offer"} banner
        </h3>

        <div className="grid gap-3">
          <div>
            <Label>Image</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={form.image_url}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                placeholder="Paste URL or upload…"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-1" />
                {uploading ? "Uploading…" : "Upload"}
              </Button>
            </div>
            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className={`mt-2 rounded-xl border border-border/60 object-cover ${
                  kind === "hero" ? "w-full aspect-[21/10]" : "w-32 h-32"
                }`}
              />
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: {kind === "hero" ? "1200×570 (21:10)" : "600×600 (square)"} · JPG/PNG/WEBP.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Link URL (optional)</Label>
              <Input
                value={form.link_url}
                onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
                placeholder="/shop?filter=deals"
              />
            </div>
            <div>
              <Label>Alt text (accessibility)</Label>
              <Input
                value={form.alt_text}
                onChange={(e) => setForm((f) => ({ ...f, alt_text: e.target.value }))}
                placeholder="Skill-Up Friday 50% off"
              />
            </div>
          </div>

          <div>
            <Button onClick={() => create.mutate()} disabled={create.isPending || !form.image_url}>
              {create.isPending ? "Adding…" : "Add banner"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Existing {kind} banners</h3>
        {isLoading ? (
          <div className="grid gap-3">
            {[0, 1].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No banners yet.</p>
        ) : (
          <div className="grid gap-3">
            {data!.map((b, i) => (
              <div
                key={b.id}
                className="rounded-2xl border border-border/60 p-3 flex items-center gap-3 liquid-glass"
              >
                <img
                  src={b.image_url}
                  alt={b.alt_text ?? ""}
                  className={`rounded-xl object-cover shrink-0 border border-border/40 ${
                    kind === "hero" ? "w-32 aspect-[21/10]" : "w-20 h-20"
                  }`}
                />
                <div className="flex-1 min-w-0 text-sm">
                  <div className="font-medium truncate">{b.alt_text || "(no alt)"}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {b.link_url || "No link"}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Order: {b.display_order}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={i === 0}
                      onClick={() => move(b, -1)}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={i === (data!.length - 1)}
                      onClick={() => move(b, 1)}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Switch
                      checked={b.is_active}
                      onCheckedChange={(v) => update.mutate({ id: b.id, is_active: v })}
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {b.is_active ? "Live" : "Hidden"}
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive"
                    onClick={() => {
                      if (confirm("Delete this banner?")) remove.mutate(b.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { PromotionsManager } from "@/components/admin/PromotionsManager";

export default function AdminBanners() {
  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Marketing"
        title="Banners & Promotions"
        subtitle="Upload home sliders, offer cards, and scheduled promo content across the app."
      />
      <Tabs defaultValue="promotions">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="hero">Hero slider</TabsTrigger>
          <TabsTrigger value="offer">Offer cards</TabsTrigger>
        </TabsList>
        <TabsContent value="promotions" className="mt-4">
          <PromotionsManager />
        </TabsContent>
        <TabsContent value="hero" className="mt-4">
          <BannerManager kind="hero" />
        </TabsContent>
        <TabsContent value="offer" className="mt-4">
          <BannerManager kind="offer" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
