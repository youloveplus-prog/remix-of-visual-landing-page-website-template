import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2, Pin, PinOff } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminCommunity() {
  const qc = useQueryClient();
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

  const { data: posts } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, type, images, created_at, is_pinned, user_id, profiles(username, avatar_url)")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: comments } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("post_comments")
        .select("id, content, created_at, user_id, post_id, profiles(username)")
        .order("created_at", { ascending: false })
        .limit(100);
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

  const removeComment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("post_comments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Comment removed");
      qc.invalidateQueries({ queryKey: ["admin-comments"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const togglePin = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("posts").update({ is_pinned: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }),
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Moderation"
        title="Community"
        subtitle="Pin highlights or remove content that violates guidelines."
      />

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-4">
          <Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(posts ?? []).length === 0 && <p className="text-sm text-muted-foreground col-span-full">No community posts yet.</p>}
              {(posts ?? []).map((p: any) => (
                <div key={p.id} className="glass rounded-2xl p-3 space-y-2 hover-lift">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-muted-foreground truncate">@{p.profiles?.username ?? "unknown"} · {p.type}</div>
                    <div className="flex gap-1 shrink-0">
                      {p.is_pinned && <Badge className="text-[10px]">Pinned</Badge>}
                      <Button size="icon" variant="ghost" onClick={() => togglePin.mutate({ id: p.id, value: !p.is_pinned })} title="Pin/unpin">
                        {p.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setConfirmDel({ kind: "post", id: p.id })}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {p.content && <p className="text-sm line-clamp-3">{p.content}</p>}
                  {p.images?.[0] && <img src={p.images[0]} alt="" loading="lazy" className="rounded-lg w-full h-32 object-cover" />}
                  <div className="text-[10px] text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </TabsContent>

        <TabsContent value="comments" className="mt-4">
          <Reveal>
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Comment</th>
                    <th className="text-left px-4 py-3">When</th>
                    <th className="text-right px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {(comments ?? []).length === 0 && <tr><td colSpan={4} className="text-center py-6 text-muted-foreground">No comments.</td></tr>}
                  {(comments ?? []).map((c: any) => (
                    <tr key={c.id} className="border-t border-border/40 hover:bg-muted/40">
                      <td className="px-4 py-2.5 text-xs">@{c.profiles?.username ?? "—"}</td>
                      <td className="px-4 py-2.5 line-clamp-2 max-w-md">{c.content}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right">
                        <Button size="icon" variant="ghost" onClick={() => removeComment.mutate(c.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (confirmDel) remove.mutate(confirmDel.id); setConfirmDel(null); }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
