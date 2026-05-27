import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, Search, Star } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/transitions/Reveal";
import { useContentItems, type ContentItem, type ContentKind } from "@/hooks/useContent";
import { ContentEditorSheet } from "./ContentEditorSheet";

interface Props {
  kind: ContentKind;
  newLabel: string;
}

export function ContentTable({ kind, newLabel }: Props) {
  const qc = useQueryClient();
  const { data: items = [] } = useContentItems({ kind, admin: true, limit: 500 });
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);

  const filtered = useMemo(() => {
    let list = items;
    if (status !== "all") list = list.filter((i) => i.status === status);
    if (q.trim()) {
      const n = q.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(n) ||
          i.slug.toLowerCase().includes(n) ||
          (i.category ?? "").toLowerCase().includes(n)
      );
    }
    return list;
  }, [items, q, status]);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["content_items"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase
        .from("content_items")
        .update({ is_featured: value })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["content_items"] }),
  });

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (i: ContentItem) => {
    setEditing(i);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <Reveal className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px] sm:max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, slug, category…"
            className="pl-9 bg-background/60"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 bg-background/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={openNew} variant="premium" size="sm" className="ml-auto">
          <Plus className="h-4 w-4 mr-1.5" /> {newLabel}
        </Button>
      </Reveal>

      <Reveal className="md:hidden space-y-2">
        {filtered.length === 0 && (
          <p className="text-center py-8 text-muted-foreground text-sm">Nothing here yet.</p>
        )}
        {filtered.map((i) => (
          <div key={i.id} className="glass rounded-2xl p-3 flex gap-3">
            {i.cover_url ? (
              <img src={i.cover_url} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-muted shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{i.title}</div>
              <div className="text-[11px] text-muted-foreground truncate">{i.slug}</div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <Badge variant={i.status === "published" ? "default" : "outline"} className="text-[10px]">
                  {i.status}
                </Badge>
                <span className="font-semibold">{i.is_free ? "Free" : `৳${i.price}`}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <button
                onClick={() => toggleFeatured.mutate({ id: i.id, value: !i.is_featured })}
                className="p-1"
              >
                <Star
                  className={`h-4 w-4 ${i.is_featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                />
              </button>
              <div className="flex gap-0.5">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(i)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => confirm("Delete this item?") && remove.mutate(i.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Reveal>

      <Reveal className="hidden md:block">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Item</th>
                  <th className="text-left font-semibold px-4 py-3">Price</th>
                  <th className="text-left font-semibold px-4 py-3">Status</th>
                  <th className="text-left font-semibold px-4 py-3">Featured</th>
                  <th className="text-right font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      Nothing here yet.
                    </td>
                  </tr>
                )}
                {filtered.map((i) => (
                  <tr key={i.id} className="border-t border-border/40 hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        {i.cover_url ? (
                          <img src={i.cover_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-muted" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[280px]">{i.title}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{i.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">{i.is_free ? "Free" : `৳${i.price}`}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={i.status === "published" ? "default" : "outline"} className="text-[10px]">
                        {i.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => toggleFeatured.mutate({ id: i.id, value: !i.is_featured })}
                      >
                        <Star
                          className={`h-4 w-4 ${i.is_featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="inline-flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(i)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => confirm("Delete this item?") && remove.mutate(i.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <ContentEditorSheet kind={kind} open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
