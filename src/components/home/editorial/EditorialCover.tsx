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
    <span className="text-primary">re-imagined<br /></span>,
    <>for every<br /></>,
    <>student.</>,
  ];

  return (
    <Spread pageNumber="01 / 05" rule={false}>
      <ParallaxLayer
        strength={EDITORIAL_PARALLAX.coverHeadline}
        factor={-0.3}
        className="pt-6 sm:pt-10 lg:pt-16"
      >
        <div className="flex items-center justify-between mb-8 sm:mb-10 lg:mb-16">
          <span className="editorial-eyebrow">Issue No. 06 · {today}</span>
          <span className="editorial-eyebrow hidden sm:inline">
            An AI-powered learning journal
          </span>
        </div>

        {/* Centered headline */}
        <div className="flex flex-col items-center text-center">
          <WordRise
            words={segments}
            baseDelay={EDITORIAL_DELAY.wordBase}
            step={EDITORIAL_DELAY.wordStep}
            className="editorial-display max-w-[14ch] sm:max-w-[18ch]"
          />

          <Reveal delay={EDITORIAL_DELAY.bodyAfterHeadline} className="w-full mt-7 sm:mt-10 lg:mt-14">
            <ParallaxLayer strength={EDITORIAL_PARALLAX.coverPullquote} factor={0.15}>
              <p className="editorial-pullquote max-w-[30ch] sm:max-w-[34ch] mx-auto px-2">
                “We're building the calmest, smartest place on the internet to learn —
                one lesson, one mentor, one breakthrough at a time.”
              </p>
              <p className="editorial-eyebrow mt-3 sm:mt-4">— The ASIKON editors</p>
            </ParallaxLayer>
          </Reveal>

          <Reveal
            delay={EDITORIAL_DELAY.ctaAfterHeadline}
            className="mt-8 sm:mt-10 w-full flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-center"
          >
            <Button asChild variant="premium" size="xl" className="w-full sm:w-auto sm:min-w-[14rem]">
              <Link to="/shop">
                Enter the library
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="premium-outline" size="xl" className="w-full sm:w-auto sm:min-w-[14rem]">
              <Link to="/mentors">
                Find a 1-on-1 mentor
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </ParallaxLayer>
    </Spread>
  );
}
