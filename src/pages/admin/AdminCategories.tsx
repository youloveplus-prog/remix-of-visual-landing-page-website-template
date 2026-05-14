import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";

export default function AdminCategories() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", slug: "", icon: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { data } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, icon, display_order")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!form.name || !form.slug) throw new Error("Name and slug required");
      const { error } = await supabase.from("categories").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category created");
      setForm({ name: "", slug: "", icon: "" });
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateName = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("categories").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Renamed");
      setEditId(null);
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: async ({ id, dir }: { id: string; dir: "up" | "down" }) => {
      const list = data ?? [];
      const idx = list.findIndex((c: any) => c.id === id);
      const swap = dir === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= list.length) return;
      const a = list[idx];
      const b = list[swap];
      await supabase.from("categories").update({ display_order: b.display_order }).eq("id", a.id);
      await supabase.from("categories").update({ display_order: a.display_order }).eq("id", b.id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Catalog"
        title="Categories"
        subtitle="Top-level navigation buckets used across the shop."
      />

      <Reveal>
        <div className="glass rounded-2xl p-4 grid sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-background/60" />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value.replace(/\s+/g, "-").toLowerCase() })}
              className="bg-background/60"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Icon (emoji)</Label>
            <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="bg-background/60" />
          </div>
          <Button variant="premium" onClick={() => create.mutate()} disabled={create.isPending}>
            <Plus className="h-4 w-4 mr-1.5" /> Add
          </Button>
        </div>
      </Reveal>

      <Reveal>
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-4 py-3 w-16">Order</th>
                <th className="text-left font-semibold px-4 py-3 w-12">Icon</th>
                <th className="text-left font-semibold px-4 py-3">Name</th>
                <th className="text-left font-semibold px-4 py-3">Slug</th>
                <th className="text-right font-semibold px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).length === 0 && (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No categories yet.</td></tr>
              )}
              {(data ?? []).map((c: any, i: number) => (
                <tr key={c.id} className="border-t border-border/40 hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="inline-flex flex-col">
                      <button className="pressable hover:text-primary disabled:opacity-30" disabled={i === 0} onClick={() => reorder.mutate({ id: c.id, dir: "up" })}>
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button className="pressable hover:text-primary disabled:opacity-30" disabled={i === (data ?? []).length - 1} onClick={() => reorder.mutate({ id: c.id, dir: "down" })}>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-lg">{c.icon}</td>
                  <td className="px-4 py-2.5">
                    {editId === c.id ? (
                      <div className="flex gap-1.5">
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8" autoFocus />
                        <Button size="sm" onClick={() => updateName.mutate({ id: c.id, name: editName })}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>×</Button>
                      </div>
                    ) : (
                      <button className="hover:text-primary" onClick={() => { setEditId(c.id); setEditName(c.name); }}>{c.name}</button>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{c.slug}</td>
                  <td className="px-4 py-2.5 text-right">
                    <Button size="icon" variant="ghost" onClick={() => remove.mutate(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}
