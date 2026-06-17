import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { generateSitemap } from "../../scripts/generate-sitemap";

/**
 * Guards the SEO contract: the generated sitemap must list ONLY public,
 * indexable routes, and robots.txt must Disallow every private/personal/
 * admin path. If either drifts, search engines could either leak private
 * URLs into their index or stop crawling pages we expect to rank.
 */

const PUBLIC_ROOT = resolve(__dirname, "..", "..", "public");
const SITEMAP_PATH = resolve(PUBLIC_ROOT, "sitemap.xml");
const ROBOTS_PATH = resolve(PUBLIC_ROOT, "robots.txt");

const PRIVATE_PATHS = [
  "/asikonasik",
  "/auth",
  "/reset-password",
  "/cart",
  "/checkout",
  "/orders",
  "/wishlist",
  "/settings",
  "/create",
  "/notifications",
  "/library",
  "/profile",
] as const;

const EXPECTED_PUBLIC_PATHS = [
  "/",
  "/shop",
  "/learn",
  "/courses",
  "/community",
  "/about",
  "/help",
  "/privacy",
  "/terms",
  "/refund",
] as const;

describe("sitemap.xml", () => {
  let xml = "";

  beforeAll(() => {
    // Regenerate so the test never relies on stale on-disk output.
    generateSitemap(PUBLIC_ROOT);
    expect(existsSync(SITEMAP_PATH)).toBe(true);
    xml = readFileSync(SITEMAP_PATH, "utf8");
  });

  it("is well-formed XML with at least one <url>", () => {
    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(xml).toContain("<urlset");
    expect(xml).toMatch(/<url>/);
  });

  it("uses the canonical project domain on every entry", () => {
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) {
      expect(loc).toMatch(/^https:\/\/style-verse-suite\.lovable\.app/);
    }
  });

  it.each(EXPECTED_PUBLIC_PATHS)("includes the public route %s", (path) => {
    const loc = `https://style-verse-suite.lovable.app${path}`;
    expect(xml).toContain(`<loc>${loc}</loc>`);
  });

  it.each(PRIVATE_PATHS)("excludes the private route %s", (path) => {
    const loc = `https://style-verse-suite.lovable.app${path}`;
    expect(xml).not.toContain(`<loc>${loc}</loc>`);
    // Defend against trailing-slash variants too.
    expect(xml).not.toContain(`<loc>${loc}/</loc>`);
  });

  it("never lists admin subroutes", () => {
    expect(xml).not.toMatch(/<loc>[^<]*\/asikonasik\//);
  });
});

describe("robots.txt", () => {
  let txt = "";

  beforeAll(() => {
    expect(existsSync(ROBOTS_PATH)).toBe(true);
    txt = readFileSync(ROBOTS_PATH, "utf8");
  });

  it("declares the canonical sitemap URL", () => {
    expect(txt).toContain(
      "Sitemap: https://style-verse-suite.lovable.app/sitemap.xml",
    );
  });

  it("contains a wildcard user-agent block", () => {
    expect(txt).toMatch(/User-agent:\s*\*/);
  });

  it.each(PRIVATE_PATHS)("Disallows %s under User-agent: *", (path) => {
    const wildcardBlock = extractBlockForAgent(txt, "*");
    expect(wildcardBlock).toContain(`Disallow: ${path}`);
  });

  it("also Disallows private paths for Googlebot", () => {
    const googlebotBlock = extractBlockForAgent(txt, "Googlebot");
    for (const path of PRIVATE_PATHS) {
      expect(googlebotBlock).toContain(`Disallow: ${path}`);
    }
  });

  it("does not block the entire site", () => {
    const wildcardBlock = extractBlockForAgent(txt, "*");
    // A bare `Disallow: /` would block everything — reject that.
    expect(wildcardBlock).not.toMatch(/^Disallow:\s*\/\s*$/m);
    expect(wildcardBlock).toMatch(/^Allow:\s*\/\s*$/m);
  });
});

/**
 * Returns the lines belonging to the requested `User-agent` group,
 * up to (but not including) the next `User-agent:` directive or EOF.
 */
function extractBlockForAgent(txt: string, agent: string): string {
  const lines = txt.split(/\r?\n/);
  const start = lines.findIndex(
    (line) => line.trim().toLowerCase() === `user-agent: ${agent.toLowerCase()}`,
  );
  if (start === -1) {
    throw new Error(`No User-agent: ${agent} block found in robots.txt`);
  }
  const rest = lines.slice(start + 1);
  const endRel = rest.findIndex((line) => /^User-agent:/i.test(line));
  const end = endRel === -1 ? rest.length : endRel;
  return rest.slice(0, end).join("\n");
}
