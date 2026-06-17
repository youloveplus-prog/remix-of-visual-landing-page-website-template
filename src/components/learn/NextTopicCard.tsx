import { Link } from "react-router-dom";
import { Compass, ArrowUpRight } from "lucide-react";
import { useNextTopic } from "@/hooks/useMastery";
import { MobileCard } from "@/components/ui/mobile-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Mastery-driven "next best topic" recommendation.
 * Renders nothing if the learner has no eligible topic (e.g. no curriculum
 * tagged yet or every topic is already mastered).
 */
export function NextTopicCard({ className }: { className?: string }) {
  const { data, isLoading } = useNextTopic();

  if (isLoading) {
    return <Skeleton className={cn("h-24 w-full rounded-3xl", className)} />;
  }
  if (!data) return null;

  const pct = Math.round(data.mastery_score);

  return (
    <Link
      to={`/ai-tutor?topic=${encodeURIComponent(data.slug)}`}
      className={cn("block group", className)}
    >
      <MobileCard
        variant="glass"
        className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
      >
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <span
              aria-hidden
              className="absolute inset-0 -m-2 rounded-full blur-xl bg-primary/30 opacity-70"
            />
            <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground shadow-sm">
              <Compass className="h-5 w-5" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-primary">
              Next for you
            </p>
            <h3 className="font-display text-base font-semibold leading-tight mt-0.5 truncate">
              {data.display_name}
            </h3>
            <p className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">
              {[data.subject, data.chapter].filter(Boolean).join(" · ") || data.reason}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.max(4, pct)}%` }}
                />
              </div>
              <span className="text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </MobileCard>
    </Link>
  );
}
