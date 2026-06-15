import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";
import { ParallaxLayer, WordRise } from "./motion-primitives";
import { EDITORIAL_DELAY, EDITORIAL_PARALLAX } from "./motion";
import { Button } from "@/components/ui/button";

export function EditorialCover() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const segments = [
    <>Learning,<br /></>,
    <span className="text-primary">re-imagined.</span>,
  ];

  return (
    <Spread rule={false}>
      <ParallaxLayer
        strength={EDITORIAL_PARALLAX.coverHeadline}
        factor={-0.3}
        className="pt-6 sm:pt-10 lg:pt-16"
      >
        <div className="flex items-center justify-between mb-10 sm:mb-12 lg:mb-16">
          <span className="editorial-eyebrow">Issue 06 · {today}</span>
          <span className="editorial-eyebrow hidden lg:inline">
            Learning journal
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <WordRise
            words={segments}
            baseDelay={EDITORIAL_DELAY.wordBase}
            step={EDITORIAL_DELAY.wordStep}
            className="editorial-display max-w-[14ch]"
          />

          <Reveal delay={EDITORIAL_DELAY.bodyAfterHeadline} className="w-full mt-7 sm:mt-9 lg:mt-12">
            <ParallaxLayer strength={EDITORIAL_PARALLAX.coverPullquote} factor={0.15}>
              <p className="editorial-pullquote max-w-[28ch] mx-auto px-2">
                The calmest place on the internet to learn.
              </p>
              <p className="editorial-eyebrow mt-3">— The ASIKON editors</p>
            </ParallaxLayer>
          </Reveal>

          <Reveal
            delay={EDITORIAL_DELAY.ctaAfterHeadline}
            className="mt-8 sm:mt-10 w-full flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-center"
          >
            <Button asChild variant="premium" size="xl" className="w-full sm:w-auto sm:min-w-[12rem]">
              <Link to="/shop">
                Browse courses
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="premium-outline" size="xl" className="w-full sm:w-auto sm:min-w-[12rem]">
              <Link to="/mentors">
                Find a mentor
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </ParallaxLayer>
    </Spread>
  );
}
