import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MediaUploader } from "./MediaUploader";
import { CurriculumBuilder } from "./CurriculumBuilder";
import { ServiceDetailsForm } from "./ServiceDetailsForm";
import type { ContentKind, ContentItem } from "@/hooks/useContent";

interface Props {
  kind: ContentKind;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: ContentItem | null;
}

const empty = (kind: ContentKind): Partial<ContentItem> => ({
  kind,
  title: "",
  slug: "",
  summary: "",
  description_md: "",
  cover_url: "",
  price: 0,
  original_price: null,
  currency: "BDT",
  is_free: false,
  category: "",
  tags: [],
  level: "beginner",
  language: "en",
  duration_min: 0,
  status: "draft",
  is_featured: false,
  display_order: 0,
});

export function ContentEditorSheet({ kind, open, onOpenChange, editing }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<ContentItem>>(empty(kind));
  const [tab, setTab] = useState("overview");
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setForm(editing);
      setSavedId(editing.id);
    } else {
      setForm(empty(kind));
      setSavedId(null);
    }
    setTab("overview");
  }, [editing, kind, open]);

  const save = useMutation({
    mutationFn: async () => {
      if (!form.title || !form.slug) throw new Error("Title and slug are required");
      const payload = {
        ...form,
        kind,
        price: Number(form.price ?? 0),
        original_price: form.original_price ? Number(form.original_price) : null,
        duration_min: Number(form.duration_min ?? 0),
        display_order: Number(form.display_order ?? 0),
        published_at:
          form.status === "published" && !(form as any).published_at
            ? new Date().toISOString()
            : (form as any).published_at,
      };
      if (savedId) {
        const { error } = await supabase.from("content_items").update(payload).eq("id", savedId);
        if (error) throw error;
        return savedId;
      } else {
        const { data, error } = await supabase
          .from("content_items")
          .insert(payload as any)
          .select("id")
          .single();
        if (error) throw error;
        return data.id as string;
      }
    },
    onSuccess: (id) => {
      toast.success("Saved");
      setSavedId(id);
      qc.invalidateQueries({ queryKey: ["content_items"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const kindLabel = kind === "digital" ? "digital product" : kind;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="capitalize">
            {editing ? `Edit ${kindLabel}` : `New ${kindLabel}`}
          </SheetTitle>
          <SheetDescription>Save first to unlock media, curriculum, and service tabs.</SheetDescription>
        </SheetHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="media" disabled={!savedId}>
              Media
            </TabsTrigger>
            {kind === "course" && (
              <TabsTrigger value="curriculum" disabled={!savedId}>
                Curriculum
              </TabsTrigger>
            )}
            {kind === "service" && (
              <TabsTrigger value="service" disabled={!savedId}>
                Service
              </TabsTrigger>
            )}
            <TabsTrigger value="publishing">Publishing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3 mt-4">
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                    slug:
                      form.slug ||
                      e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input
                value={form.slug ?? ""}
                onChange={(e) =>
                  setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Short summary</Label>
              <Textarea
                rows={2}
                value={form.summary ?? ""}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Full description (Markdown)</Label>
              <Textarea
                rows={6}
                value={form.description_md ?? ""}
                onChange={(e) => setForm({ ...form, description_md: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input
                  value={form.category ?? ""}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Level</Label>
                <Select
                  value={form.level ?? "beginner"}
                  onValueChange={(v) => setForm({ ...form, level: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all-levels">All levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Price (BDT)</Label>
                <Input
                  type="number"
                  value={form.price ?? 0}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Compare-at</Label>
                <Input
                  type="number"
                  value={form.original_price ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      original_price: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={form.duration_min ?? 0}
                  onChange={(e) => setForm({ ...form, duration_min: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={!!form.is_free}
                  onCheckedChange={(v) => setForm({ ...form, is_free: v })}
                />
                Free for everyone
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={!!form.is_featured}
                  onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
                />
                Featured
              </label>
            </div>
            <div className="space-y-1.5">
              <Label>Cover image URL</Label>
              {form.cover_url && (
                <img
                  src={form.cover_url}
                  alt=""
                  className="h-32 w-full object-cover rounded-lg"
                />
              )}
              <Input
                value={form.cover_url ?? ""}
                onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                placeholder="Paste image URL or upload in Media tab after saving"
              />
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Files marked as preview are visible to everyone; the rest unlock for buyers (or free users if the item is marked free).
              </p>
              {savedId && <MediaUploader itemId={savedId} bucket="media" />}
            </div>
          </TabsContent>

          {kind === "course" && (
            <TabsContent value="curriculum" className="mt-4">
              {savedId && <CurriculumBuilder itemId={savedId} />}
            </TabsContent>
          )}

          {kind === "service" && (
            <TabsContent value="service" className="mt-4">
              {savedId && <ServiceDetailsForm itemId={savedId} />}
            </TabsContent>
          )}

          <TabsContent value="publishing" className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status ?? "draft"}
                onValueChange={(v: any) => setForm({ ...form, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Display order</Label>
              <Input
                type="number"
                value={form.display_order ?? 0}
                onChange={(e) =>
                  setForm({ ...form, display_order: Number(e.target.value) || 0 })
                }
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="sticky bottom-0 bg-background/95 backdrop-blur pt-4 pb-2 mt-4 border-t border-border/40">
          <Button
            onClick={() => save.mutate()}
            variant="premium"
            className="w-full"
            disabled={save.isPending}
          >
            {save.isPending ? "Saving…" : savedId ? "Save changes" : "Create"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
