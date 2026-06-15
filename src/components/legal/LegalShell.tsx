import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { useLegalPresence } from "@/hooks/useLegalPresence";
import { LegalPresenceContext } from "@/components/legal/LegalPresenceContext";
import { Eye } from "lucide-react";

interface LegalShellProps {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  canonical: string;
  metaTitle: string;
  metaDescription: string;
  children: ReactNode;
  toc?: { index: number; title: string }[];
  /** Stable page slug used as `page` in analytics events (e.g. "terms", "privacy", "refund"). */
  analyticsSlug?: string;
}

export const LegalShell = ({
  eyebrow,
  title,
  updated,
  intro,
  canonical,
  metaTitle,
  metaDescription,
  children,
  toc,
  analyticsSlug,
}: LegalShellProps) => {
  const [activeSection, setActiveSection] = useState(1);
  const depthFiredRef = useRef<Set<number>>(new Set());
  const sectionViewedRef = useRef<Set<number>>(new Set());
  const pageKey = analyticsSlug ?? canonical;
  const { counts: presenceCounts, total: presenceTotal } = useLegalPresence(
    pageKey,
    activeSection
  );

  const handleScroll = useCallback(() => {
    if (!toc || toc.length === 0) return;
    const offsets = toc.map((t) => {
      const el = document.getElementById(`section-${t.index}`);
      return el ? el.getBoundingClientRect().top : Infinity;
    });
    const closest = offsets.reduce((best, curr, i) => {
      if (curr >= -80 && curr < offsets[best]) return i;
      return best;
    }, 0);
    const nextIndex = toc[closest].index;
    setActiveSection(nextIndex);

    // Section-viewed (once per index per page-load)
    if (!sectionViewedRef.current.has(nextIndex)) {
      sectionViewedRef.current.add(nextIndex);
      void track("legal_section_viewed", {
        page: pageKey,
        section_index: nextIndex,
        section_title: toc[closest].title,
      });
    }

    // Scroll-depth milestones (25/50/75/100)
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable > 0) {
      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !depthFiredRef.current.has(milestone)) {
          depthFiredRef.current.add(milestone);
          void track("legal_scroll_depth", { page: pageKey, depth: milestone });
        }
      }
    }
  }, [toc, pageKey]);

  useEffect(() => {
    if (!toc) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, toc]);

  const scrollTo = (index: number, source: "desktop" | "mobile") => {
    const item = toc?.find((t) => t.index === index);
    void track("legal_toc_click", {
      page: pageKey,
      section_index: index,
      section_title: item?.title,
      source,
    });
    const el = document.getElementById(`section-${index}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Strip trailing punctuation from titles for a cleaner look
  const cleanTitle = title.replace(/[.!?]+$/, "");

  return (
    <LegalPresenceContext.Provider value={{ counts: presenceCounts, total: presenceTotal }}>
    <AppLayout>
      <SEO title={metaTitle} description={metaDescription} url={canonical} />

      {/* Simple header */}
      <header className="border-b border-border/50 liquid-nav">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-12 sm:pt-20 sm:pb-14">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </p>
            {presenceTotal > 0 && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                aria-live="polite"
                title="Live viewers on this page right now"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                {presenceTotal} {presenceTotal === 1 ? "person" : "people"} reading now
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold tracking-tight text-foreground mb-4 leading-[1.1]">
            {cleanTitle}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Last updated {updated}
          </p>
          <p className="text-base sm:text-lg text-foreground/70 max-w-2xl leading-relaxed">
            {intro}
          </p>
        </div>
      </header>

      {/* Body: simple two-column with sticky TOC */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        <div
          className={cn(
            toc && toc.length > 0
              ? "grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-16"
              : ""
          )}
        >
          {/* Desktop sticky TOC */}
          {toc && toc.length > 0 && (
            <aside className="hidden lg:block">
              <nav className="sticky top-24">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
                  On this page
                </p>
                <ul className="space-y-1 border-l border-border">
                  {toc.map((item) => {
                    const live = presenceCounts[item.index] ?? 0;
                    return (
                    <li key={item.index}>
                      <button
                        onClick={() => scrollTo(item.index, "desktop")}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 text-left text-sm py-1.5 pl-4 pr-2 -ml-px border-l-2 transition-colors",
                          activeSection === item.index
                            ? "border-primary text-foreground font-medium"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <span className="truncate">{item.title}</span>
                        {live > 0 && (
                          <span
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary tabular-nums"
                            title={`${live} viewing now`}
                            aria-label={`${live} viewing now`}
                          >
                            <Eye className="h-2.5 w-2.5" />
                            {live}
                          </span>
                        )}
                      </button>
                    </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          )}

          {/* Mobile TOC */}
          {toc && toc.length > 0 && (
            <details className="lg:hidden mb-8 rounded-lg border border-border bg-card">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground flex items-center justify-between">
                <span>On this page</span>
                <span className="text-muted-foreground text-xs">Tap to open</span>
              </summary>
              <ul className="px-2 pb-2">
                {toc.map((item) => (
                  <li key={item.index}>
                    <button
                      onClick={() => scrollTo(item.index, "mobile")}
                      className="block w-full text-left text-sm px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <span className="tabular-nums mr-2 text-xs">
                        {String(item.index).padStart(2, "0")}
                      </span>
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {/* Content */}
          <article className="min-w-0 space-y-12 sm:space-y-14">{children}</article>
        </div>
      </div>
    </AppLayout>
    </LegalPresenceContext.Provider>
  );
};
