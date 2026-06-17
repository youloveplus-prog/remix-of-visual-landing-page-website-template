import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Price } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface JumpLink {
  id: string;
  label: string;
}

interface ProductStickyNavProps {
  title: string;
  price: number;
  originalPrice?: number | null;
  ctaLabel: string;
  ctaShortLabel?: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  links: JumpLink[];
  /** Element that, once scrolled past, reveals the bar. */
  revealAfterRef: React.RefObject<HTMLElement>;
}

/**
 * Slim desktop sticky bar that appears once the user scrolls past the hero.
 * - Mirrors title + price so context never disappears.
 * - Smooth-scroll anchor chips with aria-current on the active section.
 * - Hidden on mobile (StickyActionBar already covers that case).
 */
export function ProductStickyNav({
  title,
  price,
  originalPrice,
  ctaLabel,
  ctaShortLabel,
  onCta,
  ctaDisabled,
  links,
  revealAfterRef,
}: ProductStickyNavProps) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const node = revealAfterRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [revealAfterRef]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top?.target.id) setActive(top.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [links]);

  const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  };

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "hidden lg:block fixed inset-x-0 z-40 transition-all duration-300 motion-reduce:transition-none",
        "top-[var(--app-header-h,0px)]",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-3 opacity-0 pointer-events-none",
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/95 backdrop-blur shadow-lg shadow-foreground/5 px-4 py-2.5">
          <p className="font-display text-[15px] font-semibold truncate min-w-0 flex-1">
            {title}
          </p>
          <nav aria-label="Section navigation" className="flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => handleJump(e, l.id)}
                aria-current={active === l.id ? "true" : undefined}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active === l.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-baseline gap-2">
            <Price
              amount={price}
              className="font-display text-[15px] font-bold tabular-nums"
            />
            {originalPrice ? (
              <Price
                amount={originalPrice}
                strike
                className="text-[11px] text-muted-foreground tabular-nums"
              />
            ) : null}
          </div>
          <Button
            size="sm"
            onClick={onCta}
            disabled={ctaDisabled}
            className="rounded-full"
          >
            {ctaShortLabel || ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
