import { supabase } from "@/integrations/supabase/client";

/**
 * Resolves `storage://<bucket>/<path>` references into signed URLs.
 *
 * Seed buckets (seed-images, seed-videos) are private but RLS-permitted for
 * anon SELECT, so signed URLs work without an authenticated session and can
 * be embedded directly in <img>/<video> tags.
 */

const SIGN_TTL_SECONDS = 60 * 60 * 24 * 7; // 1 week
const cache = new Map<string, { url: string; expiresAt: number }>();

export function parseStorageRef(ref: string | null | undefined): { bucket: string; path: string } | null {
  if (!ref || typeof ref !== "string") return null;
  if (!ref.startsWith("storage://")) return null;
  const rest = ref.slice("storage://".length);
  const slash = rest.indexOf("/");
  if (slash <= 0) return null;
  return { bucket: rest.slice(0, slash), path: rest.slice(slash + 1) };
}

export function isStorageRef(ref: string | null | undefined): boolean {
  return parseStorageRef(ref) !== null;
}

/** Returns a signed URL for a single storage ref, with in-memory caching. */
export async function resolveStorageUrl(ref: string): Promise<string> {
  const parsed = parseStorageRef(ref);
  if (!parsed) return ref;
  const key = `${parsed.bucket}/${parsed.path}`;
  const hit = cache.get(key);
  const now = Date.now();
  if (hit && hit.expiresAt > now + 60_000) return hit.url;

  const { data, error } = await supabase.storage
    .from(parsed.bucket)
    .createSignedUrl(parsed.path, SIGN_TTL_SECONDS);
  if (error || !data?.signedUrl) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[resolveStorageUrl] failed", ref, error);
    }
    return ref;
  }
  cache.set(key, { url: data.signedUrl, expiresAt: now + SIGN_TTL_SECONDS * 1000 });
  return data.signedUrl;
}

/** Bulk variant: signs many paths in one round-trip per bucket. */
export async function resolveStorageUrls(refs: (string | null | undefined)[]): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const now = Date.now();
  const byBucket = new Map<string, string[]>();

  for (const ref of refs) {
    if (!ref) continue;
    const parsed = parseStorageRef(ref);
    if (!parsed) continue;
    const cacheKey = `${parsed.bucket}/${parsed.path}`;
    const hit = cache.get(cacheKey);
    if (hit && hit.expiresAt > now + 60_000) {
      out.set(ref, hit.url);
      continue;
    }
    const list = byBucket.get(parsed.bucket) ?? [];
    list.push(parsed.path);
    byBucket.set(parsed.bucket, list);
  }

  for (const [bucket, paths] of byBucket) {
    const uniquePaths = Array.from(new Set(paths));
    const { data, error } = await supabase.storage.from(bucket).createSignedUrls(uniquePaths, SIGN_TTL_SECONDS);
    if (error || !data) continue;
    for (const row of data) {
      if (!row.path || !row.signedUrl) continue;
      const ref = `storage://${bucket}/${row.path}`;
      cache.set(`${bucket}/${row.path}`, { url: row.signedUrl, expiresAt: now + SIGN_TTL_SECONDS * 1000 });
      out.set(ref, row.signedUrl);
    }
  }
  return out;
}

/**
 * Mutates each row's `image_url` (and optional extra string fields) in-place,
 * replacing `storage://...` refs with signed URLs. Returns the same array.
 */
export async function resolveProductImageUrls<T extends { image_url?: string | null }>(
  rows: T[],
  extraFields: (keyof T)[] = [],
): Promise<T[]> {
  if (!rows.length) return rows;
  const refs: string[] = [];
  for (const r of rows) {
    if (r.image_url && isStorageRef(r.image_url)) refs.push(r.image_url);
    for (const f of extraFields) {
      const v = r[f] as unknown;
      if (typeof v === "string" && isStorageRef(v)) refs.push(v);
    }
  }
  if (!refs.length) return rows;
  const map = await resolveStorageUrls(refs);
  for (const r of rows) {
    if (r.image_url && map.has(r.image_url)) {
      (r as any).image_url = map.get(r.image_url);
    }
    for (const f of extraFields) {
      const v = r[f] as unknown;
      if (typeof v === "string" && map.has(v)) {
        (r as any)[f] = map.get(v);
      }
    }
  }
  return rows;
}
