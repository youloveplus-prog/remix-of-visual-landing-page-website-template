/**
 * Shared motion tokens for the editorial home spreads.
 * Every spread/sub-component pulls timings from here so the page reads as
 * one piece of choreography, not five independent animations.
 */

export const EDITORIAL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export const EDITORIAL_DURATION = {
  rule: 900,
  label: 600,
  pagenum: 700,
  word: 800,
  reveal: 420,
} as const;

export const EDITORIAL_DELAY = {
  label: 120,
  pagenum: 300,
  wordBase: 100,
  wordStep: 110,
  bodyAfterHeadline: 520,
  ctaAfterHeadline: 620,
  tocStep: 80,
} as const;

export const EDITORIAL_PARALLAX = {
  coverHeadline: 28,
  coverPullquote: 28,
  featureImage: 36,
} as const;
