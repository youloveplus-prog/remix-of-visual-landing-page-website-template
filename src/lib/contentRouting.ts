/**
 * Canonical route resolver for content/product deep links.
 *
 * Every detail page is bound to a single content type:
 *   /courses/:slug   → kind === "course"
 *   /content/:slug   → kind ∈ {"digital","service"}
 *   /product/:slug   → kind ∈ {"product","ebook","bundle"} (storefront SKUs)
 *
 * When a slug is opened on the wrong route (e.g. user shares a course link as
 * /content/:slug, or a service link as /courses/:slug), the page calls this
 * helper to compute the correct canonical path and <Navigate replace> there.
 *
 * Returning `null` means "this route is correct for this kind — render".
 */
export type AnyContentKind =
  | "course"
  | "service"
  | "digital"
  | "ebook"
  | "bundle"
  | "product"
  | (string & {});

export type DetailRoute = "course" | "content" | "product";

const COURSE_ROUTE = (slug: string) => `/courses/${slug}`;
const CONTENT_ROUTE = (slug: string) => `/content/${slug}`;
const PRODUCT_ROUTE = (slug: string) => `/product/${slug}`;

/**
 * Given the current detail route and the actual `kind` of the loaded item,
 * return the canonical path the user should be on, or `null` if they're
 * already on the right page.
 *
 * `kind` may be `undefined` while data is still loading — we return `null` so
 * the page can render its skeleton, never bouncing prematurely.
 */
export function resolveContentRoute(
  currentRoute: DetailRoute,
  kind: AnyContentKind | null | undefined,
  slug: string,
): string | null {
  if (!kind || !slug) return null;

  switch (currentRoute) {
    case "course":
      // /courses/:slug is reserved exclusively for courses.
      if (kind === "course") return null;
      if (kind === "service" || kind === "digital") return CONTENT_ROUTE(slug);
      return PRODUCT_ROUTE(slug);

    case "content":
      // /content/:slug serves digital downloads & services. Courses get
      // bounced to /courses/:slug; storefront SKUs to /product/:slug.
      if (kind === "digital" || kind === "service") return null;
      if (kind === "course") return COURSE_ROUTE(slug);
      return PRODUCT_ROUTE(slug);

    case "product":
      // /product/:slug is for storefront SKUs only — never courses/services.
      if (kind === "course") return COURSE_ROUTE(slug);
      if (kind === "service" || kind === "digital") return CONTENT_ROUTE(slug);
      return null;
  }
}
