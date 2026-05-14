import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const STATUSES = ["all", "pending", "approved", "rejected"] as const;

export default function AdminPod() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof STATUSES)[number]>("all");
  const [previewing, setPreviewing] = useState<any | null>(null);
  const [rejecting, setRejecting] = useState<any | null>(null);
  const [reason, setReason] = useState("");

  const { data: designs } = useQuery({
    queryKey: ["admin-pod"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pod_designs")
        .select("id, title, description, status, image_url, sales_count, rejection_reason, created_at, profiles:user_id(username, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: "approved" | "rejected" | "pending"; reason?: string }) => {
      const update: any = { status };
      if (status === "approved") update.approved_at = new Date().toISOString();
      if (status === "rejected") update.rejection_reason = reason ?? null;
      const { error } = await supabase.from("pod_designs").update(update).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin-pod"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = useMemo(() => {
    const list = designs ?? [];
    return tab === "all" ? list : list.filter((d: any) => d.status === tab);
  }, [designs, tab]);

  const leaderboard = useMemo(() => {
    return [...(designs ?? [])].sort((a: any, b: any) => (b.sales_count ?? 0) - (a.sales_count ?? 0)).slice(0, 5);
  }, [designs]);

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Print on Demand"
        title="POD Designs"
        subtitle="Approve or reject creator-uploaded designs."
      />

      <Reveal className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => {
          const count = s === "all" ? (designs ?? []).length : (designs ?? []).filter((d: any) => d.status === s).length;
          return (
            <Button key={s} size="sm" variant={tab === s ? "default" : "outline"} onClick={() => setTab(s)} className="h-8">
              {s} <span className="ml-1.5 text-[10px] opacity-70">{count}</span>
            </Button>
          );
        })}
      </Reveal>

      {leaderboard.length > 0 && (
        <Reveal>
          <div className="glass-strong rounded-2xl p-4">
            <h3 className="font-semibold mb-3">Top sellers</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {leaderboard.map((d: any, i: number) => (
                <div key={d.id} className="glass rounded-xl p-2 text-center">
                  <div className="text-xs font-bold text-primary">#{i + 1}</div>
                  {d.image_url && <img src={d.image_url} alt="" loading="lazy" className="h-16 w-full object-cover rounded my-1" />}
                  <div className="text-xs font-medium truncate">{d.title}</div>
                  <div className="text-[10px] text-muted-foreground">{d.sales_count ?? 0} sold</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      <Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No designs.</p>}
          {filtered.map((d: any) => (
            <div key={d.id} className="glass rounded-2xl p-3 space-y-2 hover-lift">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">@{d.profiles?.username ?? "—"}</div>
                <Badge variant={d.status === "approved" ? "default" : d.status === "rejected" ? "destructive" : "secondary"}>
                  {d.status}
                </Badge>
              </div>
              {d.image_url && (
                <button onClick={() => setPreviewing(d)} className="block w-full">
                  <img src={d.image_url} alt={d.title} loading="lazy" className="w-full h-40 object-cover rounded-lg" />
                </button>
              )}
              <div className="font-medium text-sm truncate">{d.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">{d.description}</div>
              {d.rejection_reason && (
                <div className="text-[11px] text-destructive line-clamp-2">Reason: {d.rejection_reason}</div>
              )}
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="premium" className="flex-1" onClick={() => setStatus.mutate({ id: d.id, status: "approved" })}>Approve</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setRejecting(d); setReason(""); }}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Preview lightbox */}
      <Dialog open={!!previewing} onOpenChange={(o) => !o && setPreviewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{previewing?.title}</DialogTitle></DialogHeader>
          {previewing?.image_url && <img src={previewing.image_url} alt="" className="w-full max-h-[70vh] object-contain rounded-lg" />}
        </DialogContent>
      </Dialog>

      {/* Reject reason */}
      <Dialog open={!!rejecting} onOpenChange={(o) => !o && setRejecting(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject design</DialogTitle></DialogHeader>
          <Textarea
            placeholder="Reason for the creator…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejecting(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (rejecting) setStatus.mutate({ id: rejecting.id, status: "rejected", reason });
                setRejecting(null);
              }}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
