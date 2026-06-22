/**
 * Lightweight haptic feedback helper.
 * Uses the Capacitor Haptics plugin when available (native iOS/Android),
 * and falls back to the Web Vibration API on supported browsers.
 * Silently no-ops when neither is available (e.g. iOS Safari, desktop).
 */

type Style = "light" | "medium" | "heavy" | "selection";

const VIBRATION_MS: Record<Style, number> = {
  selection: 8,
  light: 10,
  medium: 18,
  heavy: 28,
};

export function haptic(style: Style = "light") {
  try {
    // Capacitor Haptics (native), if installed at runtime
    const cap = (globalThis as any).Capacitor;
    if (cap?.isNativePlatform?.() && cap?.Plugins?.Haptics) {
      const H = cap.Plugins.Haptics;
      if (style === "selection") H.selectionStart?.();
      else H.impact?.({ style: style.charAt(0).toUpperCase() + style.slice(1) });
      return;
    }

    // Web Vibration API fallback
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(VIBRATION_MS[style]);
    }
  } catch {
    /* no-op */
  }
}
