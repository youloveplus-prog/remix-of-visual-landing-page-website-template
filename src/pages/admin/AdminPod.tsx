import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminPod() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-pod"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pod_designs")
        .select("*, profiles:user_id(username, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" | "pending" }) => {
      const update: any = { status };
      if (status === "approved") update.approved_at = new Date().toISOString();
      const { error } = await supabase.from("pod_designs").update(update).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin-pod"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">POD Designs</h1>
        <p className="text-sm text-muted-foreground">Approve or reject creator-uploaded designs.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(data ?? []).map((d: any) => (
          <Card key={d.id} className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">@{d.profiles?.username ?? "—"}</div>
              <Badge variant={d.status === "approved" ? "default" : d.status === "rejected" ? "destructive" : "secondary"}>
                {d.status}
              </Badge>
            </div>
            <div className="font-medium text-sm">{d.title}</div>
            <div className="text-xs text-muted-foreground line-clamp-2">{d.description}</div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" variant="default" onClick={() => setStatus.mutate({ id: d.id, status: "approved" })}>Approve</Button>
              <Button size="sm" variant="outline" onClick={() => setStatus.mutate({ id: d.id, status: "rejected" })}>Reject</Button>
            </div>
          </Card>
        ))}
        {(data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">No designs uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
