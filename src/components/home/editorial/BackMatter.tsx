import { Suspense, lazy } from "react";
import { Spread } from "./Spread";
import { Skeleton } from "@/components/ui/skeleton";

const TestimonialsColumns = lazy(() =>
  import("@/components/home/sections/TestimonialsColumns").then((m) => ({
    default: m.TestimonialsColumns,
  })),
);
const HowItWorks = lazy(() =>
  import("@/components/home/sections/HowItWorks").then((m) => ({ default: m.HowItWorks })),
);
const WhyTrust = lazy(() =>
  import("@/components/home/sections/WhyTrust").then((m) => ({ default: m.WhyTrust })),
);
const ProgressSnapshot = lazy(() =>
  import("@/components/home/workspace/ProgressSnapshot").then((m) => ({
    default: m.ProgressSnapshot,
  })),
);
const ActivityFeed = lazy(() =>
  import("@/components/home/workspace/ActivityFeed").then((m) => ({ default: m.ActivityFeed })),
);

const Fallback = () => <Skeleton className="h-32 w-full rounded-2xl" />;

interface BackMatterProps {
  showPersonal: boolean;
}

/**
 * Spread 5 — Back Matter.
 * Trust + how-it-works + (auth) personal progress, closing with a colophon line.
 */
export function BackMatter({ showPersonal }: BackMatterProps) {
  return (
    <Spread pageNumber="06" label="Back Matter">
      <div className="space-y-14 sm:space-y-16 lg:space-y-24">
        <Suspense fallback={<Fallback />}>
          <TestimonialsColumns />
        </Suspense>

        <Suspense fallback={<Fallback />}>
          <HowItWorks />
        </Suspense>

        <Suspense fallback={<Fallback />}>
          <WhyTrust />
        </Suspense>

        {showPersonal && (
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <Suspense fallback={<Fallback />}>
              <ProgressSnapshot />
            </Suspense>
            <Suspense fallback={<Fallback />}>
              <ActivityFeed />
            </Suspense>
          </div>
        )}

        <div className="pt-6 border-t border-foreground/10">
          <p className="editorial-eyebrow">
            Set in Plus Jakarta Sans. Made in Dhaka.
          </p>
        </div>
      </div>
    </Spread>
  );
}
