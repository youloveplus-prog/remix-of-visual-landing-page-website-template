/**
 * Canonical site URL. Update here when connecting a custom domain
 * (e.g. asikon.com) — every SEO consumer reads from this constant.
 */
export const SITE_URL = "https://style-verse-suite.lovable.app";

/** Build an absolute URL for the current site, given a path. */
export const siteUrl = (path = "/") =>
  `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
