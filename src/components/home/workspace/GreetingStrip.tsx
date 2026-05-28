import { useEffect, useState } from "react";
import { Bell, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

const LAST_SEEN_KEY = "notif_last_seen";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function GreetingStrip() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const name = profile?.full_name || profile?.username || "Learner";
  const initial = (name[0] || "A").toUpperCase();
  const [greeting, setGreeting] = useState(getGreeting);

  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-notifications", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const lastSeen = localStorage.getItem(LAST_SEEN_KEY) ?? "1970-01-01";
      const { count } = await supabase
        .from("admin_notifications")
        .select("id", { count: "exact", head: true })
        .gt("created_at", lastSeen);
      return count ?? 0;
    },
  });

  return (
    <section className="section-x">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">{greeting}</p>
          <h1 className="font-display text-[20px] sm:text-[22px] font-bold tracking-tight truncate leading-tight">
            {name}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="relative h-10 w-10 rounded-2xl glass border border-border/60 flex items-center justify-center pressable focus-ring shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.18)]"
          >
            <Bell className="h-[18px] w-[18px] text-foreground/80" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background" />
            )}
          </Link>
          <Link to="/profile" aria-label="Profile" className="focus-ring rounded-2xl">
            <Avatar className="h-10 w-10 rounded-2xl border border-border/60 shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.18)]">
              <AvatarImage src={profile?.avatar_url ?? undefined} alt={name} className="rounded-2xl" />
              <AvatarFallback className="rounded-2xl bg-secondary text-foreground text-sm font-bold">{initial}</AvatarFallback>
            </Avatar>
          </Link>
          <Link
            to="/settings"
            aria-label="Settings"
            className="h-10 w-10 rounded-2xl glass border border-border/60 flex items-center justify-center pressable focus-ring shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.18)]"
          >
            <SlidersHorizontal className="h-[18px] w-[18px] text-foreground/80" />
          </Link>
        </div>
      </div>
    </section>
  );
}
