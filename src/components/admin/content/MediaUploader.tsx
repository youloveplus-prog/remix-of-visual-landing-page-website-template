import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Trash2, FileVideo, FileImage, FileText, FileArchive, Loader2, Star, StarOff } from "lucide-react";
import { cn } from "@/lib/utils";

type AssetKind = "video" | "image" | "pdf" | "audio" | "zip" | "other";

interface Asset {
  id: string;
  item_id: string;
  lesson_id: string | null;
  kind: AssetKind;
  url: string | null;
  storage_path: string | null;
  mime: string | null;
  size_bytes: number | null;
  position: number;
  is_preview: boolean;
  title: string | null;
}

const ICON: Record<AssetKind, any> = { video: FileVideo, image: FileImage, pdf: FileText, audio: FileText, zip: FileArchive, other: FileText };

function detectKind(file: File): AssetKind {
  const t = file.type;
  if (t.startsWith("video/")) return "video";
  if (t.startsWith("image/")) return "image";
  if (t.startsWith("audio/")) return "audio";
  if (t === "application/pdf") return "pdf";
  if (t.includes("zip")) return "zip";
  return "other";
}

function fmtBytes(n: number | null) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

interface Props {
  itemId: string;
  lessonId?: string | null;
  /** "media" = private content-media bucket. "cover" = public content-covers. */
  bucket?: "media" | "cover";
  className?: string;
}

export function MediaUploader({ itemId, lessonId = null, bucket = "media", className }: Props) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("content_assets")
      .select("*")
      .eq("item_id", itemId)
      .order("position", { ascending: true });
    if (lessonId) q = q.eq("lesson_id", lessonId);
    else q = q.is("lesson_id", null);
    const { data } = await q;
    setAssets((data ?? []) as Asset[]);
    setLoading(false);
  };

  useEffect(() => {
    if (itemId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, lessonId]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setProgress(0);

    const bucketName = bucket === "media" ? "content-media" : "content-covers";
    const totalFiles = files.length;
    let done = 0;

    for (const file of Array.from(files)) {
      const kind = detectKind(file);
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${itemId}/${lessonId ?? "root"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: upErr } = await supabase.storage.from(bucketName).upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });

      if (upErr) {
        toast.error(`Upload failed: ${file.name} — ${upErr.message}`);
        continue;
      }

      let url: string | null = null;
      if (bucket === "cover") {
        url = supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl;
      }

      const { error: insErr } = await supabase.from("content_assets").insert({
        item_id: itemId,
        lesson_id: lessonId,
        kind,
        url,
        storage_path: bucket === "media" ? path : null,
        mime: file.type || null,
        size_bytes: file.size,
        position: assets.length + done,
        is_preview: false,
        title: file.name,
      });

      if (insErr) toast.error(insErr.message);

      done += 1;
      setProgress(Math.round((done / totalFiles) * 100));
    }

    setUploading(false);
    setProgress(0);
    toast.success(`Uploaded ${done}/${totalFiles}`);
    load();
  };

  const remove = async (a: Asset) => {
    if (a.storage_path) {
      const b = bucket === "media" ? "content-media" : "content-covers";
      await supabase.storage.from(b).remove([a.storage_path]);
    }
    await supabase.from("content_assets").delete().eq("id", a.id);
    load();
  };

  const togglePreview = async (a: Asset) => {
    await supabase.from("content_assets").update({ is_preview: !a.is_preview }).eq("id", a.id);
    load();
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label
        className={cn(
          "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border/60 rounded-2xl py-8 cursor-pointer bg-background/40 hover:bg-background/70 transition-colors",
          uploading && "opacity-70 pointer-events-none"
        )}
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm">Uploading… {progress}%</p>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-primary" />
            <p className="text-sm font-medium">Drop files or click to upload</p>
            <p className="text-[11px] text-muted-foreground">
              Videos · Images · PDFs · Audio · Zip — multi-file supported
            </p>
          </>
        )}
        <input
          type="file"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
          accept={bucket === "cover" ? "image/*" : undefined}
        />
      </label>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading assets…
        </div>
      ) : assets.length === 0 ? (
        <p className="text-center py-4 text-xs text-muted-foreground">No files yet.</p>
      ) : (
        <ul className="space-y-2">
          {assets.map((a) => {
            const Icon = ICON[a.kind];
            return (
              <li
                key={a.id}
                className="glass rounded-xl px-3 py-2 flex items-center gap-3"
              >
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate font-medium">{a.title ?? a.storage_path ?? a.url}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {a.kind.toUpperCase()} · {fmtBytes(a.size_bytes)}
                    {a.is_preview && <span className="ml-2 text-amber-400">Preview</span>}
                  </p>
                </div>
                {bucket === "media" && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => togglePreview(a)}
                    title={a.is_preview ? "Unmark preview" : "Mark as preview"}
                  >
                    {a.is_preview ? (
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => remove(a)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
