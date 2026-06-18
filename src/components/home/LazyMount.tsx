import { ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";

interface LazyMountProps {
  fallback: ReactNode;
  children: ReactNode;
  /** rootMargin for the IntersectionObserver — defaults to 400px before viewport */
  rootMargin?: string;
  /** Minimum reserved height so the placeholder pushes layout the same as content */
  minHeight?: string;
}

/**
 * Viewport-gated mount: renders `fallback` until the element scrolls
 * near the viewport, then mounts `children`. Pair with React.lazy to
 * defer chunk fetching for below-the-fold sections.
 */
export function LazyMount({
  fallback,
  children,
  rootMargin = "0px 0px 400px 0px",
  minHeight,
}: LazyMountProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(rootMargin);
  return (
    <div ref={ref} style={minHeight ? { minHeight } : undefined}>
      {inView ? children : fallback}
    </div>
  );
}
