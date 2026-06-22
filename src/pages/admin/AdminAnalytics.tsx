import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/ui/section-header";
import { Sparkline } from "@/components/admin/Sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ShoppingBag, BookOpen, Coins, TrendingUp, Award } from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";

function bucketDays(rows: { created_at: string }[] | undefined | null, days = 30): number[] {
  const buckets = Array.from({ length: days }, () => 0);
  if (!rows?.length) return buckets;
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

function dayLabels(days = 30): string[] {
  const out: string[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    out.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  return out;
}

interface KpiProps {
  label: string;
  value: string | number;
  delta?: number;
  series: number[];
  icon: any;
  loading?: boolean;
}

const Kpi = ({ label, value, delta, series, icon: Icon, loading }: KpiProps) => {
  const trend = delta === undefined ? null : delta >= 0 ? "+" : "";
  return (
    <div className="glass rounded-2xl p-5 hover-lift">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-medium">{label}</p>
          {loading ? (
            <Skeleton className="h-8 w-20 mt-2" />
          ) : (
            <p className="text-3xl font-display font-bold tracking-tight mt-1">{value}</p>
          )}
          {delta !== undefined && !loading && (
            <p className={`text-[11px] mt-1 font-semibold ${delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {trend}
              {delta.toFixed(1)}% vs last period
            </p>
          )}
        </div>
        <div className="rounded-xl p-2 bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <Sparkline data={series} width={220} height={40} className="text-primary w-full" />
    </div>
  );
};

function ChartCard({
  title,
  series,
  loading,
  color = "hsl(var(--primary))",
}: {
  title: string;
  series: number[];
  loading?: boolean;
  color?: string;
}) {
  const labels = dayLabels(series.length);
  const max = Math.max(...series, 1);
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <span className="text-[11px] text-muted-foreground">Last 30 days</span>
      </div>
      {loading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <div className="flex items-end gap-[2px] h-32">
          {series.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all hover:opacity-100 opacity-80"
              style={{
                height: `${Math.max(2, (v / max) * 100)}%`,
                background: color,
              }}
              title={`${labels[i]}: ${v}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminAnalytics() {
  const usersQ = useQuery({
    queryKey: ["analytics", "users"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 60);
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", since.toISOString());
      if (error) throw error;
      return data ?? [];
    },
  });

  const ordersQ = useQuery({
    queryKey: ["analytics", "orders"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 60);
      const { data, error } = await supabase
        .from("orders")
        .select("created_at,total,payment_status")
        .gte("created_at", since.toISOString());
      if (error) throw error;
      return data ?? [];
    },
  });

  const lessonsQ = useQuery({
    queryKey: ["analytics", "lessons"],
    queryFn: async () => {
      const since = new Date();
      since.setDate(since.getDate() - 60);
      const { data, error } = await supabase
        .from("lesson_completions")
        .select("completed_at")
        .gte("completed_at", since.toISOString());
      if (error) throw error;
      return (data ?? []).map((r: any) => ({ created_at: r.completed_at }));
    },
  });

  const redemptionsQ = useQuery({
    queryKey: ["analytics", "redemptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reward_redemptions")
        .select("created_at,coins_spent,reward_key")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const usersSeries = bucketDays(usersQ.data, 30);
  const usersPrev = bucketDays(usersQ.data, 60).slice(0, 30);
  const ordersSeries = bucketDays(ordersQ.data, 30);
  const ordersPrev = bucketDays(ordersQ.data, 60).slice(0, 30);
  const lessonsSeries = bucketDays(lessonsQ.data, 30);
  const lessonsPrev = bucketDays(lessonsQ.data, 60).slice(0, 30);

  const delta = (cur: number[], prev: number[]) => {
    const c = cur.reduce((a, b) => a + b, 0);
    const p = prev.reduce((a, b) => a + b, 0);
    if (p === 0) return c > 0 ? 100 : 0;
    return ((c - p) / p) * 100;
  };

  const revenue = (ordersQ.data ?? [])
    .filter((o: any) => o.payment_status === "paid")
    .reduce((a: number, b: any) => a + Number(b.total ?? 0), 0);

  const coinsSpent = (redemptionsQ.data ?? []).reduce(
    (a: number, b: any) => a + Number(b.coins_spent ?? 0),
    0,
  );

  // Top redeemed rewards
  const rewardCounts = (redemptionsQ.data ?? []).reduce<Record<string, number>>((acc, r: any) => {
    acc[r.reward_key] = (acc[r.reward_key] ?? 0) + 1;
    return acc;
  }, {});
  const topRewards = Object.entries(rewardCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Analytics"
        title="Insights & trends"
        subtitle="Growth, engagement and economy at a glance."
      />

      <Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Kpi
            label="New Users"
            value={usersSeries.reduce((a, b) => a + b, 0)}
            delta={delta(usersSeries, usersPrev)}
            series={usersSeries}
            icon={Users}
            loading={usersQ.isLoading}
          />
          <Kpi
            label="Orders"
            value={ordersSeries.reduce((a, b) => a + b, 0)}
            delta={delta(ordersSeries, ordersPrev)}
            series={ordersSeries}
            icon={ShoppingBag}
            loading={ordersQ.isLoading}
          />
          <Kpi
            label="Lessons Done"
            value={lessonsSeries.reduce((a, b) => a + b, 0)}
            delta={delta(lessonsSeries, lessonsPrev)}
            series={lessonsSeries}
            icon={BookOpen}
            loading={lessonsQ.isLoading}
          />
          <Kpi
            label="Revenue (BDT)"
            value={`৳${revenue.toLocaleString()}`}
            series={ordersSeries}
            icon={TrendingUp}
            loading={ordersQ.isLoading}
          />
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="User signups" series={usersSeries} loading={usersQ.isLoading} />
        <ChartCard
          title="Orders"
          series={ordersSeries}
          loading={ordersQ.isLoading}
          color="hsl(var(--accent))"
        />
        <ChartCard
          title="Lesson completions"
          series={lessonsSeries}
          loading={lessonsQ.isLoading}
          color="hsl(142 76% 45%)"
        />
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold">Top redeemed rewards</h3>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Coins className="h-3 w-3 text-amber-400" />
              {coinsSpent.toLocaleString()} spent
            </span>
          </div>
          {redemptionsQ.isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : topRewards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No redemptions yet.</p>
          ) : (
            <ul className="space-y-2">
              {topRewards.map(([key, count]) => {
                const max = topRewards[0][1];
                return (
                  <li key={key} className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm truncate font-medium">{key}</span>
                        <span className="text-xs text-muted-foreground">{count}×</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/60"
                          style={{ width: `${(count / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
