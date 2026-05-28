import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp, Trash2, Upload, ExternalLink } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAuditLog } from "@/hooks/useAuditLog";

type Placement = "home_hero" | "home_strip" | "shop_banner" | "community_banner";

const PLACEMENT_LABEL: Record<Placement, string> = {
  home_hero: "Home — Hero",
  home_strip: "Home — Promo strip",
  shop_banner: "Shop — Banner",
  community_banner: "Community — Banner",
};

interface Promotion {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  cta_label: string | null;
  cta_url: string | null;
  placement: Placement;
  position: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const empty = {
  title: "",
  subtitle: "",
  image_url: "",
  cta_label: "",
  cta_url: "",
  placement: "home_strip" as Placement,
  starts_at: "",
  ends_at: "",
};

export function PromotionsManager() {
  const qc = useQueryClient();
  const audit = useAuditLog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(empty);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-promotions"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("promotions")
        .select("*")
        .order("placement", { ascending: true })
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Promotion[];
    },
  });

  const invalidate = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ["admin-promotions"] }),
      qc.invalidateQueries({ queryKey: ["promotions"] }),
    ]);

  const create = useMutation({
    mutationFn: async () => {
      if (!form.title) throw new Error("Title is required");
      if (!form.image_url) throw new Error("Image is required");
      const samePlacement = (data ?? []).filter((p) => p.placement === form.placement);
      const nextOrder = samePlacement.length;
      const { error, data: row } = await (supabase as any)
        .from("promotions")
        .insert({
          title: form.title,
          subtitle: form.subtitle || null,
          image_url: form.image_url,
          cta_label: form.cta_label || null,
          cta_url: form.cta_url || null,
          placement: form.placement,
          position: nextOrder,
          starts_at: form.starts_at || null,
          ends_at: form.ends_at || null,
          is_active: true,
        })
        .select("id")
        .maybeSingle();
      if (error) throw error;
      await audit({
        action: "promotion.create",
        target_type: "promotion",
        target_id: row?.id,
        meta: { placement: form.placement, title: form.title },
      });
    },
    onSuccess: async () => {
      await invalidate();
      setForm(empty);
      toast.success("Promotion published");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<Promotion> & { id: string }) => {
      const { id, ...rest } = patch;
      const { error } = await (supabase as any).from("promotions").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (p: Promotion) => {
      const { error } = await (supabase as any).from("promotions").delete().eq("id", p.id);
      if (error) throw error;
      await audit({
        action: "promotion.delete",
        target_type: "promotion",
        target_id: p.id,
        meta: { placement: p.placement, title: p.title },
      });
    },
    onSuccess: async () => {
      await invalidate();
      toast.success("Promotion removed");
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
      const path = `${form.placement}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("promos").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("promos").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: pub.publicUrl }));
      toast.success("Image uploaded");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const grouped = (data ?? []).reduce<Record<Placement, Promotion[]>>(
    (acc, p) => {
      acc[p.placement] = acc[p.placement] || [];
      acc[p.placement].push(p);
      return acc;
    },
    {} as Record<Placement, Promotion[]>,
  );

  const move = (p: Promotion, dir: -1 | 1) => {
    const group = grouped[p.placement] ?? [];
    const idx = group.findIndex((x) => x.id === p.id);
    const swap = group[idx + dir];
    if (!swap) return;
    update.mutate({ id: p.id, position: swap.position });
    update.mutate({ id: swap.id, position: p.position });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 p-4 space-y-3 bg-card">
        <h3 className="font-semibold">Add new promotion</h3>

        <div className="grid gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="promo-title">Title</Label>
              <Input
                id="promo-title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Skill-Up Friday — 50% off"
              />
            </div>
            <div>
              <Label htmlFor="promo-placement">Placement</Label>
              <Select
                value={form.placement}
                onValueChange={(v) => setForm((f) => ({ ...f, placement: v as Placement }))}
              >
                <SelectTrigger id="promo-placement">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PLACEMENT_LABEL) as Placement[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {PLACEMENT_LABEL[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="promo-subtitle">Subtitle (optional)</Label>
            <Textarea
              id="promo-subtitle"
              rows={2}
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              placeholder="One short line of supporting copy"
            />
          </div>

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
                <Upload className="h-4 w-4 mr-1" aria-hidden />
                {uploading ? "Uploading…" : "Upload"}
              </Button>
            </div>
            {form.image_url && (
              <img
                src={form.image_url}
                alt={form.title || "Promotion preview"}
                className="mt-2 rounded-xl border border-border/60 object-cover w-full aspect-[21/10]"
              />
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 1200×570 (21:10) · JPG / PNG / WEBP, max 5 MB.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="promo-cta-label">CTA label</Label>
              <Input
                id="promo-cta-label"
                value={form.cta_label}
                onChange={(e) => setForm((f) => ({ ...f, cta_label: e.target.value }))}
                placeholder="Shop the sale"
              />
            </div>
            <div>
              <Label htmlFor="promo-cta-url">CTA URL</Label>
              <Input
                id="promo-cta-url"
                value={form.cta_url}
                onChange={(e) => setForm((f) => ({ ...f, cta_url: e.target.value }))}
                placeholder="/shop?filter=sale"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="promo-start">Starts at (optional)</Label>
              <Input
                id="promo-start"
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => setForm((f) => ({ ...f, starts_at: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="promo-end">Ends at (optional)</Label>
              <Input
                id="promo-end"
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) => setForm((f) => ({ ...f, ends_at: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Button
              onClick={() => create.mutate()}
              disabled={create.isPending || !form.title || !form.image_url}
              className="gradient-primary text-primary-foreground"
            >
              {create.isPending ? "Publishing…" : "Publish promotion"}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {isLoading ? (
          <div className="grid gap-3">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No promotions yet.</p>
        ) : (
          (Object.keys(PLACEMENT_LABEL) as Placement[]).map((placement) => {
            const items = grouped[placement] ?? [];
            if (!items.length) return null;
            return (
              <div key={placement} className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">
                  {PLACEMENT_LABEL[placement]}
                </h4>
                <div className="grid gap-2">
                  {items.map((p, i) => (
                    <div
                      key={p.id}
                      className="rounded-2xl border border-border/60 p-3 flex items-center gap-3 bg-card"
                    >
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="rounded-xl object-cover shrink-0 border border-border/40 w-28 aspect-[21/10]"
                      />
                      <div className="flex-1 min-w-0 text-sm">
                        <div className="font-medium truncate">{p.title}</div>
                        {p.subtitle && (
                          <div className="text-xs text-muted-foreground truncate">
                            {p.subtitle}
                          </div>
                        )}
                        {p.cta_url && (
                          <div className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                            <ExternalLink className="h-2.5 w-2.5" aria-hidden />
                            {p.cta_label || "Open"} → {p.cta_url}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            disabled={i === 0}
                            onClick={() => move(p, -1)}
                            aria-label="Move promotion up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            disabled={i === items.length - 1}
                            onClick={() => move(p, 1)}
                            aria-label="Move promotion down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Switch
                            checked={p.is_active}
                            onCheckedChange={(v) => update.mutate({ id: p.id, is_active: v })}
                            aria-label={p.is_active ? "Deactivate promotion" : "Activate promotion"}
                          />
                          <span className="text-[10px] text-muted-foreground">
                            {p.is_active ? "Live" : "Off"}
                          </span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => {
                            if (confirm(`Delete promotion "${p.title}"?`)) remove.mutate(p);
                          }}
                          aria-label="Delete promotion"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PromotionsManager;
