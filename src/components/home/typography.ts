/**
 * Shared typography tokens for the home page.
 *
 * Single source of truth so the hero slider's voice — display font,
 * extrabold weight, uppercase, tight tracking, balanced wrap — stays
 * consistent across every section, card, stat, and CTA on the home page.
 *
 * Each token is a Tailwind class string that already encodes the full
 * mobile → tablet → desktop responsive scale, so consumers never need
 * to specify breakpoints themselves. Adjust scale here and the whole
 * home page follows.
 *
 *   Breakpoint reference (Tailwind defaults):
 *     base  →   <640px   (mobile)
 *     sm:   →  ≥640px    (tablet)
 *     lg:   →  ≥1024px   (desktop)
 *
 * NOTE: Tailwind's JIT only sees literal class strings, so every class
 * here is written out in full — never built with template literals.
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

export const homeType = {
  /* ────────────────────────────  Headings  ──────────────────────────── */

  /** Hero slide title — the canonical reference style. */
  heroTitle:
    `${HERO_VOICE} text-[24px] sm:text-[28px] lg:text-[32px] text-white`,

  /** Standard section h2 used across every home section. */
  sectionTitle:
    `${HERO_VOICE} text-[24px] sm:text-[30px] lg:text-[36px] text-center sm:text-left`,

  /** Oversized hero-band h2 (Superagent / Explore Topics scale). */
  bandTitle:
    `${HERO_VOICE} text-[40px] sm:text-[56px] lg:text-[72px] text-center sm:text-left`,

  /** Card / tile title inside a section grid. */
  cardTitle:
    `${CARD_VOICE} text-[15px] sm:text-[17px] lg:text-[18px]`,

  /** Tiny tile title (compact rails, dense grids). */
  tileTitle:
    `${CARD_VOICE} text-[13px] sm:text-[14px] lg:text-[15px]`,

  /* ───────────────────────────  Supporting  ─────────────────────────── */

  /** Eyebrow caption above a title — desaturated, hairline tracked. */
  eyebrow:
    "font-display font-semibold uppercase tracking-[0.18em] text-white/60 text-[11px] sm:text-[12px]",

  /** Hook / supporting body line under a title. */
  hook:
    "leading-relaxed text-white/65 text-[13.5px] sm:text-[15px] lg:text-[16px]",

  /** Muted helper line — smaller than hook (timestamps, tags). */
  meta:
    "text-white/55 text-[12px] sm:text-[13px]",

  /* ─────────────────────────────  Stats  ────────────────────────────── */

  /** Numeric stat value (LiveStatsBar etc). */
  stat:
    `${HERO_VOICE} text-[24px] sm:text-[30px] lg:text-[36px] text-white`,

  /** Label under a stat. */
  statLabel:
    "font-display uppercase tracking-[0.18em] text-white/55 text-[11px] sm:text-[12px]",
} as const;

export type HomeTypeToken = keyof typeof homeType;
