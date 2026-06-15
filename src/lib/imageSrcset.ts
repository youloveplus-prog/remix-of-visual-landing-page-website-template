/**
 * Build a responsive srcset for an image URL.
 * - Supabase Storage public URLs are rewritten to the `/render/image/` transform
 *   endpoint with a `width=` query so the CDN returns appropriately sized variants.
 * - Non-Supabase URLs (external CDNs, bundled assets) return `undefined` so the
 *   browser falls back to the original `src`.
 */
const SUPABASE_PUBLIC_OBJECT = "/storage/v1/object/public/";
const SUPABASE_RENDER_IMAGE = "/storage/v1/render/image/public/";

export const HERO_WIDTHS = [640, 960, 1280, 1600, 1920, 2560] as const;

function toSupabaseTransformUrl(url: string, width: number): string | null {
  if (!url.includes(SUPABASE_PUBLIC_OBJECT)) return null;
  const base = url.replace(SUPABASE_PUBLIC_OBJECT, SUPABASE_RENDER_IMAGE);
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}width=${width}&resize=cover&quality=75`;
}

export function buildSrcSet(url: string, widths: readonly number[] = HERO_WIDTHS): string | undefined {
  const entries = widths
    .map((w) => {
      const variant = toSupabaseTransformUrl(url, w);
      return variant ? `${variant} ${w}w` : null;
    })
    .filter(Boolean) as string[];
  return entries.length ? entries.join(", ") : undefined;
}

export function transformedSrc(url: string, width: number): string {
  return toSupabaseTransformUrl(url, width) ?? url;
}
