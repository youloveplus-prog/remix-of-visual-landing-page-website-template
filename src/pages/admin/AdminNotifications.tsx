import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { useAuth } from "@/hooks/useAuth";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Send, Megaphone, Users, Shield } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface AdminNotification {
  id: string;
  title: string;
  body: string;
  audience: string;
  sent_at: string;
  sent_by: string;
}

const audiences = [
  { value: "all", label: "All users", icon: Users },
  { value: "learners", label: "Active learners", icon: Megaphone },
  { value: "admins", label: "Admins only", icon: Shield },
];

export default function AdminNotifications() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");

  const listQ = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async (): Promise<AdminNotification[]> => {
      const { data, error } = await db
        .from("admin_notifications")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const sendMut = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await db.from("admin_notifications").insert({
        title: title.trim(),
        body: body.trim(),
        audience,
        sent_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Notification broadcast saved");
      setTitle("");
      setBody("");
      setAudience("all");
      qc.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to send"),
  });

  const canSend = title.trim().length >= 3 && body.trim().length >= 3 && !sendMut.isPending;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Notifications"
        title="Broadcast & history"
        subtitle="Send announcements to all users or specific roles."
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSend) sendMut.mutate();
          }}
          className="glass rounded-2xl p-5 space-y-4 lg:col-span-2"
        >
          <div className="flex items-center gap-2">
            <div className="rounded-xl p-2 bg-primary/10 text-primary">
              <Megaphone className="h-4 w-4" />
            </div>
            <h3 className="font-display text-base font-semibold">New broadcast</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="n-title">Title</Label>
            <Input
              id="n-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. New SSC lessons this week"
              maxLength={120}
            />
            <p className="text-[11px] text-muted-foreground text-right">{title.length}/120</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="n-body">Message</Label>
            <Textarea
              id="n-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What do you want to tell your users?"
              rows={6}
              maxLength={1000}
            />
            <p className="text-[11px] text-muted-foreground text-right">{body.length}/1000</p>
          </div>

          <div className="space-y-2">
            <Label>Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={!canSend}>
            <Send className="h-4 w-4 mr-2" />
            {sendMut.isPending ? "Sending..." : "Send notification"}
          </Button>
        </form>

        {/* History */}
        <div className="glass rounded-2xl p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold">Recent broadcasts</h3>
            <Badge variant="secondary" className="text-[10px]">
              {listQ.data?.length ?? 0}
            </Badge>
          </div>

          {listQ.isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : !listQ.data?.length ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              <Megaphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No notifications sent yet.
            </div>
          ) : (
            <ul className="space-y-3">
              {listQ.data.map((n) => {
                const aud = audiences.find((a) => a.value === n.audience);
                const Icon = aud?.icon ?? Users;
                return (
                  <li
                    key={n.id}
                    className="rounded-xl border border-border/40 bg-card/30 p-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="font-semibold text-sm">{n.title}</h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(n.sent_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-[13px] text-muted-foreground line-clamp-2 mb-2">{n.body}</p>
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <Icon className="h-3 w-3" />
                      {aud?.label ?? n.audience}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
