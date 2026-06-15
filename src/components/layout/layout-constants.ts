/**
 * Single source of truth for desktop sidebar / header layout widths.
 *
 * Tailwind's JIT requires literal class names, so we export both the
 * raw rem widths (for CSS vars / inline styles) and the matching
 * Tailwind utility strings. Change a value here and every consumer
 * (sidebar width, header left offset, main padding) updates together.
 */

export const SIDEBAR_WIDTH_EXPANDED_REM = 15; // w-60 = 15rem
export const SIDEBAR_WIDTH_COLLAPSED_REM = 4; // w-16 = 4rem

export const SIDEBAR_WIDTH_CLASS = {
  expanded: "w-60",
  collapsed: "w-16",
} as const;

/** Use on fixed/absolute elements that sit to the right of the sidebar. */
export const SIDEBAR_LEFT_OFFSET_CLASS = {
  expanded: "left-60",
  collapsed: "left-16",
} as const;

/** Same as above but only applies at the `lg` breakpoint where the sidebar mounts. */
export const SIDEBAR_LEFT_OFFSET_CLASS_LG = {
  expanded: "lg:left-60",
  collapsed: "lg:left-16",
} as const;

/** Main-content padding to clear the fixed sidebar (lg+ only). */
export const SIDEBAR_PADDING_CLASS_LG = {
  expanded: "lg:pl-60",
  collapsed: "lg:pl-16",
} as const;

export function sidebarWidthClass(collapsed: boolean) {
  return collapsed ? SIDEBAR_WIDTH_CLASS.collapsed : SIDEBAR_WIDTH_CLASS.expanded;
}

export function sidebarLeftOffsetClass(collapsed: boolean, breakpoint: "base" | "lg" = "base") {
  const map = breakpoint === "lg" ? SIDEBAR_LEFT_OFFSET_CLASS_LG : SIDEBAR_LEFT_OFFSET_CLASS;
  return collapsed ? map.collapsed : map.expanded;
}

export function sidebarPaddingClassLg(collapsed: boolean) {
  return collapsed ? SIDEBAR_PADDING_CLASS_LG.collapsed : SIDEBAR_PADDING_CLASS_LG.expanded;
}
