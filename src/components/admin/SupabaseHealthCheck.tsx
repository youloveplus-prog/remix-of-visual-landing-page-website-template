import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface HealthResponse {
  ok: boolean;
  table_count?: number;
  tables?: string[];
  latency_ms?: number;
  checked_at?: string;
  error?: string;
}

export function SupabaseHealthCheck() {
  const { data, isLoading, isFetching, refetch, error } = useQuery<HealthResponse>({
    queryKey: ["supabase-health"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("db-health");
      if (error) throw error;
      return data as HealthResponse;
    },
    refetchInterval: 60_000,
  });

  const healthy = data?.ok && (data.table_count ?? 0) > 0;
  const empty = data?.ok && (data.table_count ?? 0) === 0;
  const failed = !!error || data?.ok === false;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm">Backend Health</h3>
          {healthy && (
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Healthy
            </Badge>
          )}
          {empty && (
            <Badge variant="destructive" className="gap-1 text-[10px]">
              <AlertTriangle className="w-3 h-3" /> Empty schema
            </Badge>
          )}
          {failed && (
            <Badge variant="destructive" className="gap-1 text-[10px]">
              <AlertTriangle className="w-3 h-3" /> Unreachable
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-7 px-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-12 w-full" />
      ) : failed ? (
        <p className="text-xs text-destructive">
          {(error as Error)?.message ?? data?.error ?? "Health check failed"}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tables</p>
            <p className="text-2xl font-display font-bold tracking-tight">
              {data?.table_count ?? 0}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Latency</p>
            <p className="text-2xl font-display font-bold tracking-tight">
              {data?.latency_ms ?? 0}
              <span className="text-xs text-muted-foreground ml-1">ms</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Checked</p>
            <p className="text-xs mt-2 text-muted-foreground">
              {data?.checked_at ? new Date(data.checked_at).toLocaleTimeString() : "—"}
            </p>
          </div>
        </div>
      )}

      {empty && (
        <p className="text-[11px] text-muted-foreground mt-3">
          The public schema has no tables. If you recently reverted, restore a snapshot from before
          the backend was wiped, or run your migrations to recreate the schema.
        </p>
      )}

      {healthy && data?.tables && data.tables.length > 0 && (
        <details className="mt-3">
          <summary className="text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">
            View {data.tables.length} tables
          </summary>
          <div className="mt-2 flex flex-wrap gap-1">
            {data.tables.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
