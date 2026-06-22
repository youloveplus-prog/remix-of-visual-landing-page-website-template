/**
 * Shared typography tokens for the home page.
 *
 * Single source of truth so the hero slider's voice — display font,
 * extrabold weight, uppercase, tight tracking, balanced wrap — stays
 * consistent across every section, card, stat, and CTA on the home page.
 *
 * Each token is a Tailwind class string that already encodes the full
 * mobile → tablet → desktop responsive scale, so consumers never need
 * to specify breakpoints. Adjust scale here and the whole home page
 * follows.
 *
 *   Breakpoint reference (Tailwind defaults):
 *     base  →   <640px   (mobile)
 *     sm:   →  ≥640px    (tablet)
 *     lg:   →  ≥1024px   (desktop)
 *
 * Usage:
 *   import { homeType } from "@/components/home/typography";
 *   <h2 className={homeType.sectionTitle}>...</h2>
 */

/** Shared shape that defines the hero voice. Never used directly. */
const HERO_VOICE =
  "font-display font-extrabold uppercase tracking-tight text-balance leading-[1.08]";

/** Card title voice — slightly lighter, looser line-height for two-line wraps. */
const CARD_VOICE =
  "font-display font-bold uppercase tracking-tight leading-[1.1]";

/**
 * Responsive size scale helper.
 * size(base, tablet?, desktop?) → "text-[X] sm:text-[Y] lg:text-[Z]"
 */
const size = (base: string, tablet?: string, desktop?: string) =>
  [
    `text-[${base}]`,
    tablet ? `sm:text-[${tablet}]` : "",
    desktop ? `lg:text-[${desktop}]` : "",
  ]
    .filter(Boolean)
    .join(" ");

export const homeType = {
  /* ────────────────────────────  Headings  ──────────────────────────── */

  /** Hero slide title — the canonical reference style. */
  heroTitle: `${HERO_VOICE} ${size("24px", "28px", "32px")} text-white`,

  /** Standard section h2 used across every home section. */
  sectionTitle: `${HERO_VOICE} ${size("24px", "30px", "36px")}`,

  /** Oversized hero-band h2 (Superagent / Explore Topics scale). */
  bandTitle: `${HERO_VOICE} ${size("40px", "56px", "72px")}`,

  /** Card / tile title inside a section grid. */
  cardTitle: `${CARD_VOICE} ${size("15px", "17px", "18px")}`,

  /** Tiny tile title (compact rails, dense grids). */
  tileTitle: `${CARD_VOICE} ${size("13px", "14px", "15px")}`,

  /* ────────────────────────────  Supporting  ───────────────────────── */

  /** Eyebrow caption above a title — desaturated, hairline tracked. */
  eyebrow: `font-display font-semibold uppercase tracking-[0.18em] text-white/60 ${size(
    "11px",
    "12px",
  )}`,

  /** Hook / supporting body line under a title. */
  hook: `leading-relaxed text-white/65 ${size("13.5px", "15px", "16px")}`,

  /** Muted helper line — smaller than hook (timestamps, tags). */
  meta: `text-white/55 ${size("12px", "13px")}`,

  /* ───────────────────────────────  Stats  ─────────────────────────── */

  /** Numeric stat value (LiveStatsBar etc). */
  stat: `${HERO_VOICE} ${size("24px", "30px", "36px")} text-white`,

  /** Label under a stat. */
  statLabel: `${homeType_unused_placeholder()}`,
} as const;

// (The IIFE below keeps the const object monomorphic for tree-shaking.)
function homeType_unused_placeholder() {
  return `font-display uppercase tracking-[0.18em] text-white/55 ${size("11px", "12px")}`;
}

export type HomeTypeToken = keyof typeof homeType;
