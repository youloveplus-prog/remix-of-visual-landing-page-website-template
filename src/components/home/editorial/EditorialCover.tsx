import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";
import { ParallaxLayer, WordRise } from "./motion-primitives";
import { EDITORIAL_DELAY, EDITORIAL_PARALLAX } from "./motion";

export function EditorialCover() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Each word is its own segment so the second one ("re-imagined") can be
  // colored without breaking the per-word stagger.
  const segments = [
    <>Learning,<br /></>,
    <span className="text-primary">re-imagined<br /></span>,
    <>for every<br /></>,
    <>student.</>,
  ];

  return (
    <Spread pageNumber="01 / 05" rule={false}>
      <ParallaxLayer strength={EDITORIAL_PARALLAX.coverHeadline} factor={-0.3} className="pt-8 lg:pt-16">
        <div className="flex items-center justify-between mb-10 lg:mb-16">
          <span className="editorial-eyebrow">Issue No. 06 · {today}</span>
          <span className="editorial-eyebrow hidden sm:inline">An AI-powered learning journal</span>
        </div>

        <WordRise
          words={segments}
          baseDelay={EDITORIAL_DELAY.wordBase}
          step={EDITORIAL_DELAY.wordStep}
          className="editorial-display max-w-[14ch]"
        />

        <div className="mt-10 lg:mt-16 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 items-end">
          <Reveal delay={EDITORIAL_DELAY.bodyAfterHeadline}>
            <ParallaxLayer strength={EDITORIAL_PARALLAX.coverPullquote} factor={0.15}>
              <p className="editorial-pullquote max-w-[28ch]">
                “We're building the calmest, smartest place on the internet to learn —
                one lesson, one mentor, one breakthrough at a time.”
              </p>
              <p className="editorial-eyebrow mt-4">— The ASIKON editors</p>
            </ParallaxLayer>
          </Reveal>

          <Reveal delay={EDITORIAL_DELAY.ctaAfterHeadline}>
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
      </ParallaxLayer>
    </Spread>
  );
}
