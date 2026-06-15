import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { useScrollParallax } from "@/hooks/useScrollParallax";
import { cn } from "@/lib/utils";

/**
 * Spread 1 — Cover.
 * Headline rises word-by-word on enter, then drifts slowly with scroll.
 * Pull-quote + CTAs fade up on stagger. Quiet, intentional motion.
 */
export function EditorialCover() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const { ref: headlineRef, inView } = useInViewOnce<HTMLHeadingElement>();
  const { ref: parallaxRef, offset } = useScrollParallax<HTMLDivElement>(28);

  const words = ["Learning,", "re-imagined", "for every", "student."];

  return (
    <Spread pageNumber="01 / 05" rule={false}>
      <div ref={parallaxRef} className="pt-8 lg:pt-16">
        <div className="flex items-center justify-between mb-10 lg:mb-16">
          <span className="editorial-eyebrow">Issue No. 06 · {today}</span>
          <span className="editorial-eyebrow hidden sm:inline">An AI-powered learning journal</span>
        </div>

        <h1
          ref={headlineRef}
          className={cn("editorial-display editorial-word-rise max-w-[14ch]", inView && "is-in")}
          style={{
            transform: `translate3d(0, ${offset * -0.3}px, 0)`,
            willChange: "transform",
          }}
        >
          {words.map((w, i) => (
            <span
              key={i}
              style={{ transitionDelay: `${100 + i * 110}ms` }}
              className={i === 1 ? "text-primary" : undefined}
            >
              {w}
              {i < words.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>

        <div className="mt-10 lg:mt-16 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 items-end">
          <Reveal delay={520}>
            <p
              className="editorial-pullquote max-w-[28ch]"
              style={{ transform: `translate3d(0, ${offset * 0.15}px, 0)` }}
            >
              “We're building the calmest, smartest place on the internet to learn —
              one lesson, one mentor, one breakthrough at a time.”
            </p>
            <p className="editorial-eyebrow mt-4">— The ASIKON editors</p>
          </Reveal>

          <Reveal delay={620}>
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
