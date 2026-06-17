/**
 * Generates `public/sitemap.xml` from the canonical list of public routes.
 *
 * Wired into Vite via the inline `sitemapPlugin` in `vite.config.ts`,
 * so it runs automatically on every `vite dev` and `vite build`.
 *
 * - Private / personal / auth-gated routes are intentionally excluded
 *   (they are also `Disallow`-ed in `public/robots.txt` and rendered
 *   with `noIndex` in `<SEO />`).
 * - Admin routes (`/asikonasik/*`) are excluded.
 * - Dynamic content routes (`/product/:slug`, `/courses/:slug`,
 *   `/content/:slug`, `/track/:slug`, `/lesson/:id`) are intentionally
 *   omitted until we fetch the published rows from the database here.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const BASE_URL = "https://style-verse-suite.lovable.app";

type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: ChangeFreq;
  priority?: string;
}

/**
 * Public, indexable routes only. Keep in sync with `<Route>` definitions
 * in `src/App.tsx`. If a route renders `<SEO noIndex />` or is otherwise
 * personal/auth-gated, do NOT add it here.
 */
const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/shop", changefreq: "daily", priority: "0.9" },
  { path: "/learn", changefreq: "weekly", priority: "0.9" },
  { path: "/courses", changefreq: "weekly", priority: "0.9" },
  { path: "/digital", changefreq: "weekly", priority: "0.8" },
  { path: "/services", changefreq: "weekly", priority: "0.8" },
  { path: "/mentors", changefreq: "weekly", priority: "0.8" },
  { path: "/community", changefreq: "daily", priority: "0.8" },
  { path: "/ai-tutor", changefreq: "weekly", priority: "0.7" },
  { path: "/revision", changefreq: "weekly", priority: "0.7" },
  { path: "/game", changefreq: "weekly", priority: "0.7" },
  { path: "/prompts", changefreq: "weekly", priority: "0.7" },
  { path: "/leaderboard", changefreq: "daily", priority: "0.5" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/help", changefreq: "monthly", priority: "0.5" },
  { path: "/welcome", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/refund", changefreq: "yearly", priority: "0.3" },
];

function buildSitemap(rows: SitemapEntry[]): string {
  const urls = rows.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    "",
  ].join("\n");
}

export function generateSitemap(outDir = "public"): void {
  const xml = buildSitemap(entries);
  const outPath = resolve(outDir, "sitemap.xml");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, xml);
  // eslint-disable-next-line no-console
  console.log(`[sitemap] wrote ${outPath} (${entries.length} entries)`);
}

// Allow direct invocation: `bunx tsx scripts/generate-sitemap.ts`
const isDirectRun =
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  generateSitemap();
}
