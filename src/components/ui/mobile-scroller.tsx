import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Mobile-first horizontal snap scroller.
 * - On mobile: each child snaps with its `itemWidthMobile` (e.g. "85%", "70%").
 * - On md+: falls back to a CSS grid (`gridCols`) for a clean tablet/desktop layout.
 *
 * Hides scrollbars, supports peek-next behavior for an "app-like" feel.
 */
interface MobileScrollerProps {
  children: ReactNode[];
  /** Mobile basis e.g. "85%" or "20rem" */
  itemWidthMobile?: string;
  /** Tailwind grid columns class for md+ breakpoints */
  gridCols?: string;
  /** Gap between items */
  gap?: string;
  /** Extra container classes */
  className?: string;
  /** Optional left padding to peek edge */
  edgePeek?: boolean;
}

export function MobileScroller({
  children,
  itemWidthMobile = "85%",
  gridCols = "md:grid md:grid-cols-3",
  gap = "gap-3",
  className,
  edgePeek = true,
}: MobileScrollerProps) {
  return (
    <div
      className={cn(
        // Mobile: horizontal snap scroll
        "flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4",
        edgePeek && "pr-10",
        gap,
        // Desktop: switch to grid (overrides flex)
        gridCols && `${gridCols} md:overflow-visible md:mx-0 md:px-0 md:pr-0 md:snap-none`,
        className,
      )}
      style={{ scrollbarWidth: "none" }}
    >
      {children.map((child, i) => (
        <div
          key={i}
          className="shrink-0 snap-start md:shrink md:w-auto"
          style={{ flexBasis: itemWidthMobile, width: itemWidthMobile, maxWidth: "100%" }}
        >
          <div className="md:!w-auto h-full" style={{ width: "100%" }}>
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}
