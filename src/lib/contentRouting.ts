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

// ─────────────────────────────────────────────────────────────────────────────
// Telemetry: lightweight event fired when a deep-link slug is redirected
// because its content `kind` did not match the route it landed on.
//
// Pages call `useKindMismatchTelemetry(from, to, kind, slug)` once per render;
// the hook dedupes by (from→to|slug) so a single navigation produces exactly
// one event even under React StrictMode's double-invoke or re-renders.
// ─────────────────────────────────────────────────────────────────────────────

export interface KindMismatchEvent {
  /** Route the user opened. */
  from: DetailRoute;
  /** Canonical path we redirected them to. */
  to: string;
  /** The actual `kind` returned by the data source. */
  kind: AnyContentKind;
  /** The slug from the URL. */
  slug: string;
  /** ISO timestamp captured at log time. */
  at: string;
}

export type KindMismatchLogger = (event: KindMismatchEvent) => void;

const defaultLogger: KindMismatchLogger = (event) => {
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    try {
      window.dispatchEvent(
        new CustomEvent("asikon:kind-mismatch-redirect", { detail: event }),
      );
    } catch {
      /* CustomEvent not available — fall through to console */
    }
  }
  if (typeof console !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[content-routing] kind mismatch redirect", event);
  }
};

let activeLogger: KindMismatchLogger = defaultLogger;

/** Override the logger (tests only — call __resetKindMismatchLogger() after). */
export function __setKindMismatchLogger(fn: KindMismatchLogger): void {
  activeLogger = fn;
}

/** Restore the default logger. */
export function __resetKindMismatchLogger(): void {
  activeLogger = defaultLogger;
}

/** Direct emitter — exported for non-React callers. */
export function logKindMismatchRedirect(
  event: Omit<KindMismatchEvent, "at"> & { at?: string },
): void {
  activeLogger({ at: new Date().toISOString(), ...event });
}

// React hook lives in its own file to keep this module dependency-free for
// the static helper tests. See ./useKindMismatchTelemetry.
