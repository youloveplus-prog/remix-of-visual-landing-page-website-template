import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useSkillMap } from "@/hooks/useSkillMap";

export function SkillMap() {
  const { data, isLoading } = useSkillMap();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-2xl" />;
  if (!data || data.length === 0) return null;

  // Recharts needs at least 3 axes for a nice radar; fallback to bars otherwise
  const chartData = data.map((p) => ({ subject: p.track_name, mastery: p.mastery }));

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-semibold">Skill map</h3>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Mastery
        </span>
      </div>
      {chartData.length >= 3 ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
                axisLine={false}
              />
              <Radar
                dataKey="mastery"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((p) => (
            <div key={p.track_id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="truncate">{p.track_name}</span>
                <span className="tabular-nums text-muted-foreground">{p.mastery}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${p.mastery}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
