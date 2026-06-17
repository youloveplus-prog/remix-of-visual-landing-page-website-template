/**
 * Category-aware product CTA resolver.
 *
 * Pure — no React imports, fully unit-testable.
 *
 * Resolution order:
 *   1. explicit category slug (`courses`, `books`, `prompts`, ...)
 *   2. explicit ProductKind (`course` / `ebook` / `service` / `bundle`)
 *   3. category name keyword match (legacy/free-text rows)
 *   4. product-name keyword match (last-resort heuristic)
 *   5. generic fallback
 *
 * The returned shape intentionally uses string icon names instead of React
 * components so this file stays renderer-agnostic. Components map the name to
 * a lucide-react icon at the call site (see ProductCtaButton).
 */

export type ProductCtaKind =
  | "course"
  | "book"
  | "prompt"
  | "ai-tutor"
  | "kit"
  | "gadget"
  | "mentorship"
  | "generic";

export type ProductCtaIcon =
  | "graduation-cap"
  | "book-open"
  | "download"
  | "sparkles"
  | "package"
  | "cpu"
  | "users"
  | "arrow-up-right";

export interface ProductCta {
  kind: ProductCtaKind;
  /** Primary action label, e.g. "Enroll now". */
  primaryLabel: string;
  /** Short variant for cramped UIs, e.g. "Enroll". */
  primaryShortLabel: string;
  /** Secondary/exploratory action, e.g. "Preview chapter". */
  secondaryLabel: string;
  /** Icon name — map to a real icon at the call site. */
  icon: ProductCtaIcon;
  /** Shown when the user already owns this item. */
  ownedLabel: string;
  /** Where "owned" CTAs navigate to. */
  ownedHref: string;
}

const CTA_BY_KIND: Record<ProductCtaKind, ProductCta> = {
  course: {
    kind: "course",
    primaryLabel: "Enroll now",
    primaryShortLabel: "Enroll",
    secondaryLabel: "Start free preview",
    icon: "graduation-cap",
    ownedLabel: "Continue learning",
    ownedHref: "/learn",
  },
  book: {
    kind: "book",
    primaryLabel: "Read now",
    primaryShortLabel: "Read",
    secondaryLabel: "Preview chapter",
    icon: "book-open",
    ownedLabel: "Open in reader",
    ownedHref: "/library",
  },
  prompt: {
    kind: "prompt",
    primaryLabel: "Download pack",
    primaryShortLabel: "Download",
    secondaryLabel: "Copy sample",
    icon: "download",
    ownedLabel: "Download again",
    ownedHref: "/library",
  },
  "ai-tutor": {
    kind: "ai-tutor",
    primaryLabel: "Start chatting",
    primaryShortLabel: "Chat",
    secondaryLabel: "Try a demo",
    icon: "sparkles",
    ownedLabel: "Open AI Tutor",
    ownedHref: "/tutor",
  },
  kit: {
    kind: "kit",
    primaryLabel: "Get the kit",
    primaryShortLabel: "Get kit",
    secondaryLabel: "What's inside",
    icon: "package",
    ownedLabel: "Download files",
    ownedHref: "/library",
  },
  gadget: {
    kind: "gadget",
    primaryLabel: "Get blueprint",
    primaryShortLabel: "Get",
    secondaryLabel: "View specs",
    icon: "cpu",
    ownedLabel: "Download files",
    ownedHref: "/library",
  },
  mentorship: {
    kind: "mentorship",
    primaryLabel: "Book a mentor",
    primaryShortLabel: "Book",
    secondaryLabel: "Join waitlist",
    icon: "users",
    ownedLabel: "View bookings",
    ownedHref: "/mentorship",
  },
  generic: {
    kind: "generic",
    primaryLabel: "Get access",
    primaryShortLabel: "Get",
    secondaryLabel: "Learn more",
    icon: "arrow-up-right",
    ownedLabel: "Open in library",
    ownedHref: "/library",
  },
};

const SLUG_TO_KIND: Record<string, ProductCtaKind> = {
  courses: "course",
  course: "course",
  bootcamp: "course",
  classes: "course",
  books: "book",
  book: "book",
  ebook: "book",
  ebooks: "book",
  prompts: "prompt",
  "prompt-library": "prompt",
  "prompt-pack": "prompt",
  "ai-tutor": "ai-tutor",
  tutor: "ai-tutor",
  kits: "kit",
  "student-kits": "kit",
  gadgets: "gadget",
  gadget: "gadget",
  hardware: "gadget",
  mentorship: "mentorship",
  mentor: "mentorship",
  mentors: "mentorship",
};

const KIND_FROM_PRODUCT_KIND: Record<string, ProductCtaKind> = {
  course: "course",
  ebook: "book",
  service: "mentorship",
  bundle: "generic",
};

const NAME_KEYWORDS: Array<[RegExp, ProductCtaKind]> = [
  [/\b(courses?|masterclass|bootcamp|specialization|workshop)\b/i, "course"],
  [/\b(books?|hardcover|edition|guides?|handbook|cookbook|ebooks?)\b/i, "book"],
  [/\b(prompts?|prompt pack)\b/i, "prompt"],
  [/\b(ai tutor|tutor)\b/i, "ai-tutor"],
  [/\b(kits?|starter kit|toolkit)\b/i, "kit"],
  [/\b(gadgets?|hardware|board|sensor|device)\b/i, "gadget"],
  [/\b(mentors?|mentorship|coaching)\b/i, "mentorship"],
];

export interface ProductLike {
  name?: string;
  kind?: string | null;
  category?:
    | string
    | { slug?: string | null; name?: string | null }
    | null;
  /** Convenience — flat category slug when the caller already knows it. */
  categorySlug?: string | null;
  /** Convenience — flat category display name. */
  categoryName?: string | null;
}

const normalize = (value: string | null | undefined): string =>
  (value ?? "").trim().toLowerCase();

const resolveKind = (product: ProductLike): ProductCtaKind => {
  // 1. explicit slug
  const explicitSlug = normalize(
    product.categorySlug ??
      (typeof product.category === "object" ? product.category?.slug : null),
  );
  if (explicitSlug && SLUG_TO_KIND[explicitSlug]) {
    return SLUG_TO_KIND[explicitSlug];
  }

  // 2. ProductKind from the shop Product type
  const kind = normalize(product.kind ?? undefined);
  if (kind && KIND_FROM_PRODUCT_KIND[kind]) {
    return KIND_FROM_PRODUCT_KIND[kind];
  }

  // 3. category name keyword
  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name ?? product.categoryName ?? "";
  const catLower = normalize(categoryName);
  if (catLower) {
    for (const [pattern, k] of NAME_KEYWORDS) {
      if (pattern.test(catLower)) return k;
    }
  }

  // 4. product-name keyword
  const nameLower = normalize(product.name);
  if (nameLower) {
    for (const [pattern, k] of NAME_KEYWORDS) {
      if (pattern.test(nameLower)) return k;
    }
  }

  // 5. fallback
  return "generic";
};

/**
 * Resolve the appropriate CTA for a product. Pass `owned: true` to override
 * the primary label with the "open / continue" variant.
 */
export function getProductCta(
  product: ProductLike,
  options: { owned?: boolean } = {},
): ProductCta {
  const base = CTA_BY_KIND[resolveKind(product)];
  if (options.owned) {
    return {
      ...base,
      primaryLabel: base.ownedLabel,
      primaryShortLabel: base.ownedLabel.split(" ")[0],
    };
  }
  return base;
}
