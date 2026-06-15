import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
}: LegalShellProps) => {
  const [activeSection, setActiveSection] = useState(1);

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
    setActiveSection(toc[closest].index);
  }, [toc]);

  useEffect(() => {
    if (!toc) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, toc]);

  const scrollTo = (index: number) => {
    const el = document.getElementById(`section-${index}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Strip trailing punctuation from titles for a cleaner look
  const cleanTitle = title.replace(/[.!?]+$/, "");

  return (
    <AppLayout>
      <SEO title={metaTitle} description={metaDescription} url={canonical} />

      {/* Simple header */}
      <header className="border-b border-border/50 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 pb-12 sm:pt-20 sm:pb-14">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
            {eyebrow}
          </p>
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
                  {toc.map((item) => (
                    <li key={item.index}>
                      <button
                        onClick={() => scrollTo(item.index)}
                        className={cn(
                          "block w-full text-left text-sm py-1.5 pl-4 -ml-px border-l-2 transition-colors",
                          activeSection === item.index
                            ? "border-primary text-foreground font-medium"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
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
                      onClick={() => scrollTo(item.index)}
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
          <article className="min-w-0 space-y-10">{children}</article>
        </div>
      </div>
    </AppLayout>
  );
};
