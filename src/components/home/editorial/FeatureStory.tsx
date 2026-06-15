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
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 sm:gap-10 lg:gap-16 items-center">
        <Reveal>
          <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-muted">
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
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <p className="editorial-eyebrow mb-3">This week</p>
            <h2 className="editorial-headline mb-3">
              {lead?.name ?? "The course we'd start with today."}
            </h2>
            <p className="editorial-dek mb-6 max-w-[42ch]">
              A calm, hand-picked starting point — paired with a 24/7 AI tutor.
            </p>
            <div className="flex items-baseline gap-3 mb-6">
              {lead?.price !== undefined && (
                <span className="font-display font-bold text-xl sm:text-2xl tabular-nums">
                  ৳{lead.price}
                </span>
              )}
              {lead?.original_price && (
                <span className="text-sm text-muted-foreground line-through tabular-nums">
                  ৳{lead.original_price}
                </span>
              )}
            </div>
            <Button asChild variant="premium" size="lg" className="w-full sm:w-auto">
              <Link to={lead?.slug ? `/product/${lead.slug}` : "/shop"}>
                View course
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>

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
