// Route → default SEO mapping. Page-level <SEO> still overrides these
// because react-helmet-async dedupes meta tags by name/property.

export interface RouteSeoTemplate {
  /** Path pattern, react-router style (e.g. "/product/:slug"). */
  pattern: string;
  title: string;
  description: string;
  /** Render <meta name="robots" content="noindex,nofollow"> when true. */
  noIndex?: boolean;
  type?: "website" | "article" | "product";
}

/**
 * Ordered most-specific → least-specific. First match wins.
 * Keep titles ≤ 60 chars and descriptions ≤ 160 chars for SERP fit.
 */
export const ROUTE_SEO: RouteSeoTemplate[] = [
  // Static, top-level pages
  { pattern: "/", title: "Asikon — AI-Powered Learning Platform", description: "Discover AI-powered courses, books, study tools and 1-on-1 mentorship. Instant digital access on Asikon." },
  { pattern: "/shop", title: "Shop Digital Learning Products", description: "Browse courses, ebooks, study tools and digital downloads. Instant access after purchase on Asikon." },
  { pattern: "/courses", title: "Online Courses for Every Learner", description: "Explore self-paced and live online courses curated by Asikon — lifetime access, certificates, and AI tutoring." },
  { pattern: "/digital", title: "Digital Downloads & Study Tools", description: "Ebooks, templates, notes and digital study essentials. Download instantly after checkout." },
  { pattern: "/services", title: "Learning Services & Mentorship", description: "Personal tutoring, study help and learning services from vetted Asikon mentors." },
  { pattern: "/mentors", title: "1-on-1 Mentors for Students", description: "Book personal mentors for your child — vetted teachers, flexible scheduling, fully online." },
  { pattern: "/community", title: "Community — Posts, Reviews & Live", description: "Join the Asikon learning community: posts, reviews, shorts, videos and live sessions from creators." },
  { pattern: "/learn", title: "Learn — Tracks, Lessons & AI Help", description: "Personal learning hub with tracks, lessons, skill maps and an AI tutor that adapts to you." },
  { pattern: "/ai-tutor", title: "AI Tutor — Ask & Learn Anything", description: "Chat with Asikon's AI tutor for step-by-step explanations, study plans and instant homework help." },
  { pattern: "/ai-tutor/:threadId", title: "AI Tutor Conversation", description: "Continue your AI tutoring session on Asikon." },
  { pattern: "/revision", title: "Revision — Spaced Practice", description: "Review what you've learned with spaced repetition built into Asikon." },
  { pattern: "/library", title: "Your Library", description: "Access every course, ebook and download you own on Asikon." },
  { pattern: "/game", title: "Learning Games & Rewards", description: "Play, earn coins and climb the leaderboard while you learn on Asikon." },
  { pattern: "/leaderboard", title: "Leaderboard", description: "Top learners and earners across the Asikon community." },
  { pattern: "/prompts", title: "AI Prompt Library", description: "Curated AI prompts for studying, writing, coding and creativity." },
  { pattern: "/about", title: "About Asikon", description: "Our mission, vision and the team building the AI-powered learning platform for every student." },
  { pattern: "/contact", title: "Contact Us", description: "Get in touch with the Asikon team for support, partnerships or feedback." },
  { pattern: "/help", title: "Help Center & FAQ", description: "Answers to common questions about courses, payments, downloads and accounts on Asikon." },
  { pattern: "/terms", title: "Terms of Service", description: "Read the Asikon terms of service." },
  { pattern: "/privacy", title: "Privacy Policy", description: "How Asikon collects, uses and protects your personal data." },
  { pattern: "/refund", title: "Refund Policy", description: "Our money-back guarantee and refund process for digital products and courses." },
  { pattern: "/welcome", title: "Welcome to Asikon", description: "Set up your Asikon learning experience in a few quick steps." },

  // Auth / account (noindex — private surfaces)
  { pattern: "/auth", title: "Sign In or Create Account", description: "Sign in to Asikon or create a free account in seconds.", noIndex: true },
  { pattern: "/reset-password", title: "Reset Your Password", description: "Reset your Asikon account password.", noIndex: true },
  { pattern: "/profile", title: "Your Profile", description: "Manage your Asikon profile, activity and orders.", noIndex: true },
  { pattern: "/profile/:userId", title: "Profile", description: "View this creator's profile on Asikon." },
  { pattern: "/cart", title: "Your Cart", description: "Review items in your cart before checkout.", noIndex: true },
  { pattern: "/wishlist", title: "Your Wishlist", description: "Items you've saved for later on Asikon.", noIndex: true },
  { pattern: "/checkout", title: "Secure Checkout", description: "Complete your Asikon order securely with card or bKash.", noIndex: true },
  { pattern: "/orders", title: "Your Orders", description: "Your Asikon order history and downloads.", noIndex: true },
  { pattern: "/orders/:id", title: "Order Details", description: "View this Asikon order's details and downloads.", noIndex: true },
  { pattern: "/settings", title: "Settings", description: "Manage account, notifications and preferences.", noIndex: true },
  { pattern: "/notifications", title: "Notifications", description: "Your recent notifications on Asikon.", noIndex: true },
  { pattern: "/create", title: "Create Content", description: "Publish a post, video, short, review or go live on Asikon.", noIndex: true },

  // Dynamic detail pages — overridden by page-level <SEO> with real data
  { pattern: "/product/:slug", title: "Product", description: "Discover this digital product on Asikon — instant access after purchase.", type: "product" },
  { pattern: "/content/:slug", title: "Content", description: "Read this post on Asikon.", type: "article" },
  { pattern: "/track/:slug", title: "Learning Track", description: "Follow this learning track on Asikon.", type: "article" },
  { pattern: "/lesson/:id", title: "Lesson", description: "Study this lesson on Asikon.", type: "article" },

  // Admin — always noindex
  { pattern: "/asikonasik/*", title: "Admin", description: "Asikon admin console.", noIndex: true },
];

const FALLBACK: RouteSeoTemplate = {
  pattern: "*",
  title: "Asikon — AI-Powered Learning Platform",
  description: "Discover AI-powered courses, books, study tools and 1-on-1 mentorship on Asikon.",
};

/** Convert a react-router-style pattern to a RegExp. */
function compile(pattern: string): RegExp {
  const src = pattern
    .split("/")
    .map((seg) => {
      if (seg === "") return "";
      if (seg === "*") return ".*";
      if (seg.startsWith(":")) return "[^/]+";
      return seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return new RegExp(`^${src}/?$`);
}

const COMPILED: Array<{ tpl: RouteSeoTemplate; re: RegExp }> = ROUTE_SEO.map((tpl) => ({
  tpl,
  re: compile(tpl.pattern),
}));

/**
 * Known client-side redirects. Kept in sync with the <Navigate> routes in App.tsx.
 * When the user lands on a redirect alias we emit noindex + a canonical that
 * points at the destination so crawlers consolidate signals on the real URL.
 */
export const ROUTE_REDIRECTS: Record<string, string> = {
  "/index": "/",
  "/faq": "/help",
};

export function matchRedirect(pathname: string): string | null {
  return ROUTE_REDIRECTS[pathname] ?? null;
}

/**
 * Returns the matching template, or `null` when the path is unknown
 * (i.e. will render the 404 page). Callers should treat null as
 * "noindex, no canonical".
 */
export function matchRouteSeo(pathname: string): RouteSeoTemplate | null {
  for (const { tpl, re } of COMPILED) {
    if (re.test(pathname)) return tpl;
  }
  return null;
}

export const FALLBACK_SEO = FALLBACK;
