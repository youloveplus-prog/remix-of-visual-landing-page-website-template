import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";
import { ParallaxLayer, WordRise } from "./motion-primitives";
import { EDITORIAL_DELAY, EDITORIAL_PARALLAX } from "./motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDotMatrixToggle } from "@/hooks/useDotMatrixToggle";
import { useState, useCallback } from "react";

export function EditorialCover() {
  const [dotMatrixEnabled, toggleDotMatrix] = useDotMatrixToggle();
  const [liveText, setLiveText] = useState("");

  const segments = [
    <>Learning,<br /></>,
    <span className="text-primary">re-imagined.</span>,
  ];

  const handleToggle = useCallback((checked: boolean) => {
    toggleDotMatrix();
    setLiveText(`Dot-matrix animation ${checked ? "enabled" : "disabled"}`);
  }, [toggleDotMatrix]);

  return (
    <Spread rule={false}>
      <ParallaxLayer
        strength={EDITORIAL_PARALLAX.coverHeadline}
        factor={-0.3}
        className="pt-10 sm:pt-14 lg:pt-20"
      >
        <div className="flex flex-col items-center text-center">
          <WordRise
            words={segments}
            baseDelay={EDITORIAL_DELAY.wordBase}
            step={EDITORIAL_DELAY.wordStep}
            className="editorial-display max-w-[14ch]"
          />

          <Reveal delay={EDITORIAL_DELAY.bodyAfterHeadline} className="w-full mt-7 sm:mt-9 lg:mt-12">
            <ParallaxLayer strength={EDITORIAL_PARALLAX.coverPullquote} factor={0.15}>
              <p className={cn("editorial-pullquote dot-matrix-type max-w-[28ch] mx-auto px-2", !dotMatrixEnabled && "no-animation")}>
                The calmest place on the internet to learn.
              </p>
              <span id="dot-matrix-desc" className="sr-only">
                Toggles the dot-matrix flicker effect on the pullquote text
              </span>
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                {liveText}
              </div>
              <label htmlFor="dot-matrix-toggle" className="mt-3 inline-flex items-center gap-2 cursor-pointer select-none py-2.5 px-1 -mx-1 rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                <Switch
                  id="dot-matrix-toggle"
                  checked={dotMatrixEnabled}
                  onCheckedChange={handleToggle}
                  aria-describedby="dot-matrix-desc"
                />
                <span className="text-xs text-muted-foreground font-medium tracking-wide">
                  Animate
                </span>
              </label>
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
