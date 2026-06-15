import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useScrollParallax } from "@/hooks/useScrollParallax";

/**
 * Shared motion primitives for the editorial spreads.
 *
 * Every primitive:
 *  - reads its timing from `motion.ts` via the matching CSS class
 *  - flips to its final state instantly under prefers-reduced-motion
 *    (handled at the CSS layer + by the hooks themselves)
 *
 * Use these instead of writing per-spread animation classes so the page reads
 * as a single piece of choreography.
 */

/** Thin hairline that draws left-to-right when it enters the viewport. */
export function RuleDraw({ className }: { className?: string }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn("editorial-rule editorial-rule-draw", inView && "is-in", className)}
    />
  );
}

/** Small label that rises into place. Defaults to the editorial-eyebrow style. */
export function LabelRise({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={cn("editorial-eyebrow editorial-label-rise", inView && "is-in", className)}
    >
      {children}
    </span>
  );
}

/** Page-number caption that fades up after the rule + label settle. */
export function PageNumRise({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInViewOnce<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      className={cn("editorial-pagenum editorial-pagenum-rise", inView && "is-in", className)}
    >
      {children}
    </span>
  );
}

/**
 * Headline that rises word-by-word.
 * Accepts an array of children — each becomes its own staggered span.
 * Reuses the timing tokens so a Cover headline always feels like an issue cover.
 */
export function WordRise({
  words,
  baseDelay = 100,
  step = 110,
  className,
  style,
  as: Tag = "h1",
}: {
  words: ReactNode[];
  baseDelay?: number;
  step?: number;
  className?: string;
  style?: CSSProperties;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  return (
    <Tag
      ref={ref as never}
      className={cn("editorial-word-rise", inView && "is-in", className)}
      style={style}
    >
      {words.map((w, i) => (
        <span key={i} style={{ transitionDelay: `${baseDelay + i * step}ms` }}>
          {w}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Wraps any element in a scroll-linked parallax translate.
 * `factor` multiplies the raw parallax offset (negative = drifts up faster).
 */
export function ParallaxLayer({
  strength,
  factor = 1,
  className,
  style,
  children,
}: {
  strength: number;
  factor?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const { ref, offset } = useScrollParallax<HTMLDivElement>(strength);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(0, ${offset * factor}px, 0)`,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
