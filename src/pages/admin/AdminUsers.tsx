import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useDeferredValue } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { Search, Download, ShieldOff, Shield, Crown } from "lucide-react";
import { toast } from "sonner";
import { useIsAdmin } from "@/hooks/useUserRole";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ROLE_OPTIONS = ["all", "user", "moderator", "admin", "super_admin"] as const;

export default function AdminUsers() {
  const qc = useQueryClient();
  const { isSuperAdmin } = useIsAdmin();
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [roleFilter, setRoleFilter] = useState<(typeof ROLE_OPTIONS)[number]>("all");
  const [confirm, setConfirm] = useState<null | { kind: "ban" | "unban" | "promote" | "demote"; user: any; role?: string }>(null);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, trust_score, coins, is_verified, is_banned, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return data ?? [];
    },
  });

  const rolesByUser = useMemo(() => {
    const m = new Map<string, string[]>();
    (roles ?? []).forEach((r: any) => {
      const arr = m.get(r.user_id) ?? [];
      arr.push(r.role);
      m.set(r.user_id, arr);
    });
    return m;
  }, [roles]);

  const filtered = useMemo(() => {
    let list = profiles ?? [];
    if (roleFilter !== "all") {
      list = list.filter((p: any) => (rolesByUser.get(p.id) ?? ["user"]).includes(roleFilter));
    }
    if (dq.trim()) {
      const needle = dq.toLowerCase();
      list = list.filter(
        (p: any) =>
          p.username?.toLowerCase().includes(needle) ||
          p.full_name?.toLowerCase().includes(needle) ||
          p.id?.toLowerCase().includes(needle),
      );
    }
    return list;
  }, [profiles, dq, roleFilter, rolesByUser]);

  const setBan = useMutation({
    mutationFn: async ({ id, banned }: { id: string; banned: boolean }) => {
      const { error } = await supabase.from("profiles").update({ is_banned: banned }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      toast.success(vars.banned ? "User banned" : "User unbanned");
      qc.invalidateQueries({ queryKey: ["admin-profiles"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const setRole = useMutation({
    mutationFn: async ({ user_id, role, action }: { user_id: string; role: string; action: "add" | "remove" }) => {
      if (action === "add") {
        const { error } = await supabase.from("user_roles").insert({ user_id, role: role as any });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", role as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["admin-all-roles"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const exportCsv = () => {
    const rows = [["id", "username", "full_name", "trust_score", "coins", "is_banned", "roles", "created_at"]];
    filtered.forEach((p: any) => {
      rows.push([
        p.id,
        p.username ?? "",
        p.full_name ?? "",
        String(p.trust_score ?? 0),
        String(p.coins ?? 0),
        String(p.is_banned ?? false),
        (rolesByUser.get(p.id) ?? ["user"]).join("|"),
        p.created_at ?? "",
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asikonasik-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        eyebrow="Members"
        title="Users"
        subtitle="Search, promote, and moderate members across the platform."
      />

      <Reveal className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, username, or ID…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-background/60"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ROLE_OPTIONS.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={roleFilter === r ? "default" : "outline"}
              onClick={() => setRoleFilter(r)}
              className="h-8"
            >
              {r}
            </Button>
          ))}
        </div>
        <Button size="sm" variant="outline" className="ml-auto h-8" onClick={exportCsv}>
          <Download className="h-3.5 w-3.5 sm:mr-1.5" /> <span className="hidden sm:inline">Export CSV</span>
        </Button>
      </Reveal>

      {/* Mobile: card list */}
      <Reveal className="md:hidden space-y-2">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">No matching users.</p>
        ) : (
          filtered.map((p: any) => {
            const userRoles = rolesByUser.get(p.id) ?? ["user"];
            const isAdminRow = userRoles.includes("admin") || userRoles.includes("super_admin");
            return (
              <div key={p.id} className="glass rounded-2xl p-3">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={p.avatar_url ?? undefined} loading="lazy" />
                    <AvatarFallback>{(p.username ?? "?")[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate text-sm">{p.full_name || p.username || "—"}</div>
                    <div className="text-[11px] text-muted-foreground truncate">@{p.username ?? "—"}</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {isSuperAdmin && !isAdminRow && (
                      <Button size="icon" variant="ghost" className="h-8 w-8"
                        onClick={() => setConfirm({ kind: "promote", user: p, role: "admin" })}>
                        <Crown className="h-4 w-4 text-primary" />
                      </Button>
                    )}
                    {isSuperAdmin && isAdminRow && !userRoles.includes("super_admin") && (
                      <Button size="icon" variant="ghost" className="h-8 w-8"
                        onClick={() => setConfirm({ kind: "demote", user: p, role: "admin" })}>
                        <Shield className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8"
                      onClick={() => setConfirm({ kind: p.is_banned ? "unban" : "ban", user: p })}>
                      <ShieldOff className={`h-4 w-4 ${p.is_banned ? "text-muted-foreground" : "text-destructive"}`} />
                    </Button>
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  {userRoles.map((r) => (
                    <Badge key={r}
                      variant={r === "super_admin" ? "destructive" : r === "admin" ? "default" : "secondary"}
                      className="text-[10px]">{r}</Badge>
                  ))}
                  {p.is_banned && <Badge variant="destructive" className="text-[10px]">banned</Badge>}
                  <span className="ml-auto text-[10.5px] text-muted-foreground">
                    Trust {p.trust_score ?? 0} · {p.coins ?? 0}c
                  </span>
                </div>
              </div>
            );
          })
        )}
      </Reveal>

      {/* Desktop: table */}
      <Reveal className="hidden md:block">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">User</th>
                  <th className="text-left font-semibold px-4 py-3">Roles</th>
                  <th className="text-left font-semibold px-4 py-3">Trust</th>
                  <th className="text-left font-semibold px-4 py-3">Coins</th>
                  <th className="text-left font-semibold px-4 py-3">Joined</th>
                  <th className="text-right font-semibold px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center text-muted-foreground py-8">Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted-foreground py-8">No matching users.</td></tr>
                ) : (
                  filtered.map((p: any) => {
                    const userRoles = rolesByUser.get(p.id) ?? ["user"];
                    const isAdminRow = userRoles.includes("admin") || userRoles.includes("super_admin");
                    return (
                      <tr key={p.id} className="border-t border-border/40 hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={p.avatar_url ?? undefined} loading="lazy" />
                              <AvatarFallback>{(p.username ?? "?")[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{p.full_name || p.username || "—"}</div>
                              <div className="text-xs text-muted-foreground truncate">@{p.username ?? "—"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {userRoles.map((r) => (
                              <Badge
                                key={r}
                                variant={r === "super_admin" ? "destructive" : r === "admin" ? "default" : "secondary"}
                                className="text-[10px]"
                              >
                                {r}
                              </Badge>
                            ))}
                            {p.is_banned && <Badge variant="destructive" className="text-[10px]">banned</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">{p.trust_score ?? 0}</td>
                        <td className="px-4 py-2.5">{p.coins ?? 0}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="inline-flex gap-1">
                            {isSuperAdmin && !isAdminRow && (
                              <Button size="icon" variant="ghost" title="Promote to admin"
                                onClick={() => setConfirm({ kind: "promote", user: p, role: "admin" })}>
                                <Crown className="h-4 w-4 text-primary" />
                              </Button>
                            )}
                            {isSuperAdmin && isAdminRow && !userRoles.includes("super_admin") && (
                              <Button size="icon" variant="ghost" title="Demote to user"
                                onClick={() => setConfirm({ kind: "demote", user: p, role: "admin" })}>
                                <Shield className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              title={p.is_banned ? "Unban" : "Ban"}
                              onClick={() => setConfirm({ kind: p.is_banned ? "unban" : "ban", user: p })}
                            >
                              <ShieldOff className={`h-4 w-4 ${p.is_banned ? "text-muted-foreground" : "text-destructive"}`} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.kind === "ban" && "Ban this user?"}
              {confirm?.kind === "unban" && "Unban this user?"}
              {confirm?.kind === "promote" && "Promote to admin?"}
              {confirm?.kind === "demote" && "Remove admin role?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.user?.full_name || confirm?.user?.username || confirm?.user?.id}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!confirm) return;
                if (confirm.kind === "ban") setBan.mutate({ id: confirm.user.id, banned: true });
                if (confirm.kind === "unban") setBan.mutate({ id: confirm.user.id, banned: false });
                if (confirm.kind === "promote") setRole.mutate({ user_id: confirm.user.id, role: confirm.role!, action: "add" });
                if (confirm.kind === "demote") setRole.mutate({ user_id: confirm.user.id, role: confirm.role!, action: "remove" });
                setConfirm(null);
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
