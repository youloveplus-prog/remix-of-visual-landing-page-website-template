import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/transitions/Reveal";
import { Sparkline } from "@/components/admin/Sparkline";
import { Eye, MousePointerClick, Activity, ScrollText, FileText, ShieldCheck, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const LEGAL_PAGES = [
  { slug: "terms", label: "Terms of Service", icon: FileText, path: "/terms" },
  { slug: "privacy", label: "Privacy Policy", icon: ShieldCheck, path: "/privacy" },
  { slug: "refund", label: "Refunds", icon: RotateCcw, path: "/refund" },
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
        // Observer key — admin should not appear as a counted reader on the
        // public page, but presence requires a key. Use a deterministic
        // admin-prefixed key so we can filter it out if needed.
        config: { presence: { key: `admin-observer-${crypto.randomUUID()}` } },
      });

      const recompute = () => {
        const state = ch.presenceState() as Record<string, Array<{ section?: number }>>;
        const sections: Record<number, number> = {};
        for (const [key, arr] of Object.entries(state)) {
          if (key.startsWith("admin-observer-")) continue;
          const meta = arr[0];
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
          if (status === "SUBSCRIBED") {
            // Track with no section so we don't pollute counts.
            await ch.track({ admin: true });
          }
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

// ---------- Historical activity log ----------

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

export default function AdminLegalAnalytics() {
  const { byPage: liveByPage, totals: liveTotals } = useLivePresence();

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

  // Aggregate per page + section
  const aggregates = useMemo(() => {
    const out: Record<
      Slug,
      {
        sectionViews: Record<number, { count: number; title?: string }>;
        tocClicks: Record<number, { count: number; title?: string }>;
        depth: Record<number, number>; // 25/50/75/100 -> count
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
        const bucket = out[page].sectionViews[meta.section_index] ?? { count: 0, title: meta.section_title };
        bucket.count += 1;
        if (meta.section_title) bucket.title = meta.section_title;
        out[page].sectionViews[meta.section_index] = bucket;
        viewsByPage[page].push({ created_at: r.created_at });
      } else if (r.event_type === "legal_toc_click" && typeof meta.section_index === "number") {
        const bucket = out[page].tocClicks[meta.section_index] ?? { count: 0, title: meta.section_title };
        bucket.count += 1;
        if (meta.section_title) bucket.title = meta.section_title;
        out[page].tocClicks[meta.section_index] = bucket;
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

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Legal Analytics"
        title="Section views & engagement"
        subtitle="Live presence on legal pages plus 30-day historical activity from the activity log."
      />

      {/* Top KPIs */}
      <Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiTile
            label="Reading right now"
            value={totalLiveNow}
            icon={Activity}
            tint="primary"
            live
          />
          <KpiTile
            label="Section views (30d)"
            value={totalViews30d.toLocaleString()}
            icon={Eye}
            tint="emerald"
          />
          <KpiTile
            label="TOC clicks (30d)"
            value={totalClicks30d.toLocaleString()}
            icon={MousePointerClick}
            tint="amber"
          />
        </div>
      </Reveal>

      {/* Per-page panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {LEGAL_PAGES.map((p) => {
          const agg = aggregates[p.slug];
          const liveSections = liveByPage[p.slug];
          const liveTotal = liveTotals[p.slug];
          const Icon = p.icon;
          const sectionKeys = Array.from(
            new Set([
              ...Object.keys(agg.sectionViews).map(Number),
              ...Object.keys(agg.tocClicks).map(Number),
              ...Object.keys(liveSections).map(Number),
            ])
          ).sort((a, b) => a - b);

          const maxViews = Math.max(1, ...Object.values(agg.sectionViews).map((s) => s.count));

          return (
            <div key={p.slug} className="glass rounded-2xl p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-1.5 bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display font-semibold text-base truncate">{p.label}</h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 font-mono">{p.path}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                    liveTotal > 0
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                  title="Concurrent readers"
                >
                  {liveTotal > 0 && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                  )}
                  {liveTotal} live
                </span>
              </div>

              {/* 30-day sparkline */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Section views · 30d
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {agg.seriesViews.reduce((a, b) => a + b, 0)}
                  </span>
                </div>
                {activityQ.isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Sparkline data={agg.seriesViews} width={300} height={40} className="text-primary w-full" />
                )}
              </div>

              {/* Per-section breakdown */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    By section
                  </span>
                  <span className="text-[10px] text-muted-foreground">live · views · clicks</span>
                </div>
                {activityQ.isLoading ? (
                  <div className="space-y-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-7 w-full" />
                    ))}
                  </div>
                ) : sectionKeys.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No data yet — events appear once visitors land on this page.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {sectionKeys.map((idx) => {
                      const v = agg.sectionViews[idx]?.count ?? 0;
                      const c = agg.tocClicks[idx]?.count ?? 0;
                      const live = liveSections[idx] ?? 0;
                      const title =
                        agg.sectionViews[idx]?.title ||
                        agg.tocClicks[idx]?.title ||
                        `Section ${idx}`;
                      return (
                        <li key={idx} className="group">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="tabular-nums text-[10px] text-muted-foreground w-5">
                              {String(idx).padStart(2, "0")}
                            </span>
                            <span className="flex-1 text-xs truncate">{title}</span>
                            <span className="flex items-center gap-2 text-[11px] tabular-nums">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full",
                                  live > 0 ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground/50"
                                )}
                              >
                                <Activity className="h-2.5 w-2.5" />
                                {live}
                              </span>
                              <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                                <Eye className="h-2.5 w-2.5" />
                                {v}
                              </span>
                              <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                                <MousePointerClick className="h-2.5 w-2.5" />
                                {c}
                              </span>
                            </span>
                          </div>
                          <div className="h-1 rounded-full bg-muted overflow-hidden ml-7">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-primary/50 transition-all"
                              style={{ width: `${(v / maxViews) * 100}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Scroll depth */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                    Scroll depth · 30d
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[25, 50, 75, 100].map((m) => {
                    const n = agg.depth[m] ?? 0;
                    return (
                      <div key={m} className="rounded-lg bg-muted/60 px-2 py-2 text-center">
                        <div className="text-[10px] text-muted-foreground font-medium">{m}%</div>
                        <div className="text-sm font-display font-semibold tabular-nums">{n}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Live counts come from Supabase Realtime presence on each legal page. Historical numbers are
        aggregated from <span className="font-mono">user_activity_log</span> events (
        <span className="font-mono">legal_section_viewed</span>,{" "}
        <span className="font-mono">legal_toc_click</span>,{" "}
        <span className="font-mono">legal_scroll_depth</span>) for the last 30 days. Anonymous
        visits are not stored historically — only logged-in readers contribute to the 30-day numbers.
      </p>
    </div>
  );
}

function KpiTile({
  label,
  value,
  icon: Icon,
  tint,
  live,
}: {
  label: string;
  value: string | number;
  icon: any;
  tint: "primary" | "emerald" | "amber";
  live?: boolean;
}) {
  const tintClass = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-500",
    amber: "bg-amber-500/10 text-amber-500",
  }[tint];
  return (
    <div className="glass rounded-2xl p-5 hover-lift">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">
            {label}
          </p>
          <p className="text-3xl font-display font-bold tracking-tight mt-1 tabular-nums">{value}</p>
          {live && (
            <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Updating live
            </span>
          )}
        </div>
        <div className={cn("rounded-xl p-2", tintClass)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
