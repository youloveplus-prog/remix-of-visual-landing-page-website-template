import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  type LiveActivity,
  privatizeName,
} from "@/lib/live-activity";
import { useLiveActivitySettings } from "./useLiveActivitySettings";

interface ProfileLite { display_name: string | null }
interface ProductLite { id: string; name: string }
interface ContentLite { id: string; title: string }

async function fetchPurchases(sinceIso: string, limit: number): Promise<LiveActivity[]> {
  const { data: orders, error } = await (supabase as any)
    .from("orders")
    .select("id, user_id, created_at, order_items(product_id)")
    .gte("created_at", sinceIso)
    .in("payment_status", ["paid", "completed"])
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !orders?.length) return [];

  const userIds = Array.from(new Set(orders.map((o: any) => o.user_id).filter(Boolean)));
  const productIds = Array.from(
    new Set(orders.flatMap((o: any) => (o.order_items ?? []).map((i: any) => i.product_id)).filter(Boolean)),
  );

  const [profilesRes, productsRes] = await Promise.all([
    userIds.length
      ? (supabase as any).from("profiles").select("id, display_name").in("id", userIds)
      : Promise.resolve({ data: [] as any[] }),
    productIds.length
      ? (supabase as any).from("products").select("id, name").in("id", productIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const profileMap = new Map<string, ProfileLite>(
    (profilesRes.data ?? []).map((p: any) => [p.id, p]),
  );
  const productMap = new Map<string, ProductLite>(
    (productsRes.data ?? []).map((p: any) => [p.id, p]),
  );

  return orders.map((o: any): LiveActivity | null => {
    const firstItem = o.order_items?.[0];
    const product = firstItem ? productMap.get(firstItem.product_id) : null;
    if (!product) return null;
    return {
      id: `purchase-${o.id}`,
      kind: "purchase",
      name: privatizeName(profileMap.get(o.user_id)?.display_name),
      item: product.name,
      occurredAt: o.created_at,
    };
  }).filter(Boolean) as LiveActivity[];
}

async function fetchReviews(sinceIso: string, limit: number): Promise<LiveActivity[]> {
  const { data, error } = await (supabase as any)
    .from("product_reviews")
    .select("id, product_id, user_id, rating, created_at")
    .gte("created_at", sinceIso)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return [];

  const userIds = Array.from(new Set(data.map((r: any) => r.user_id).filter(Boolean)));
  const productIds = Array.from(new Set(data.map((r: any) => r.product_id).filter(Boolean)));

  const [profilesRes, productsRes] = await Promise.all([
    userIds.length
      ? (supabase as any).from("profiles").select("id, display_name").in("id", userIds)
      : Promise.resolve({ data: [] as any[] }),
    productIds.length
      ? (supabase as any).from("products").select("id, name").in("id", productIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const profileMap = new Map<string, ProfileLite>(
    (profilesRes.data ?? []).map((p: any) => [p.id, p]),
  );
  const productMap = new Map<string, ProductLite>(
    (productsRes.data ?? []).map((p: any) => [p.id, p]),
  );

  return data.map((r: any): LiveActivity | null => {
    const product = productMap.get(r.product_id);
    if (!product) return null;
    return {
      id: `review-${r.id}`,
      kind: "review",
      name: privatizeName(profileMap.get(r.user_id)?.display_name),
      item: product.name,
      rating: r.rating ?? 5,
      occurredAt: r.created_at,
    };
  }).filter(Boolean) as LiveActivity[];
}

async function fetchEnrolments(sinceIso: string, limit: number): Promise<LiveActivity[]> {
  const { data, error } = await (supabase as any)
    .from("content_purchases")
    .select("id, user_id, item_id, granted_at")
    .gte("granted_at", sinceIso)
    .order("granted_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return [];

  const userIds = Array.from(new Set(data.map((r: any) => r.user_id).filter(Boolean)));
  const itemIds = Array.from(new Set(data.map((r: any) => r.item_id).filter(Boolean)));

  const [profilesRes, itemsRes] = await Promise.all([
    userIds.length
      ? (supabase as any).from("profiles").select("id, display_name").in("id", userIds)
      : Promise.resolve({ data: [] as any[] }),
    itemIds.length
      ? (supabase as any).from("content_items").select("id, title").in("id", itemIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const profileMap = new Map<string, ProfileLite>(
    (profilesRes.data ?? []).map((p: any) => [p.id, p]),
  );
  const itemMap = new Map<string, ContentLite>(
    (itemsRes.data ?? []).map((i: any) => [i.id, i]),
  );

  return data.map((r: any): LiveActivity | null => {
    const item = itemMap.get(r.item_id);
    if (!item) return null;
    return {
      id: `enrolment-${r.id}`,
      kind: "enrolment",
      name: privatizeName(profileMap.get(r.user_id)?.display_name),
      item: item.title,
      occurredAt: r.granted_at,
    };
  }).filter(Boolean) as LiveActivity[];
}

async function fetchMilestones(sinceIso: string, limit: number): Promise<LiveActivity[]> {
  const { data, error } = await (supabase as any)
    .from("lesson_completions")
    .select("id, user_id, lesson_id, completed_at, xp_awarded")
    .gte("completed_at", sinceIso)
    .order("completed_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return [];

  const userIds = Array.from(new Set(data.map((r: any) => r.user_id).filter(Boolean)));
  const lessonIds = Array.from(new Set(data.map((r: any) => r.lesson_id).filter(Boolean)));

  const [profilesRes, lessonsRes] = await Promise.all([
    userIds.length
      ? (supabase as any).from("profiles").select("id, display_name").in("id", userIds)
      : Promise.resolve({ data: [] as any[] }),
    lessonIds.length
      ? (supabase as any).from("lessons").select("id, title").in("id", lessonIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const profileMap = new Map<string, ProfileLite>(
    (profilesRes.data ?? []).map((p: any) => [p.id, p]),
  );
  const lessonMap = new Map<string, { id: string; title: string }>(
    (lessonsRes.data ?? []).map((l: any) => [l.id, l]),
  );

  return data.map((r: any): LiveActivity => {
    const lesson = lessonMap.get(r.lesson_id);
    return {
      id: `milestone-${r.id}`,
      kind: "milestone",
      name: privatizeName(profileMap.get(r.user_id)?.display_name),
      item: lesson
        ? `completed “${lesson.title}”${r.xp_awarded ? ` · +${r.xp_awarded} XP` : ""}`
        : "completed a lesson",
      occurredAt: r.completed_at,
    };
  });
}

/**
 * Aggregated live activity feed (purchases, reviews, enrolments, milestones)
 * filtered by the admin-controlled `live_activity_settings`. Polls every 30s
 * and subscribes to realtime changes on the source tables.
 */
export function useLiveActivity(max = 20) {
  const { data: settings } = useLiveActivitySettings();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["live-activity", settings],
    enabled: !!settings,
    refetchInterval: 30_000,
    queryFn: async (): Promise<LiveActivity[]> => {
      if (!settings) return [];
      const sinceIso = new Date(Date.now() - settings.feed_window_hours * 3600_000).toISOString();
      const perSource = Math.max(8, Math.ceil(max / 2));

      const tasks: Promise<LiveActivity[]>[] = [];
      if (settings.purchases_enabled) tasks.push(fetchPurchases(sinceIso, perSource));
      if (settings.reviews_enabled) tasks.push(fetchReviews(sinceIso, perSource));
      if (settings.enrolments_enabled) tasks.push(fetchEnrolments(sinceIso, perSource));
      if (settings.milestones_enabled) tasks.push(fetchMilestones(sinceIso, perSource));

      const buckets = await Promise.all(tasks.map((p) => p.catch(() => [])));
      return buckets
        .flat()
        .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
        .slice(0, max);
    },
  });

  // Realtime: refresh feed when any source table changes.
  useEffect(() => {
    const channel = supabase
      .channel(`live-activity-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, () => {
        qc.invalidateQueries({ queryKey: ["live-activity"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "product_reviews" }, () => {
        qc.invalidateQueries({ queryKey: ["live-activity"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "content_purchases" }, () => {
        qc.invalidateQueries({ queryKey: ["live-activity"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "lesson_completions" }, () => {
        qc.invalidateQueries({ queryKey: ["live-activity"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return query;
}
