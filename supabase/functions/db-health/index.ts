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

    return new Response(
      JSON.stringify({
        ok: true,
        table_count: tableNames.length,
        tables: tableNames,
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
