import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TodayMissionCard } from "@/features/mission/TodayMissionCard";
import { ParallaxLayer } from "./motion-primitives";
import { EDITORIAL_PARALLAX } from "./motion";
import { Button } from "@/components/ui/button";

const ContinueLearningRow = lazy(() =>
  import("@/components/home/workspace/ContinueLearningRow").then((m) => ({
    default: m.ContinueLearningRow,
  })),
);

export function FeatureStory() {
  const { user } = useAuth();
  const { data: featured, isLoading } = useFeaturedProducts(1);
  const lead = featured?.[0];

  return (
    <Spread label="Feature">
      <Reveal>
        <article className="relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-foreground/12 bg-card shadow-[inset_0_1px_0_hsl(var(--foreground)/0.06),0_30px_60px_-40px_hsl(var(--primary)/0.35)]">

          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-0 lg:gap-0 mt-3 sm:mt-6">
            {/* Image side */}
            <div className="relative px-4 sm:px-8 lg:pl-8 lg:pr-4">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[5/6] rounded-xl sm:rounded-3xl overflow-hidden bg-muted ring-1 ring-foreground/5">
                {isLoading ? (
                  <Skeleton className="absolute inset-0" />
                ) : lead?.image_url ? (
                  <ParallaxLayer
                    strength={EDITORIAL_PARALLAX.featureImage}
                    factor={-0.5}
                    className="absolute inset-[-8%]"
                  >
                    <img
                      src={lead.image_url}
                      alt={lead.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </ParallaxLayer>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                )}

                {/* Floating price tag */}
                {lead?.price !== undefined && (
                  <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 inline-flex items-baseline gap-2 rounded-full bg-background/95 backdrop-blur px-3 py-1.5 sm:px-3.5 sm:py-2 shadow-lg border border-foreground/10">
                    <span className="font-display font-bold text-sm sm:text-lg tabular-nums">
                      ৳{lead.price}
                    </span>
                    {lead?.original_price && (
                      <span className="text-[11px] sm:text-xs text-muted-foreground line-through tabular-nums">
                        ৳{lead.original_price}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Text side */}
            <Reveal delay={120}>
              <div className="px-4 sm:px-8 lg:pl-6 lg:pr-10 py-5 sm:py-8 lg:py-10 flex flex-col">
                <h2 className="editorial-headline mb-2.5 sm:mb-4 text-[clamp(1.35rem,4.2vw,2.75rem)] leading-[1.12] sm:leading-[1.05]">
                  {lead?.name ?? "The course we'd start with today."}
                </h2>
                <p className="editorial-dek mb-4 sm:mb-6 max-w-[44ch] text-muted-foreground text-[13.5px] sm:text-base leading-[1.55] sm:leading-relaxed">
                  A calm, hand-picked starting point — paired with a 24/7 AI tutor.
                </p>

                {/* Trust chips */}
                <ul className="flex flex-wrap gap-2 mb-5 sm:mb-7">
                  {["24/7 AI tutor", "Certificate", "Instant access", "Lifetime"].map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-muted/60 border border-foreground/10 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-medium text-foreground/80"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Button asChild variant="premium" size="default" className="w-full sm:w-auto sm:size-lg">
                    <Link to={lead?.slug ? `/product/${lead.slug}` : "/shop"}>
                      View course
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Link
                    to="/shop"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline text-center sm:text-left"
                  >
                    Browse all courses →
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Decorative indigo glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
          />
        </article>
      </Reveal>


      {user && (
        <div className="mt-10 sm:mt-14 lg:mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="md:col-span-2 lg:col-span-1">
            <TodayMissionCard />
          </div>
          <div className="md:col-span-2">
            <Suspense fallback={<Skeleton className="h-40 rounded-2xl" />}>
              <ContinueLearningRow />
            </Suspense>
          </div>
        </div>
      )}
    </Spread>
  );
}
