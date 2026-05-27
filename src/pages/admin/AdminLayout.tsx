import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, Search, Users, ChevronRight, Command } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { AdminGuard } from "./AdminGuard";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Reveal } from "@/components/transitions/Reveal";
import { AdminBottomNav } from "./AdminBottomNav";
import { AdminPageSkeleton } from "@/components/admin/AdminPageSkeleton";
import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";
import { adminNavItems, ADMIN_SECTION_ORDER } from "./adminNav";
import asikonLogo from "@/assets/logo.png";

// Re-export so any existing import path keeps working.
export { adminNavItems } from "./adminNav";

function useAdminBadges() {
  const { data } = useQuery({
    queryKey: ["admin-nav-badges"],
    queryFn: async () => {
      const [usersR, pendingR] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);
      return {
        users: usersR.count ?? 0,
        pendingOrders: pendingR.count ?? 0,
        notifications: 0,
      };
    },
    staleTime: 60_000,
  });
  return data ?? { users: 0, pendingOrders: 0, notifications: 0 };
}

function pageMeta(pathname: string) {
  const found = adminNavItems.find((i) =>
    i.end ? pathname === i.url : pathname === i.url || pathname.startsWith(i.url + "/"),
  );
  return found ?? adminNavItems[0];
}

function AdminSidebar() {
  const { pathname } = useLocation();
  const { isSuperAdmin } = useIsAdmin();
  const badges = useAdminBadges();

  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen border-r border-border/60"
      style={{ background: "var(--gradient-surface)" }}
    >
      <div className="px-4 pt-5 pb-4 flex items-center gap-2.5">
        <NavLink
          to="/"
          aria-label="Back to Asikon app"
          title="Back to Asikon app"
          className="h-10 w-10 rounded-xl overflow-hidden ring-1 ring-border/60 grid place-items-center bg-background shadow-[var(--shadow-glow)] hover:ring-primary/40 transition"
        >
          <img src={asikonLogo} alt="Asikon" className="h-7 w-7 object-contain" />
        </NavLink>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold leading-tight truncate">asikonasik</div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {isSuperAdmin ? "Super Admin" : "Admin Panel"}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {ADMIN_SECTION_ORDER.map((section) => {
          const items = adminNavItems.filter((i) => i.section === section);
          if (!items.length) return null;
          return (
            <div key={section} className="space-y-0.5">
              <p className="eyebrow-bar px-3 pt-3 pb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
                {section}
              </p>
              {items.map((item) => {
                const active = isActive(item.url, item.end);
                const badgeVal = item.badgeKey ? badges[item.badgeKey] : 0;
                return (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    end={item.end}
                    className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm pressable transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`grid place-items-center h-8 w-8 rounded-lg transition-all ${
                        active
                          ? "gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                          : "bg-muted/60 text-muted-foreground group-hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="font-medium truncate flex-1">{item.title}</span>
                    {item.badgeKey && badgeVal > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-semibold">
                        {badgeVal > 99 ? "99+" : badgeVal}
                      </Badge>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}

        <div className="px-2 pt-3 pb-1">
          <div className="divider-soft" />
        </div>
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 pressable"
        >
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-muted/60">
            <Home className="h-4 w-4" />
          </span>
          <span className="font-medium">Back to app</span>
        </NavLink>
      </nav>

      <div className="p-3">
        <div className="glass-subtle rounded-xl p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground mb-0.5 flex items-center gap-1.5">
            <Command className="h-3 w-3" /> Quick jump
          </p>
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">⌘K</kbd> to search admin pages.
        </div>
      </div>
    </aside>
  );
}

function Breadcrumbs({ pathname }: { pathname: string }) {
  const segs = pathname.split("/").filter(Boolean); // e.g. ["asikonasik","users"]
  const current = pageMeta(pathname);
  return (
    <nav
      className="hidden md:flex items-center gap-1 text-xs text-muted-foreground"
      aria-label="Breadcrumb"
    >
      <span className="font-semibold tracking-wide uppercase text-[10px]">{segs[0]}</span>
      <ChevronRight className="h-3 w-3 opacity-60" />
      <span className="text-foreground/80">{current.section}</span>
      <ChevronRight className="h-3 w-3 opacity-60" />
      <span className="text-foreground font-semibold">{current.title}</span>
    </nav>
  );
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { isSuperAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const initial = (user?.email ?? "A").slice(0, 1).toUpperCase();
  const meta = useMemo(() => pageMeta(pathname), [pathname]);

  // Track recent admin pages (in-memory, last 5)
  const [recent, setRecent] = useState<{ label: string; url: string }[]>([]);
  useEffect(() => {
    setRecent((prev) => {
      const entry = { label: meta.title, url: meta.url };
      const next = [entry, ...prev.filter((r) => r.url !== entry.url)].slice(0, 5);
      return next;
    });
  }, [meta.url, meta.title]);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <AdminGuard>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 md:h-16 sticky top-0 z-30 border-b border-border/50 flex items-center px-3 md:px-6 gap-2.5 md:gap-3 glass-strong" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
            <NavLink
              to="/"
              aria-label="Back to Asikon app"
              title="Back to Asikon app"
              className="md:hidden h-9 w-9 rounded-xl overflow-hidden ring-1 ring-border/60 grid place-items-center bg-background shadow-[var(--shadow-glow)] hover:ring-primary/40 transition shrink-0"
            >
              <img src={asikonLogo} alt="Asikon" className="h-6 w-6 object-contain" />
            </NavLink>

            <div className="flex flex-col leading-tight min-w-0 flex-1">
              <Breadcrumbs pathname={pathname} />
              <h1 className="md:hidden text-[15px] font-display font-semibold tracking-tight truncate">
                <span className="text-gradient">{meta.title}</span>
              </h1>
              <h1 className="hidden md:block text-base sm:text-lg font-display font-semibold tracking-tight truncate">
                <span className="text-gradient">{meta.title}</span>
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 h-9 px-3 rounded-xl border border-border/60 bg-background/60 hover:bg-muted/60 transition text-xs text-muted-foreground min-w-[14rem]"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="flex-1 text-left">Jump to…</span>
                <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  ⌘K
                </kbd>
              </button>

              <Button variant="ghost" size="icon" className="h-9 w-9 relative" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pressable rounded-full pl-1 pr-2 py-1 hover:bg-muted/50">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                      <AvatarFallback className="text-xs bg-primary/15 text-primary font-semibold">
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <Badge variant="secondary" className="hidden sm:inline-flex text-[10px]">
                      {isSuperAdmin ? "Super Admin" : "Admin"}
                    </Badge>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Users className="h-4 w-4 mr-2" /> My profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/")}>
                    <Home className="h-4 w-4 mr-2" /> Back to app
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main
            className="flex-1 px-3 md:px-6 py-4 md:py-6 md:pb-8 overflow-x-hidden"
            style={{ paddingBottom: "calc(7rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <Suspense fallback={<AdminPageSkeleton />}>
              <Reveal>
                <Outlet />
              </Reveal>
            </Suspense>
          </main>
        </div>

        <AdminBottomNav />
        <AdminCommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} recent={recent} />
      </div>
    </AdminGuard>
  );
}
