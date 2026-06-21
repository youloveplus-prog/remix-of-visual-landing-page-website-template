import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/transitions/Reveal";

type SectionVariant = "plain" | "department";

interface HomeSectionProps {
  /** Small mono label above the title (e.g. "05.1", "This week"). */
  eyebrow?: ReactNode;
  /** Section title — rendered with `editorial-subhead`. */
  title?: ReactNode;
  /** Optional one-line description under the title. */
  dek?: ReactNode;
  /** Optional right-aligned action (link, button). */
  action?: ReactNode;
  /** Visual style:
   *  - `plain`: eyebrow + title stacked left.
   *  - `department`: numbered, with a tick + uppercase name on one row.
   */
  variant?: SectionVariant;
  /** Pull tag for anchor links. */
  id?: string;
  /** Section body. */
  children: ReactNode;
  className?: string;
  /** Override the body wrapper spacing. */
  bodyClassName?: string;
}

/**
 * HomeSection — the single section primitive used across every home spread.
 *
 * Locks down spacing, header alignment, and typography so every titled block
 * (departments, carousels, support rows) reads as the same magazine.
 *
 * Layout:
 *   ┌─ header (eyebrow · title · action) ───────────┐
 *   │  dek                                          │
 *   ├─ body (children)                              ┤
 *   └───────────────────────────────────────────────┘
 *
 * Vertical rhythm:
 *   header → dek    : 8px
 *   header → body   : 20px (sm), 24px (lg)
 */
export function HomeSection({
  eyebrow,
  title,
  dek,
  action,
  variant = "plain",
  id,
  children,
  className,
  bodyClassName,
}: HomeSectionProps) {
  const hasHeader = !!(eyebrow || title || action);

  return (
    <Reveal
      as="section"
      id={id}
      variant="fade-up"
      className={cn("space-y-5 sm:space-y-6", className)}
    >
      {hasHeader && (
        <header className="flex flex-col items-center text-center gap-2">
          {variant === "department" ? (
            <div className="flex items-center justify-center gap-3">
              <span aria-hidden className="block h-px w-6 bg-foreground/30" />
              {eyebrow && <span className="editorial-pagenum">{eyebrow}</span>}
              {title && (
                <h3 className="editorial-eyebrow text-foreground tracking-[0.2em]">
                  {title}
                </h3>
              )}
              <span aria-hidden className="block h-px w-6 bg-foreground/30" />
            </div>
          ) : (
            <div className="min-w-0">
              {eyebrow && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-1.5">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h3 className="font-display font-bold leading-[1.02] sm:leading-[0.95] tracking-[-0.03em] sm:tracking-[-0.035em] text-[22px] sm:text-[34px] lg:text-[40px] text-brand-gradient">
                  {title}
                </h3>
              )}
            </div>
          )}

          {dek && (
            <Reveal delay={120}>
              <p className="editorial-dek max-w-[52ch] mx-auto">{dek}</p>
            </Reveal>
          )}

          {action && <div className="mt-1">{action}</div>}
        </header>
      )}


      <Reveal delay={hasHeader ? 180 : 0}>
        <div className={cn(bodyClassName)}>{children}</div>
      </Reveal>
    </Reveal>
  );
}
