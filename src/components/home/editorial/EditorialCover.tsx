import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Star, Wand2, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";
import { ParallaxLayer, WordRise } from "./motion-primitives";
import { EDITORIAL_DELAY, EDITORIAL_PARALLAX } from "./motion";
import { Button } from "@/components/ui/button";

import { useDotMatrixToggle } from "@/hooks/useDotMatrixToggle";
import { useState, useCallback } from "react";
import heroHome from "@/assets/hero-home.jpg";

export function EditorialCover() {
  const [dotMatrixEnabled, toggleDotMatrix] = useDotMatrixToggle();
  const [liveText, setLiveText] = useState("");

  const segments = [
    <>Learning,<br /></>,
    <span className="text-primary">re-imagined.</span>,
  ];

  const handleToggle = useCallback(
    (checked: boolean) => {
      toggleDotMatrix();
      setLiveText(`Dot-matrix animation ${checked ? "enabled" : "disabled"}`);
    },
    [toggleDotMatrix],
  );

  return (
    <Spread rule={false}>
      <ParallaxLayer
        strength={EDITORIAL_PARALLAX.coverHeadline}
        factor={-0.3}
        className="pt-6 sm:pt-10 lg:pt-14"
      >
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
          {/* ===== Left column — text ===== */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Eyebrow chip */}
            <Reveal delay={0} className="mb-5 lg:mb-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3 w-3" />
                Built in Bangla &amp; English
              </span>
            </Reveal>

            <WordRise
              words={segments}
              baseDelay={EDITORIAL_DELAY.wordBase}
              step={EDITORIAL_DELAY.wordStep}
              className="editorial-display max-w-[14ch]"
            />

            <Reveal
              delay={EDITORIAL_DELAY.bodyAfterHeadline}
              className="w-full mt-5 sm:mt-7 lg:mt-8"
            >
              <ParallaxLayer strength={EDITORIAL_PARALLAX.coverPullquote} factor={0.15}>
                <p
                  className={cn(
                    "editorial-pullquote dot-matrix-type max-w-[34ch] lg:max-w-[40ch] mx-auto lg:mx-0 px-2 lg:px-0",
                    !dotMatrixEnabled && "no-animation",
                  )}
                >
                  The calmest place on the internet to learn.
                </p>
                <div aria-live="polite" aria-atomic="true" className="sr-only">
                  {liveText}
                </div>
              </ParallaxLayer>
            </Reveal>

            <Reveal
              delay={EDITORIAL_DELAY.ctaAfterHeadline}
              className="mt-7 sm:mt-8 w-full flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-center lg:justify-start"
            >
              <Button asChild variant="premium" size="xl" className="w-full sm:w-auto sm:min-w-[12rem]">
                <Link to="/learn">
                  <Sparkles className="h-4 w-4" />
                  Try the AI tutor free
                </Link>
              </Button>
              <Button
                asChild
                variant="premium-outline"
                size="xl"
                className="w-full sm:w-auto sm:min-w-[12rem]"
              >
                <Link to="/shop">
                  Browse courses
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </Reveal>

            {/* Mobile-only floating tile row (matches the desktop hero story) */}
            <Reveal
              delay={EDITORIAL_DELAY.ctaAfterHeadline + 80}
              className="mt-5 grid grid-cols-2 gap-2.5 w-full lg:hidden"
            >
              <div className="rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md shadow-md shadow-primary/5 p-3 flex items-center gap-2.5 text-left">
                <div className="h-9 w-9 rounded-xl bg-primary/15 grid place-items-center text-primary shrink-0">
                  <Wand2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold leading-tight flex items-center gap-1.5">
                    Live AI tutor
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </p>
                  <p className="text-[10.5px] text-muted-foreground mt-0.5 truncate">
                    Bangla &amp; English · 24/7
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md shadow-md shadow-primary/5 p-3 flex items-center gap-2.5 text-left">
                <div className="h-9 w-9 rounded-xl bg-amber-500/15 grid place-items-center text-amber-600 shrink-0">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold leading-tight">1-on-1 mentor</p>
                  <p className="text-[10.5px] text-muted-foreground mt-0.5 truncate">
                    Personal teacher · waitlist
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Social proof row */}
            <Reveal
              delay={EDITORIAL_DELAY.ctaAfterHeadline + 120}
              className="mt-6 lg:mt-7 flex items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2" aria-hidden>
                {[
                  "from-primary/70 to-primary/30",
                  "from-amber-400/80 to-amber-200/40",
                  "from-emerald-400/80 to-emerald-200/40",
                  "from-rose-400/80 to-rose-200/40",
                ].map((grad, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-7 w-7 rounded-full ring-2 ring-background bg-gradient-to-br",
                      grad,
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[12.5px]">
                  Loved by{" "}
                  <span className="font-semibold text-foreground">thousands</span> of learners
                </span>
              </div>
            </Reveal>
          </div>

          {/* ===== Right column — hero visual (desktop) ===== */}
          <Reveal
            delay={EDITORIAL_DELAY.bodyAfterHeadline}
            variant="scale"
            className="hidden lg:block"
          >
            <ParallaxLayer strength={EDITORIAL_PARALLAX.featureImage} factor={0.18}>
              <div className="relative">
                {/* Soft indigo glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-8 rounded-[40px] bg-primary/15 blur-3xl"
                />
                {/* Image card */}
                <div className="relative overflow-hidden rounded-[32px] border border-border/60 bg-card shadow-2xl shadow-primary/10 aspect-square">
                  <img
                    src={heroHome}
                    alt="A learner studying with a laptop by a sunlit window"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent"
                  />
                </div>

                {/* Floating tile — AI tutor */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: [0, -8, 0] }}
                  transition={{
                    opacity: { delay: 0.6, duration: 0.5 },
                    y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute -left-6 top-10 rounded-2xl border border-border/70 bg-background/95 backdrop-blur-md shadow-xl shadow-primary/10 p-3 pr-4 flex items-center gap-3"
                >
                  <div className="h-9 w-9 rounded-xl bg-primary/15 grid place-items-center text-primary">
                    <Wand2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[12px] font-semibold leading-tight">Live AI tutor</p>
                    <p className="text-[10.5px] text-muted-foreground mt-0.5">
                      Bangla &amp; English · 24/7
                    </p>
                  </div>
                  <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </motion.div>

                {/* Floating tile — Mentor */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: [0, -6, 0] }}
                  transition={{
                    opacity: { delay: 0.85, duration: 0.5 },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                  }}
                  className="absolute -right-4 bottom-10 rounded-2xl border border-border/70 bg-background/95 backdrop-blur-md shadow-xl shadow-primary/10 p-3 pr-4 flex items-center gap-3"
                >
                  <div className="h-9 w-9 rounded-xl bg-amber-500/15 grid place-items-center text-amber-600">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[12px] font-semibold leading-tight">
                      1-on-1 mentor
                    </p>
                    <p className="text-[10.5px] text-muted-foreground mt-0.5">
                      Personal teacher · waitlist
                    </p>
                  </div>
                </motion.div>
              </div>
            </ParallaxLayer>
          </Reveal>
        </div>
      </ParallaxLayer>
    </Spread>
  );
}
