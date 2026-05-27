import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Reveal } from "@/components/transitions/Reveal";
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
        url="https://asikonpro.lovable.app/notifications"
      />

      <Reveal as="section" className="pt-16 pb-8 sm:pt-24 sm:pb-12 lg:pt-32">
        <div className="container-editorial max-w-3xl">
          <p className="eyebrow-bar mb-4">Inbox</p>
          <h1 className="display-1 mb-4">Notifications.</h1>
          <p className="body-lg text-muted-foreground">
            Announcements from the team and important updates about your account.
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="pb-24">
        <div className="container-editorial max-w-3xl space-y-4">
          {isLoading && (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </>
          )}

          {!isLoading && (!data || data.length === 0) && (
            <div className="glass-strong rounded-3xl p-12 text-center">
              <div className="size-14 mx-auto rounded-2xl bg-primary/10 grid place-items-center text-primary">
                <Bell className="size-6" aria-hidden />
              </div>
              <h2 className="font-display text-2xl mt-5 mb-2">You're all caught up</h2>
              <p className="text-muted-foreground">
                New announcements will appear here.
              </p>
            </div>
          )}

          {data?.map((n) => (
            <article
              key={n.id}
              className="glass-strong rounded-2xl p-5 sm:p-6 flex gap-4 transition hover:translate-y-[-2px]"
            >
              <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
                {n.audience === "all" ? (
                  <Megaphone className="size-5" aria-hidden />
                ) : (
                  <Sparkles className="size-5" aria-hidden />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold truncate">{n.title}</h3>
                  <time className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(new Date(n.sent_at), { addSuffix: true })}
                  </time>
                </div>
                <p className="text-muted-foreground mt-1 whitespace-pre-line">{n.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>
    </AppLayout>
  );
};

export default Notifications;
