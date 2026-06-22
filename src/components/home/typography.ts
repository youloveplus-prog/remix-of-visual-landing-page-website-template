/**
 * Shared typography tokens for the home page.
 *
 * Single source of truth so the hero slider's voice — display font,
 * extrabold weight, uppercase, tight tracking, balanced wrap — stays
 * consistent across every section, card, and stat on the home page.
 *
 * Usage:
 *   import { homeType } from "@/components/home/typography";
 *   <h2 className={homeType.sectionTitle}>...</h2>
 */

const base =
  "font-display font-extrabold uppercase tracking-tight text-balance leading-[1.08]";

export const homeType = {
  /** Hero slide title — the canonical reference style. */
  heroTitle: `${base} text-[24px] sm:text-[28px] text-white`,

  /** Top-of-section h2 used across every home section. */
  sectionTitle: `${base} text-[24px] sm:text-[30px] lg:text-[36px]`,

  /** Oversized hero-band h2 (Superagent / Explore Topics scale). */
  bandTitle: `${base} text-[40px] sm:text-[56px] lg:text-[72px]`,

  /** Card / tile title inside a section. */
  cardTitle: `font-display font-bold uppercase tracking-tight leading-[1.1] text-[15px] sm:text-[17px]`,

  /** Eyebrow caption above a title — desaturated, hairline tracked. */
  eyebrow:
    "font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60",

  /** Hook / supporting body line under a title. Mobile-first. */
  hook: "text-[13.5px] sm:text-[15px] leading-relaxed text-white/65",

  /** Numeric stat value (LiveStatsBar etc). */
  stat: `${base} text-2xl sm:text-3xl text-white`,
} as const;

export type HomeTypeToken = keyof typeof homeType;
