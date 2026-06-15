import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileCode2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface RoleGrantSummary {
  role: string;
  tables_with_any_grant: number;
  tables_missing_grants: string[];
  privileges: Record<"SELECT" | "INSERT" | "UPDATE" | "DELETE", number>;
}

interface HealthResponse {
  ok: boolean;
  table_count?: number;
  tables?: string[];
  grants?: Record<"anon" | "authenticated" | "service_role", RoleGrantSummary>;
  latency_ms?: number;
  checked_at?: string;
  error?: string;
}

// Expected baseline for a fully-restored StyleVerse backend.
// Update this if the canonical migration set changes.
const EXPECTED_TABLE_COUNT = 50;

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
              <span className="text-xs text-muted-foreground ml-1 font-normal">
                / {EXPECTED_TABLE_COUNT}
              </span>
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

      {!isLoading && !failed && (data?.table_count ?? 0) < EXPECTED_TABLE_COUNT && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-3">
          Expected ~{EXPECTED_TABLE_COUNT} tables in <code className="font-mono">public</code>.
          {empty
            ? " Schema is empty — restore a pre-wipe snapshot or re-run migrations."
            : ` Missing ~${EXPECTED_TABLE_COUNT - (data?.table_count ?? 0)} — some migrations may not have applied.`}
        </p>
      )}

      {/* Readiness checks — surface what must be true for the app to function */}
      <div className="mt-3 pt-3 border-t border-border/40 space-y-1.5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          Readiness checks
        </p>
        <a
          href="https://supabase.com/docs/guides/auth/row-level-security"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="flex-1">RLS enabled + policies on every public table</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
        <a
          href="https://supabase.com/docs/guides/api/rest/generating-types"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <FileCode2 className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="flex-1">
            Types regenerated (<code className="font-mono">src/integrations/supabase/types.ts</code>)
          </span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
        <a
          href="https://supabase.com/docs/guides/database/postgres/row-level-security#grants"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="flex-1">GRANTs applied for anon / authenticated / service_role</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      </div>

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
