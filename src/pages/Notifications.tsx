import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Megaphone, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type AdminNotification = {
  id: string;
  title: string;
  body: string;
  audience: string;
  sent_at: string;
};

const Notifications = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["notifications", "feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_notifications")
        .select("id,title,body,audience,sent_at")
        .order("sent_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as AdminNotification[];
    },
  });

  return (
    <AppLayout>
      <SEO
        title="Notifications — ASIKON"
        description="Stay up to date with announcements, drops, and learning milestones from ASIKON."
        url="https://style-verse-suite.lovable.app/notifications"
      />

      <MobilePage maxWidth="reading" spacing="space-y-8">
        <PageHero
          eyebrow="Inbox"
          title="Notifications"
          subtitle="Announcements from the team and important updates about your account."
        />

        <div className="divide-y divide-border border-y border-border liquid-glass sm:rounded-2xl sm:border sm:divide-border">
          {isLoading && (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          )}

          {!isLoading && (!data || data.length === 0) && (
            <div className="p-12 text-center">
              <div className="size-12 mx-auto rounded-full bg-secondary grid place-items-center text-foreground/60">
                <Bell className="size-5" aria-hidden />
              </div>
              <h2 className="font-display text-lg font-semibold mt-4 mb-1">You're all caught up</h2>
              <p className="text-sm text-muted-foreground">
                New announcements will appear here.
              </p>
            </div>
          )}

          {data?.map((n) => {
            const Icon = n.audience === "all" ? Megaphone : Sparkles;
            return (
              <article
                key={n.id}
                className="flex gap-4 p-4 sm:p-5 transition-colors hover:bg-secondary/40"
              >
                <div className="size-9 rounded-full bg-secondary grid place-items-center text-foreground/70 shrink-0">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-medium text-[14.5px] truncate">{n.title}</h3>
                    <time className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
                      {formatDistanceToNow(new Date(n.sent_at), { addSuffix: true })}
                    </time>
                  </div>
                  <p className="text-[13.5px] text-muted-foreground mt-1 whitespace-pre-line leading-relaxed">
                    {n.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </MobilePage>
    </AppLayout>
  );
};

export default Notifications;
