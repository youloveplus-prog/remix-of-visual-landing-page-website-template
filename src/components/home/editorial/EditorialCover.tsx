import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";

/**
 * Spread 1 — Cover.
 * Mission/brand lead. Oversize wordmark, a single Sentient pull-quote, two entry CTAs.
 * Intentionally still and quiet — no marquee, no carousels.
 */
export function EditorialCover() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Spread pageNumber="01 / 05" rule={false}>
      <div className="pt-8 lg:pt-16">
        <div className="flex items-center justify-between mb-10 lg:mb-16">
          <span className="editorial-eyebrow">Issue No. 06 · {today}</span>
          <span className="editorial-eyebrow hidden sm:inline">An AI-powered learning journal</span>
        </div>

        <Reveal>
          <h1 className="editorial-display max-w-[14ch]">
            Learning,
            <br />
            <span className="text-primary">re-imagined</span>
            <br />
            for every
            <br />
            student.
          </h1>
        </Reveal>

        <div className="mt-10 lg:mt-16 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 items-end">
          <Reveal delay={120}>
            <p className="editorial-pullquote max-w-[28ch]">
              “We're building the calmest, smartest place on the internet to learn —
              one lesson, one mentor, one breakthrough at a time.”
            </p>
            <p className="editorial-eyebrow mt-4">— The ASIKON editors</p>
          </Reveal>

          <Reveal delay={180}>
            <div className="flex flex-col gap-3 max-w-sm lg:ml-auto">
              <Link
                to="/shop"
                className="group inline-flex items-center justify-between gap-3 rounded-full bg-foreground text-background px-6 py-4 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              >
                Enter the library
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/mentors"
                className="group inline-flex items-center justify-between gap-3 rounded-full border border-foreground/15 px-6 py-4 text-sm font-semibold text-foreground transition-colors hover:border-foreground/40"
              >
                Find a 1-on-1 mentor
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </Spread>
  );
}
