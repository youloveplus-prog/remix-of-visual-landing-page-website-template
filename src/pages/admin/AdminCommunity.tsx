import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminCommunity() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(*)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Post removed");
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-sm text-muted-foreground">Moderate posts, videos, and reviews.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(data ?? []).map((p: any) => (
          <Card key={p.id} className="p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>@{p.profiles?.username ?? "unknown"} · {p.type}</span>
              <Button size="icon" variant="ghost" onClick={() => remove.mutate(p.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            {p.content && <p className="text-sm line-clamp-3">{p.content}</p>}
            {p.images?.[0] && <img src={p.images[0]} alt="" className="rounded w-full h-32 object-cover" />}
            <div className="text-[10px] text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
          </Card>
        ))}
        {(data ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">No community posts yet.</p>
        )}
      </div>
    </div>
  );
}
