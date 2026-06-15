import { useLocation } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { matchRedirect, matchRouteSeo } from "@/lib/route-seo";

/**
 * Mounts route-based default <SEO> tags for every page.
 *
 * Behavior:
 *  - Known route → emits the template's title/description, canonical = current URL.
 *  - Known redirect alias (e.g. /index → /, /faq → /help) → emits noindex and
 *    canonicalizes to the destination so crawlers consolidate signals.
 *  - Unknown path (will render <NotFound />) → emits noindex with no canonical;
 *    the NotFound page's own <Helmet> can still set a friendlier title.
 *
 * Pages can render their own <SEO> with richer data — react-helmet-async dedupes
 * meta tags by name/property so the per-page values win.
 */
export function RouteSEO() {
  const { pathname } = useLocation();

  // 1. Redirect aliases: noindex + canonical to the real destination.
  const redirectTarget = matchRedirect(pathname);
  if (redirectTarget) {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    return (
      <SEO
        title="Redirecting…"
        description="This URL has moved. Redirecting to the current page."
        url={`${origin}${redirectTarget}`}
        noIndex
      />
    );
  }

  const tpl = matchRouteSeo(pathname);

  // 2. Unknown route → 404. Noindex, suppress canonical so we don't
  //    canonicalize a non-existent URL into the index.
  if (!tpl) {
    return (
      <SEO
        title="Page not found"
        description="The page you're looking for doesn't exist on Asikon."
        noIndex
        suppressCanonical
      />
    );
  }

  // 3. Known route → normal defaults.
  return (
    <SEO
      title={tpl.title}
      description={tpl.description}
      type={tpl.type}
      noIndex={tpl.noIndex}
    />
  );
}

export default RouteSEO;
