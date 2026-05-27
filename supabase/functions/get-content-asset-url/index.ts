import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { asset_id } = await req.json();
    if (!asset_id || typeof asset_id !== "string") {
      return new Response(JSON.stringify({ error: "asset_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // identify caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes } = await userClient.auth.getUser();
    const userId = userRes?.user?.id ?? null;

    // service client for assured reads
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: asset, error: aerr } = await admin
      .from("content_assets")
      .select("id, item_id, storage_path, url, is_preview")
      .eq("id", asset_id)
      .maybeSingle();
    if (aerr || !asset) {
      return new Response(JSON.stringify({ error: "Asset not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // External URL? just return it.
    if (!asset.storage_path) {
      return new Response(JSON.stringify({ url: asset.url, expires_in: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Preview assets are open
    let allowed = !!asset.is_preview;

    if (!allowed && userId) {
      const { data: access } = await admin.rpc("has_content_access", {
        _user_id: userId,
        _item_id: asset.item_id,
      });
      allowed = !!access;
    }

    if (!allowed) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: signed, error: serr } = await admin.storage
      .from("content-media")
      .createSignedUrl(asset.storage_path, 60 * 60);

    if (serr || !signed) {
      return new Response(JSON.stringify({ error: serr?.message ?? "Failed to sign" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: signed.signedUrl, expires_in: 3600 }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
