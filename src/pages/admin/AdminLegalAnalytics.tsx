import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/transitions/Reveal";
import {
  Eye,
  MousePointerClick,
  Activity,
  FileText,
  ShieldCheck,
  RotateCcw,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const LEGAL_PAGES = [
  { slug: "terms", label: "Terms of Service", short: "Terms", icon: FileText, path: "/terms" },
  { slug: "privacy", label: "Privacy Policy", short: "Privacy", icon: ShieldCheck, path: "/privacy" },
  { slug: "refund", label: "Refunds", short: "Refunds", icon: RotateCcw, path: "/refund" },
] as const;

type Slug = (typeof LEGAL_PAGES)[number]["slug"];

interface ActivityRow {
  event_type: string;
  meta: Record<string, unknown> | null;
  created_at: string;
}

// ---------- Realtime presence (admin observer) ----------

function useLivePresence() {
  const [byPage, setByPage] = useState<Record<Slug, Record<number, number>>>({
    terms: {},
    privacy: {},
    refund: {},
  });

  useEffect(() => {
    const channels = LEGAL_PAGES.map(({ slug }) => {
      const ch = supabase.channel(`legal-presence:${slug}`, {
        config: { presence: { key: `admin-observer-${crypto.randomUUID()}` } },
      });

      const recompute = () => {
        const state = ch.presenceState() as Record<string, Array<{ section?: number; admin?: boolean }>>;
        const sections: Record<number, number> = {};
        for (const [key, arr] of Object.entries(state)) {
          if (key.startsWith("admin-observer-")) continue;
          const meta = arr[0];
          if (meta?.admin) continue;
          if (typeof meta?.section === "number") {
            sections[meta.section] = (sections[meta.section] ?? 0) + 1;
          }
        }
        setByPage((prev) => ({ ...prev, [slug]: sections }));
      };

      ch.on("presence", { event: "sync" }, recompute)
        .on("presence", { event: "join" }, recompute)
        .on("presence", { event: "leave" }, recompute)
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") await ch.track({ admin: true });
        });
      return ch;
    });

    return () => {
      for (const ch of channels) {
        void ch.untrack();
        void supabase.removeChannel(ch);
      }
    };
  }, []);

  const totals = useMemo(() => {
    const t: Record<Slug, number> = { terms: 0, privacy: 0, refund: 0 };
    for (const slug of Object.keys(byPage) as Slug[]) {
      t[slug] = Object.values(byPage[slug]).reduce((a, b) => a + b, 0);
    }
    return t;
  }, [byPage]);

  return { byPage, totals };
}

// ---------- Helpers ----------

function bucketDays(rows: { created_at: string }[], days = 30): number[] {
  const buckets = Array.from({ length: days }, () => 0);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  for (const r of rows) {
    const d = new Date(r.created_at);
    const diff = Math.floor((d.getTime() - start.getTime()) / 86400000);
    if (diff >= 0 && diff < days) buckets[diff] += 1;
  }
  return buckets;
}

function dayLabel(offsetFromStart: number, days = 30): string {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1) + offsetFromStart);
  return `${start.getMonth() + 1}/${start.getDate()}`;
}

// ---------- Page ----------

export default function AdminLegalAnalytics() {
  const { byPage: liveByPage, totals: liveTotals } = useLivePresence();
  const [activeSlug, setActiveSlug] = useState<Slug>("terms");

  const activityQ = useQuery({
    queryKey: ["analytics", "legal", "activity"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const { data, error } = await supabase
        .from("user_activity_log")
        .select("event_type,meta,created_at")
        .in("event_type", ["legal_section_viewed", "legal_toc_click", "legal_scroll_depth"])
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return (data ?? []) as ActivityRow[];
    },
    refetchInterval: 30_000,
  });

  const rows = activityQ.data ?? [];

  const aggregates = useMemo(() => {
    const out: Record<
      Slug,
      {
        sectionViews: Record<number, { count: number; title?: string }>;
        tocClicks: Record<number, { count: number; title?: string }>;
        depth: Record<number, number>;
        totalEvents: number;
        seriesViews: number[];
        seriesClicks: number[];
      }
    > = {
      terms: { sectionViews: {}, tocClicks: {}, depth: {}, totalEvents: 0, seriesViews: [], seriesClicks: [] },
      privacy: { sectionViews: {}, tocClicks: {}, depth: {}, totalEvents: 0, seriesViews: [], seriesClicks: [] },
      refund: { sectionViews: {}, tocClicks: {}, depth: {}, totalEvents: 0, seriesViews: [], seriesClicks: [] },
    };

    const viewsByPage: Record<Slug, { created_at: string }[]> = { terms: [], privacy: [], refund: [] };
    const clicksByPage: Record<Slug, { created_at: string }[]> = { terms: [], privacy: [], refund: [] };

    for (const r of rows) {
      const meta = (r.meta ?? {}) as { page?: string; section_index?: number; section_title?: string; depth?: number };
      const page = meta.page as Slug | undefined;
      if (!page || !(page in out)) continue;
      out[page].totalEvents += 1;

      if (r.event_type === "legal_section_viewed" && typeof meta.section_index === "number") {
        const b = out[page].sectionViews[meta.section_index] ?? { count: 0, title: meta.section_title };
        b.count += 1;
        if (meta.section_title) b.title = meta.section_title;
        out[page].sectionViews[meta.section_index] = b;
        viewsByPage[page].push({ created_at: r.created_at });
      } else if (r.event_type === "legal_toc_click" && typeof meta.section_index === "number") {
        const b = out[page].tocClicks[meta.section_index] ?? { count: 0, title: meta.section_title };
        b.count += 1;
        if (meta.section_title) b.title = meta.section_title;
        out[page].tocClicks[meta.section_index] = b;
        clicksByPage[page].push({ created_at: r.created_at });
      } else if (r.event_type === "legal_scroll_depth" && typeof meta.depth === "number") {
        out[page].depth[meta.depth] = (out[page].depth[meta.depth] ?? 0) + 1;
      }
    }

    for (const slug of Object.keys(out) as Slug[]) {
      out[slug].seriesViews = bucketDays(viewsByPage[slug], 30);
      out[slug].seriesClicks = bucketDays(clicksByPage[slug], 30);
    }
    return out;
  }, [rows]);

  const totalLiveNow = LEGAL_PAGES.reduce((a, p) => a + liveTotals[p.slug], 0);
  const totalViews30d = rows.filter((r) => r.event_type === "legal_section_viewed").length;
  const totalClicks30d = rows.filter((r) => r.event_type === "legal_toc_click").length;
  const ctr =
    totalViews30d > 0 ? Math.round((totalClicks30d / totalViews30d) * 100) : 0;

  const active = LEGAL_PAGES.find((p) => p.slug === activeSlug)!;
  const ActiveIcon = active.icon;
  const agg = aggregates[activeSlug];

  // Build ranked sections for active page
  const sectionKeys = Array.from(
    new Set([
      ...Object.keys(agg.sectionViews).map(Number),
      ...Object.keys(agg.tocClicks).map(Number),
      ...Object.keys(liveByPage[activeSlug]).map(Number),
    ])
  );
  const ranked = sectionKeys
    .map((idx) => ({
      idx,
      title:
        agg.sectionViews[idx]?.title ||
        agg.tocClicks[idx]?.title ||
        `Section ${idx}`,
      views: agg.sectionViews[idx]?.count ?? 0,
      clicks: agg.tocClicks[idx]?.count ?? 0,
      live: liveByPage[activeSlug][idx] ?? 0,
    }))
    .sort((a, b) => b.views - a.views || b.clicks - a.clicks);
  const maxRanked = Math.max(1, ...ranked.map((r) => r.views));

  // Heatmap data
  const maxHeat = Math.max(1, ...agg.seriesViews);

  return (
    <div className="space-y-8">
      {/* ===== Editorial header ===== */}
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-border/60 pb-8">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium mb-3">
            Legal · Analytics
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.05]">
            How people read your <span className="text-primary">legal pages</span>.
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Live presence and 30-day engagement across Terms, Privacy, and Refunds — sourced from
            Supabase Realtime and <span className="font-mono text-foreground/80">user_activity_log</span>.
          </p>
        </div>

        {/* Live counter — hero */}
        <div className="shrink-0 rounded-3xl border border-primary/30 bg-primary/5 px-6 py-5 min-w-[220px]">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-primary font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Reading right now
          </div>
          <p className="font-display text-5xl font-bold tracking-tight mt-2 tabular-nums">
            {totalLiveNow}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            across all three legal pages
          </p>
        </div>
      </header>

      {/* ===== Big KPI strip ===== */}
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/60 rounded-3xl overflow-hidden border border-border/60">
          <BigKpi
            label="Section views"
            value={totalViews30d}
            sub="last 30 days"
            icon={Eye}
          />
          <BigKpi
            label="TOC interactions"
            value={totalClicks30d}
            sub="last 30 days"
            icon={MousePointerClick}
          />
          <BigKpi
            label="Click-through rate"
            value={`${ctr}%`}
            sub="TOC clicks ÷ section views"
            icon={TrendingUp}
          />
        </div>
      </Reveal>

      {/* ===== Page selector tabs ===== */}
      <div className="flex flex-wrap gap-2">
        {LEGAL_PAGES.map((p) => {
          const Icon = p.icon;
          const isActive = p.slug === activeSlug;
          const live = liveTotals[p.slug];
          const total = aggregates[p.slug].seriesViews.reduce((a, b) => a + b, 0);
          return (
            <button
              key={p.slug}
              onClick={() => setActiveSlug(p.slug)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all",
                isActive
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/60 bg-card hover:border-border hover:bg-muted/40"
              )}
            >
              <div
                className={cn(
                  "rounded-xl p-2 transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className={cn("font-semibold text-sm", isActive ? "text-foreground" : "text-foreground/80")}>
                    {p.label}
                  </span>
                  {live > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary tabular-nums">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      {live} live
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground tabular-nums">
                  {total.toLocaleString()} views · 30d
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ===== Active page detail ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
        {/* Left: ranked sections leaderboard */}
        <div className="rounded-3xl border border-border/60 bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-border/60">
            <div className="flex items-center gap-3 min-w-0">
              <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                <ActiveIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-semibold text-lg truncate">{active.label}</h2>
                <p className="text-xs text-muted-foreground font-mono truncate">{active.path}</p>
              </div>
            </div>
            <Link
              to={active.path}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0"
            >
              View page <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold">Ranked sections</h3>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Activity className="h-2.5 w-2.5" /> Live
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-2.5 w-2.5" /> Views
                </span>
                <span className="inline-flex items-center gap-1">
                  <MousePointerClick className="h-2.5 w-2.5" /> Clicks
                </span>
              </div>
            </div>

            {activityQ.isLoading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : ranked.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                No events yet — engagement will appear once signed-in visitors land on this page.
              </p>
            ) : (
              <ul className="divide-y divide-border/50">
                {ranked.map((r, rank) => (
                  <li key={r.idx} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "shrink-0 grid place-items-center h-8 w-8 rounded-xl font-display font-bold tabular-nums text-sm",
                          rank === 0
                            ? "bg-primary text-primary-foreground"
                            : rank < 3
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {rank + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
                            {String(r.idx).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-medium truncate">{r.title}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/40 transition-all"
                            style={{ width: `${(r.views / maxRanked) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs tabular-nums shrink-0">
                        <Metric
                          icon={<Activity className="h-3 w-3" />}
                          value={r.live}
                          highlight={r.live > 0}
                        />
                        <Metric icon={<Eye className="h-3 w-3" />} value={r.views} />
                        <Metric icon={<MousePointerClick className="h-3 w-3" />} value={r.clicks} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right: heatmap + scroll depth */}
        <div className="space-y-6">
          {/* 30-day heatmap */}
          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-sm">Daily section views</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Last 30 days · hover for detail</p>
              </div>
              <span className="text-2xl font-display font-bold tabular-nums">
                {agg.seriesViews.reduce((a, b) => a + b, 0)}
              </span>
            </div>

            {activityQ.isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
                  {agg.seriesViews.map((v, i) => {
                    const intensity = v / maxHeat;
                    return (
                      <div
                        key={i}
                        title={`${dayLabel(i)} — ${v} views`}
                        className="aspect-square rounded-md border border-border/40 transition-transform hover:scale-110"
                        style={{
                          backgroundColor:
                            v === 0
                              ? "hsl(var(--muted) / 0.5)"
                              : `hsl(var(--primary) / ${0.15 + intensity * 0.85})`,
                        }}
                      />
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{dayLabel(0)}</span>
                  <div className="flex items-center gap-1.5">
                    <span>less</span>
                    {[0.15, 0.4, 0.65, 0.9, 1].map((o) => (
                      <span
                        key={o}
                        className="h-2.5 w-2.5 rounded-sm border border-border/40"
                        style={{ backgroundColor: `hsl(var(--primary) / ${o})` }}
                      />
                    ))}
                    <span>more</span>
                  </div>
                  <span>today</span>
                </div>
              </>
            )}
          </div>

          {/* Scroll depth funnel */}
          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-semibold text-sm">Scroll depth funnel</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  How far readers actually get
                </p>
              </div>
            </div>
            {(() => {
              const maxDepth = Math.max(1, ...[25, 50, 75, 100].map((m) => agg.depth[m] ?? 0));
              return (
                <div className="space-y-3">
                  {[25, 50, 75, 100].map((m) => {
                    const n = agg.depth[m] ?? 0;
                    const pct = (n / maxDepth) * 100;
                    return (
                      <div key={m}>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-mono text-muted-foreground tabular-nums">{m}%</span>
                          <span className="font-semibold tabular-nums">{n.toLocaleString()}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                            style={{ width: `${Math.max(2, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground border-t border-border/40 pt-4">
        Live counts come from Supabase Realtime presence on each legal page. Historical numbers
        aggregate <span className="font-mono">legal_section_viewed</span>,{" "}
        <span className="font-mono">legal_toc_click</span>, and{" "}
        <span className="font-mono">legal_scroll_depth</span> events from{" "}
        <span className="font-mono">user_activity_log</span> over the last 30 days. Anonymous visits
        are not stored historically.
      </p>
    </div>
  );
}

// ---------- Small components ----------

function BigKpi({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: any;
}) {
  return (
    <div className="bg-card px-6 py-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
          {label}
        </p>
        <div className="rounded-lg bg-muted p-1.5 text-foreground/70">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <p className="font-display text-4xl font-bold tracking-tight tabular-nums leading-none">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-xs text-muted-foreground mt-2">{sub}</p>
    </div>
  );
}

function Metric({
  icon,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  value: number;
  highlight?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 min-w-[36px] justify-end",
        highlight ? "text-primary font-semibold" : "text-muted-foreground"
      )}
    >
      {icon}
      {value}
    </span>
  );
}
