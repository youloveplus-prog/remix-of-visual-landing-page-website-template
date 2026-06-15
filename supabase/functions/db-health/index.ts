import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const startedAt = Date.now();
    const { data, error } = await admin
      .schema("information_schema")
      .from("tables")
      .select("table_name")
      .eq("table_schema", "public");

    if (error) throw error;

    const tableNames = (data ?? []).map((r: any) => r.table_name).sort();

    // Fetch GRANT info for anon / authenticated / service_role on public tables
    const { data: grantRows } = await admin
      .schema("information_schema")
      .from("role_table_grants")
      .select("grantee,table_name,privilege_type")
      .eq("table_schema", "public")
      .in("grantee", ["anon", "authenticated", "service_role"]);

    type RoleSummary = {
      role: string;
      tables_with_any_grant: number;
      tables_missing_grants: string[];
      privileges: Record<string, number>; // SELECT/INSERT/UPDATE/DELETE counts
    };

    const roles = ["anon", "authenticated", "service_role"] as const;
    const grants: Record<string, RoleSummary> = {};
    for (const role of roles) {
      const rowsForRole = (grantRows ?? []).filter((r: any) => r.grantee === role);
      const tablesWithGrant = new Set(rowsForRole.map((r: any) => r.table_name));
      const privileges: Record<string, number> = {
        SELECT: 0,
        INSERT: 0,
        UPDATE: 0,
        DELETE: 0,
      };
      for (const r of rowsForRole as any[]) {
        if (privileges[r.privilege_type] !== undefined) privileges[r.privilege_type]++;
      }
      const missing = tableNames.filter((t) => !tablesWithGrant.has(t));
      grants[role] = {
        role,
        tables_with_any_grant: tablesWithGrant.size,
        tables_missing_grants: missing,
        privileges,
      };
    }

    return new Response(
      JSON.stringify({
        ok: true,
        table_count: tableNames.length,
        tables: tableNames,
        grants,
        latency_ms: Date.now() - startedAt,
        checked_at: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String((e as Error)?.message ?? e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
