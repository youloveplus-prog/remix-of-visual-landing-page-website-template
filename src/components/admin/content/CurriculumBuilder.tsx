import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { MediaUploader } from "./MediaUploader";
import { toast } from "sonner";

interface Module {
  id: string;
  item_id: string;
  title: string;
  summary: string | null;
  position: number;
}
interface Lesson {
  id: string;
  module_id: string;
  item_id: string;
  title: string;
  content_md: string | null;
  duration_min: number;
  position: number;
  is_preview: boolean;
}

export function CurriculumBuilder({ itemId }: { itemId: string }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: mods } = await supabase
      .from("course_modules")
      .select("*")
      .eq("item_id", itemId)
      .order("position");
    const m = (mods ?? []) as Module[];
    setModules(m);

    if (m.length) {
      const { data: lss } = await supabase
        .from("course_lessons")
        .select("*")
        .in(
          "module_id",
          m.map((x) => x.id)
        )
        .order("position");
      const map: Record<string, Lesson[]> = {};
      for (const l of (lss ?? []) as Lesson[]) {
        (map[l.module_id] ??= []).push(l);
      }
      setLessons(map);
    } else {
      setLessons({});
    }
    setLoading(false);
  };

  useEffect(() => {
    if (itemId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const addModule = async () => {
    const { error } = await supabase.from("course_modules").insert({
      item_id: itemId,
      title: "New module",
      position: modules.length,
    });
    if (error) return toast.error(error.message);
    load();
  };

  const updateModule = async (id: string, patch: Partial<Module>) => {
    const { error } = await supabase.from("course_modules").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };

  const deleteModule = async (id: string) => {
    if (!confirm("Delete this module and all its lessons?")) return;
    await supabase.from("course_modules").delete().eq("id", id);
    load();
  };

  const addLesson = async (moduleId: string) => {
    const count = lessons[moduleId]?.length ?? 0;
    const { error } = await supabase.from("course_lessons").insert({
      module_id: moduleId,
      item_id: itemId,
      title: "New lesson",
      position: count,
    });
    if (error) return toast.error(error.message);
    load();
  };

  const updateLesson = async (id: string, patch: Partial<Lesson>) => {
    const { error } = await supabase.from("course_lessons").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };

  const deleteLesson = async (id: string) => {
    if (!confirm("Delete this lesson?")) return;
    await supabase.from("course_lessons").delete().eq("id", id);
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading curriculum…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Organize the course into modules and lessons. Mark lessons as preview to let visitors sample them.
        </p>
        <Button onClick={addModule} variant="premium" size="sm">
          <Plus className="h-4 w-4 mr-1.5" /> Module
        </Button>
      </div>

      {modules.length === 0 && (
        <div className="glass rounded-2xl py-10 text-center text-sm text-muted-foreground">
          No modules yet — add the first module to get started.
        </div>
      )}

      {modules.map((m) => {
        const isOpen = open[m.id] ?? true;
        return (
          <div key={m.id} className="glass rounded-2xl p-3 space-y-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpen({ ...open, [m.id]: !isOpen })}
                className="p-1 hover:bg-muted/60 rounded"
              >
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              <Input
                defaultValue={m.title}
                className="flex-1 font-medium bg-background/60"
                onBlur={(e) => updateModule(m.id, { title: e.target.value })}
              />
              <Button size="icon" variant="ghost" onClick={() => deleteModule(m.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>

            {isOpen && (
              <div className="pl-7 space-y-3">
                <Textarea
                  defaultValue={m.summary ?? ""}
                  placeholder="Module summary (optional)"
                  rows={2}
                  className="bg-background/60"
                  onBlur={(e) => updateModule(m.id, { summary: e.target.value })}
                />

                {(lessons[m.id] ?? []).map((l) => (
                  <div key={l.id} className="rounded-xl border border-border/40 p-3 space-y-3 bg-background/40">
                    <div className="flex items-center gap-2">
                      <Input
                        defaultValue={l.title}
                        className="flex-1 bg-background/60"
                        onBlur={(e) => updateLesson(l.id, { title: e.target.value })}
                      />
                      <div className="w-24">
                        <Input
                          type="number"
                          defaultValue={l.duration_min}
                          className="bg-background/60"
                          onBlur={(e) =>
                            updateLesson(l.id, { duration_min: Number(e.target.value) || 0 })
                          }
                          title="Duration (min)"
                        />
                      </div>
                      <label className="flex items-center gap-1.5 text-xs whitespace-nowrap">
                        <Switch
                          defaultChecked={l.is_preview}
                          onCheckedChange={(v) => updateLesson(l.id, { is_preview: v })}
                        />
                        Preview
                      </label>
                      <Button size="icon" variant="ghost" onClick={() => deleteLesson(l.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <Textarea
                      defaultValue={l.content_md ?? ""}
                      placeholder="Lesson notes (Markdown)"
                      rows={3}
                      className="bg-background/60"
                      onBlur={(e) => updateLesson(l.id, { content_md: e.target.value })}
                    />
                    <div>
                      <Label className="text-xs mb-1.5 block">Lesson media (videos / pdfs)</Label>
                      <MediaUploader itemId={itemId} lessonId={l.id} bucket="media" />
                    </div>
                  </div>
                ))}

                <Button onClick={() => addLesson(m.id)} variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-1.5" /> Add lesson
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
