import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MaxWidth =
  | "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full"
  /** Editorial 1440px — Home, Shop, feeds. */
  | "wide"
  /** Comfortable workspace 1024px — Profile, Game, Orders. */
  | "standard"
  /** Reading width 672px — Settings, Lesson, forms. */
  | "reading";

interface MobilePageProps {
  children: ReactNode;
  /** Sticky element rendered just under the global app header (e.g. tabs row). */
  sticky?: ReactNode;
  /** Override horizontal padding (default px-4 lg:px-8). */
  padded?: boolean;
  /** Extra className for the inner content wrapper. */
  className?: string;
  /** Vertical spacing between top-level sections. Default "space-y-5". */
  spacing?: string;
  /** Constrain content width (uses Tailwind max-w-*). Default "wide" = editorial container. */
  maxWidth?: MaxWidth;
  /** Render the full-bleed area before the padded content (e.g. profile cover). */
  bleed?: ReactNode;
}

const maxWidthMap: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
  full: "",
  wide: "",
  standard: "max-w-5xl",
  reading: "max-w-2xl",
};

/**
 * Consistent mobile-app page shell.
 * - Uses the global MobileHeader/DesktopHeader from AppLayout (don't double-stack).
 * - AppLayout already offsets the page by `--app-header-h`, so the sticky tab
 *   strip is rendered in normal flow with `sticky top-0` and sits flush under
 *   the header with zero gap.
 */
export function MobilePage({
  children,
  sticky,
  padded = true,
  className,
  spacing = "space-y-5",
  maxWidth = "wide",
  bleed,
}: MobilePageProps) {
  const isContainer = maxWidth === "full" || maxWidth === "wide";
  const widthClass = isContainer ? "container-editorial" : `mx-auto w-full ${maxWidthMap[maxWidth]}`;
  // `container-editorial` already includes px-4 sm:px-6 lg:px-8.
  // For max-w-* widths we need to add the gutters ourselves.
  const paddingClass = padded && !isContainer ? "px-4 sm:px-6 lg:px-8" : undefined;
  return (
    <>
      {sticky && (
        <div
          className="sticky z-30 bg-background hairline-bottom"
          style={{ top: "var(--app-header-h, 0px)" }}
        >
          <div className={cn(widthClass, paddingClass)}>
            {sticky}
          </div>
        </div>
      )}
      <div className="page-enter page-enter-active">
        {bleed}
        <div
          className={cn(
            widthClass,
            paddingClass,
            sticky ? "pt-2" : "pt-2 lg:pt-6",
            "pb-6 min-w-0 overflow-x-clip",
            spacing,
            className,
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
