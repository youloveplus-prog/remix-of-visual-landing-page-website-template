import { useState } from "react";
import { toast } from "sonner";
import { Megaphone, Pin, Send, Trash2, Plus, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useLiveActivitySettings,
  useUpdateLiveActivitySettings,
} from "@/hooks/useLiveActivitySettings";
import {
  useAllHomeAnnouncements,
  useUpsertHomeAnnouncement,
  useDeleteHomeAnnouncement,
  type HomeAnnouncement,
  type AnnouncementLevel,
} from "@/hooks/useHomeAnnouncements";

const EMPTY: Partial<HomeAnnouncement> & { title: string } = {
  title: "",
  body: "",
  level: "info",
  link: "",
  is_active: true,
  is_pinned: true,
  show_as_toast: false,
};

function levelIcon(level: AnnouncementLevel) {
  switch (level) {
    case "success": return <CheckCircle2 className="h-3.5 w-3.5" />;
    case "warning": return <AlertTriangle className="h-3.5 w-3.5" />;
    case "promo": return <Sparkles className="h-3.5 w-3.5" />;
    default: return <Megaphone className="h-3.5 w-3.5" />;
  }
}

export default function AdminLiveActivity() {
  const { data: settings, isLoading: settingsLoading } = useLiveActivitySettings();
  const updateSettings = useUpdateLiveActivitySettings();
  const { data: announcements = [], isLoading: annLoading } = useAllHomeAnnouncements();
  const upsert = useUpsertHomeAnnouncement();
  const remove = useDeleteHomeAnnouncement();

  const [editing, setEditing] = useState<(Partial<HomeAnnouncement> & { title: string }) | null>(null);

  const saveSetting = async (patch: Parameters<typeof updateSettings.mutateAsync>[0]) => {
    try {
      await updateSettings.mutateAsync(patch);
      toast.success("Settings updated");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to update");
    }
  };

  const submitAnnouncement = async () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      await upsert.mutateAsync({
        ...editing,
        body: editing.body || null,
        link: editing.link || null,
      });
      toast.success(editing.id ? "Announcement updated" : "Announcement created");
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save");
    }
  };

  const forcePush = async (a: HomeAnnouncement) => {
    try {
      await upsert.mutateAsync({
        id: a.id,
        title: a.title,
        is_active: true,
        is_pinned: true,
        show_as_toast: true,
        starts_at: new Date().toISOString(),
      });
      toast.success("Force-pushed to every home screen");
    } catch (e: any) {
      toast.error(e.message ?? "Failed to push");
    }
  };

  if (settingsLoading) {
    return <div className="p-6 text-sm text-white/60">Loading…</div>;
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Live activity & notifications</h1>
        <p className="text-sm text-white/60">
          Choose which events appear in the home feed, and push announcements to every user's home screen.
        </p>
      </div>

      {/* === Settings === */}
      <Card>
        <CardHeader>
          <CardTitle>Feed sources</CardTitle>
          <CardDescription>
            Toggle which event types appear in “Happening right now” and the popup toaster.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {[
            { key: "purchases_enabled", label: "Purchases", desc: "Recent paid orders" },
            { key: "reviews_enabled", label: "Reviews", desc: "New product reviews" },
            { key: "enrolments_enabled", label: "Enrolments", desc: "Course / content access granted" },
            { key: "milestones_enabled", label: "Milestones", desc: "Lesson completions, XP wins" },
          ].map((row) => (
            <div key={row.key} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div>
                <p className="text-sm font-medium">{row.label}</p>
                <p className="text-xs text-white/50">{row.desc}</p>
              </div>
              <Switch
                checked={(settings as any)[row.key]}
                onCheckedChange={(v) => saveSetting({ [row.key]: v } as any)}
              />
            </div>
          ))}

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:col-span-2">
            <div>
              <p className="text-sm font-medium">Floating toast pop-ups</p>
              <p className="text-xs text-white/50">Auto-fires social-proof notifications across the app.</p>
            </div>
            <Switch
              checked={settings!.toast_enabled}
              onCheckedChange={(v) => saveSetting({ toast_enabled: v })}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Toast interval</Label>
              <span className="text-xs text-white/60">{settings!.toast_interval_seconds}s</span>
            </div>
            <Slider
              className="mt-3"
              min={5}
              max={120}
              step={1}
              value={[settings!.toast_interval_seconds]}
              onValueChange={([v]) => saveSetting({ toast_interval_seconds: v })}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Feed window</Label>
              <span className="text-xs text-white/60">last {settings!.feed_window_hours}h</span>
            </div>
            <Slider
              className="mt-3"
              min={1}
              max={168}
              step={1}
              value={[settings!.feed_window_hours]}
              onValueChange={([v]) => saveSetting({ feed_window_hours: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* === Announcements === */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Home announcements</CardTitle>
            <CardDescription>
              Push pinned banners and toasts to every user's home screen.
            </CardDescription>
          </div>
          <Button onClick={() => setEditing({ ...EMPTY })} size="sm">
            <Plus className="mr-1 h-4 w-4" /> New
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {annLoading ? (
            <p className="text-sm text-white/50">Loading…</p>
          ) : announcements.length === 0 ? (
            <p className="text-sm text-white/50">No announcements yet.</p>
          ) : (
            announcements.map((a) => (
              <div
                key={a.id}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="gap-1 capitalize">
                      {levelIcon(a.level)} {a.level}
                    </Badge>
                    {a.is_pinned && <Badge variant="secondary" className="gap-1"><Pin className="h-3 w-3" /> Pinned</Badge>}
                    {a.show_as_toast && <Badge variant="secondary">Toast</Badge>}
                    {!a.is_active && <Badge variant="destructive">Inactive</Badge>}
                  </div>
                  <p className="mt-2 truncate text-sm font-medium">{a.title}</p>
                  {a.body && <p className="truncate text-xs text-white/60">{a.body}</p>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => forcePush(a)}>
                    <Send className="mr-1 h-4 w-4" /> Force push
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(a)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      if (!confirm("Delete this announcement?")) return;
                      await remove.mutateAsync(a.id);
                      toast.success("Deleted");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* === Editor === */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit announcement" : "New announcement"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Flash sale — 30% off all courses"
                />
              </div>
              <div>
                <Label>Body</Label>
                <Textarea
                  value={editing.body ?? ""}
                  onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                  placeholder="Optional supporting copy…"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Level</Label>
                  <Select
                    value={editing.level ?? "info"}
                    onValueChange={(v) => setEditing({ ...editing, level: v as AnnouncementLevel })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="promo">Promo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>CTA link (optional)</Label>
                  <Input
                    value={editing.link ?? ""}
                    onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                    placeholder="/shop?filter=sale"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                {[
                  { key: "is_active", label: "Active" },
                  { key: "is_pinned", label: "Pin as banner on home" },
                  { key: "show_as_toast", label: "Also fire as toast (once per visitor)" },
                ].map((row) => (
                  <label key={row.key} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                    <span className="text-sm">{row.label}</span>
                    <Switch
                      checked={Boolean((editing as any)[row.key])}
                      onCheckedChange={(v) => setEditing({ ...editing, [row.key]: v } as any)}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={submitAnnouncement} disabled={upsert.isPending}>
              {editing?.id ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
