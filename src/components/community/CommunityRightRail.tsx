import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Radio, ArrowUpRight, AlertCircle, type LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: string;
}

interface LiveSession {
  title: string;
  watching: number;
  thumbnail: string;
}

const CREATORS: Creator[] = [
  { id: "1", name: "Asikon Academy", username: "asikon_academy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", followers: "84k" },
  { id: "2", name: "Code With Rafi", username: "code_with_rafi", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop", followers: "32k" },
  { id: "3", name: "Study Smart BD", username: "studysmart_bd", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", followers: "21k" },
];

const TAGS = ["#aitutor", "#python", "#hsc", "#freelance", "#ml", "#prompts", "#bangla", "#productivity"];

const LIVE: LiveSession = {
  title: "AI Tutor Q&A — drop your doubts",
  watching: 132,
  thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=120&h=120&fit=crop",
};

export interface RightRailData {
  creators: Creator[];
  tags: string[];
  live: LiveSession | null;
}

export type RightRailFetcher = () => Promise<RightRailData>;

/**
 * Default fetcher — hardcoded content with a small simulated latency.
 * Replace by passing a real `fetcher` prop (e.g. backed by Supabase queries).
 */
const defaultFetcher: RightRailFetcher = () =>
  new Promise((resolve) => {
    window.setTimeout(
      () => resolve({ creators: CREATORS, tags: TAGS, live: LIVE }),
      200,
    );
  });

/**
 * Sticky right rail used on the community page on lg+ screens.
 * Each tile owns its own loading and empty state so the rail keeps
 * a consistent height and rhythm regardless of data availability.
 */
export function CommunityRightRail({
  fetcher = defaultFetcher,
}: {
  fetcher?: RightRailFetcher;
} = {}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [live, setLive] = useState<LiveSession | null>(null);

  async function load() {
    setError(false);
    setLoading(true);
    try {
      const data = await fetcher();
      setCreators(data.creators);
      setTags(data.tags);
      setLive(data.live);
    } catch {
      setCreators([]);
      setTags([]);
      setLive(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetcher();
        if (cancelled) return;
        setCreators(data.creators);
        setTags(data.tags);
        setLive(data.live);
      } catch {
        if (cancelled) return;
        setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  function handleRetry() {
    void load();
  }


  return (
    <aside
      className="hidden lg:block w-[320px] shrink-0 space-y-4 self-start sticky"
      style={{ top: "calc(var(--app-header-h) + 56px + 16px)" }}
      aria-label="Community sidebar"
    >
      {/* Creators */}
      <Tile icon={Sparkles} title="Creators to follow">
        {error ? (
          <ErrorRow message="Couldn't load creators." onRetry={handleRetry} />
        ) : loading ? (
          <CreatorListSkeleton count={3} />
        ) : creators.length === 0 ? (
          <EmptyRow message="No suggestions right now. Check back soon." />
        ) : (
          <ul className="space-y-3">
            {creators.map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/15 shrink-0">
                  <AvatarImage src={c.avatar} alt={c.name} />
                  <AvatarFallback>{c.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-[13px] truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    @{c.username} · {c.followers}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="h-8 px-3 text-[12px] shrink-0">
                  Follow
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Tile>

      {/* Tags */}
      <Tile icon={TrendingUp} title="Trending tags">
        {error ? (
          <ErrorRow message="Couldn't load trending tags." onRetry={handleRetry} />
        ) : loading ? (
          <TagCloudSkeleton count={8} />
        ) : tags.length === 0 ? (
          <EmptyRow message="No trending tags yet." />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Link
                key={t}
                to={`/community?tag=${t.replace("#", "")}`}
                className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-secondary/60 hover:bg-primary/10 hover:text-primary border border-border/60 transition-colors"
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </Tile>

      {/* Live now */}
      <Tile icon={Radio} title="Live now" accent>
        {error ? (
          <ErrorRow message="Couldn't load live sessions." onRetry={handleRetry} />
        ) : loading ? (
          <LiveRowSkeleton />
        ) : !live ? (
          <EmptyRow
            message="No one is live right now."
            sub="Follow creators to see them go live."
          />
        ) : (
          <Link
            to="/community?tab=live"
            className="group flex items-center gap-3 rounded-xl p-3 -m-1 hover:bg-secondary/40 transition-colors"
          >
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
              <img
                src={live.thumbnail}
                alt="Live"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-1 left-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-destructive text-destructive-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                LIVE
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[13px] truncate">{live.title}</p>
              <p className="text-[11px] text-muted-foreground">
                {live.watching} watching now
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </Link>
        )}
      </Tile>
    </aside>
  );
}

/* ------------------------------- Helpers ------------------------------- */

function Tile({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: LucideIcon;
  title: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <header className="flex items-center gap-2 mb-3">
        <Icon className={cn("h-4 w-4 shrink-0", accent ? "text-primary" : "text-foreground/60")} aria-hidden />
        <h3 className="font-medium text-[13px] tracking-tight">{title}</h3>
      </header>
      {children}
    </section>
  );
}

function EmptyRow({ message, sub }: { message: string; sub?: string }) {
  return (
    <div
      className="rounded-xl border border-dashed border-border/70 bg-background/40 px-3 py-4 text-center"
      role="status"
      aria-live="polite"
    >
      <p className="text-[12.5px] text-muted-foreground leading-snug">{message}</p>
      {sub && <p className="text-[11px] text-muted-foreground/70 mt-1">{sub}</p>}
    </div>
  );
}

function ErrorRow({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-dashed border-destructive/30 bg-destructive/[0.03] px-3 py-4 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-center gap-1.5 mb-2">
        <AlertCircle className="h-3.5 w-3.5 text-destructive/80" aria-hidden />
        <p className="text-[12.5px] text-destructive/90 leading-snug font-medium">{message}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-7 px-3 text-[11px] text-muted-foreground hover:text-foreground"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}

function CreatorListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="space-y-3" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-2.5 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16 rounded-md shrink-0" />
        </li>
      ))}
    </ul>
  );
}

function TagCloudSkeleton({ count = 8 }: { count?: number }) {
  // Vary widths so it doesn't look like a perfect grid.
  const widths = ["w-14", "w-20", "w-16", "w-24", "w-12", "w-20", "w-16", "w-14"];
  return (
    <div className="flex flex-wrap gap-1.5" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("h-6 rounded-full", widths[i % widths.length])} />
      ))}
    </div>
  );
}

function LiveRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 -m-1" aria-hidden>
      <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
      <Skeleton className="h-4 w-4 rounded-sm shrink-0" />
    </div>
  );
}
