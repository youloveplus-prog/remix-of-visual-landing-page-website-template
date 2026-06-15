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
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <AppLayout>
      <SEO title={metaTitle} description={metaDescription} url={canonical} />

      {/* Warm gradient hero header */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--chip-butter)/0.35)] via-[hsl(var(--chip-lavender)/0.15)] to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-aurora pointer-events-none opacity-40" />
        <div className="relative container-editorial max-w-3xl text-center mx-auto px-4">
          <p className="eyebrow-bar mb-4 justify-center">{eyebrow}</p>
          <h1 className="display-1 mb-5">{title}</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
            Updated {updated}
          </p>
          <p className="body-lg text-muted-foreground max-w-xl mx-auto">{intro}</p>
        </div>
      </section>

      {/* Content: TOC sidebar + bento cards */}
      <section className="pb-24 sm:pb-32">
        <div
          className={cn(
            "mx-auto px-4 sm:px-6",
            toc && toc.length > 0
              ? "max-w-6xl grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 lg:gap-12"
              : "max-w-3xl"
          )}
        >
          {/* Sticky TOC sidebar */}
          {toc && toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <nav className="rounded-2xl bg-white/70 backdrop-blur-md border border-[hsl(var(--border))] p-4 shadow-sm">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold mb-3 px-2">
                    Contents
                  </p>
                  <ul className="space-y-1">
                    {toc.map((item) => (
                      <li key={item.index}>
                        <button
                          onClick={() => scrollTo(item.index)}
                          className={cn(
                            "w-full text-left text-sm px-3 py-2 rounded-xl transition-all duration-200",
                            activeSection === item.index
                              ? "bg-[hsl(var(--primary))] text-white font-medium shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted))]"
                          )}
                        >
                          <span className="font-dot mr-2 opacity-60">
                            {String(item.index).padStart(2, "0")}
                          </span>
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
          )}

          {/* Mobile TOC (horizontal chips) */}
          {toc && toc.length > 0 && (
            <div className="lg:hidden -mx-4 px-4 mb-6 overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {toc.map((item) => (
                  <button
                    key={item.index}
                    onClick={() => scrollTo(item.index)}
                    className={cn(
                      "text-sm px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 border",
                      activeSection === item.index
                        ? "bg-[hsl(var(--primary))] text-white border-transparent shadow-sm"
                        : "bg-white/60 text-muted-foreground border-[hsl(var(--border))] hover:bg-white"
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card grid */}
          <div className={cn("space-y-4", toc && toc.length > 0 ? "" : "max-w-3xl mx-auto")}>
            {children}
          </div>
        </div>
      </section>
    </AppLayout>
  );
};
