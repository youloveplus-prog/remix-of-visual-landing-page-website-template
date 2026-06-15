import { useLocation } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { matchRouteSeo } from "@/lib/route-seo";

/**
 * Mounts route-based default <SEO> tags for every page. Pages can render
 * their own <SEO> with richer data — react-helmet-async dedupes meta
 * tags by name/property so the per-page values win.
 */
export function RouteSEO() {
  const { pathname } = useLocation();
  const tpl = matchRouteSeo(pathname);
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
