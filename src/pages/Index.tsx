import { SEO } from "@/components/SEO";
import { AppLayout } from "@/components/layout/AppLayout";
import { FirstRunTour } from "@/components/onboarding/FirstRunTour";
import { useAuth } from "@/hooks/useAuth";
import { AiTutorFab } from "@/components/home/AiTutorFab";
import { LazyMount } from "@/components/home/LazyMount";
import { SITE_URL } from "@/config/site";
import { lazy, Suspense, useMemo, type ReactNode } from "react";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

import { HiggsfieldHero } from "@/components/home/higgsfield/HiggsfieldHero";
import { NeonPromoTicker } from "@/components/home/higgsfield/NeonPromoTicker";
import { ToolsBentoGrid } from "@/components/home/higgsfield/ToolsBentoGrid";
import { LiveStatsBar } from "@/components/home/higgsfield/LiveStatsBar";
import { TrendingRail, type TrendingItem } from "@/components/home/higgsfield/TrendingRail";
import { CategoryShelf } from "@/components/home/higgsfield/CategoryShelf";
import { TracksSection } from "@/components/home/higgsfield/TracksSection";
import { AiTutorTeaser } from "@/components/home/higgsfield/AiTutorTeaser";
import { CommunityStrip } from "@/components/home/higgsfield/CommunityStrip";
import { TrustStrip } from "@/components/home/higgsfield/TrustStrip";
import { HomeCtaPanel } from "@/components/home/higgsfield/HomeCtaPanel";

// Heavy / below-the-fold sections — lazy-mounted on scroll
const MentorshipSpotlight = lazy(() =>
  import("@/components/home/higgsfield/MentorshipSpotlight").then((m) => ({ default: m.MentorshipSpotlight })),
);
const ResourcesRow = lazy(() =>
  import("@/components/home/higgsfield/ResourcesRow").then((m) => ({ default: m.ResourcesRow })),
);
const GameTeaser = lazy(() =>
  import("@/components/home/higgsfield/GameTeaser").then((m) => ({ default: m.GameTeaser })),
);
const TestimonialsMarquee = lazy(() =>
  import("@/components/home/higgsfield/TestimonialsMarquee").then((m) => ({ default: m.TestimonialsMarquee })),
);
const PartnerLogos = lazy(() =>
  import("@/components/home/higgsfield/PartnerLogos").then((m) => ({ default: m.PartnerLogos })),
);
const FaqAccordion = lazy(() =>
  import("@/components/home/higgsfield/FaqAccordion").then((m) => ({ default: m.FaqAccordion })),
);

const Fallback = () => (
  <div className="px-4 sm:px-6 lg:px-8 pt-10">
    <Skeleton className="h-40 w-full rounded-[12px] bg-white/5" />
  </div>
);

const Deferred = ({ children }: { children: ReactNode }) => (
  <LazyMount fallback={<Fallback />} minHeight="10rem">
    <Suspense fallback={<Fallback />}>{children}</Suspense>
  </LazyMount>
);

const toTrending = (p: any): TrendingItem => ({
  id: p.id,
  title: p.name,
  image: p.image_url || "/placeholder.svg",
  meta: p.category || "Course",
  to: `/product/${p.slug ?? p.id}`,
});

const Index = () => {
  const { user } = useAuth();
  const { data: featured } = useFeaturedProducts(12);
  const { data: products } = useProducts({ limit: 20 });

  const trending = useMemo(() => (featured ?? []).map(toTrending), [featured]);
  const fresh = useMemo(
    () => (products ?? []).slice().reverse().map(toTrending),
    [products],
  );

  return (
    <AppLayout>
      <FirstRunTour />
      <SEO
        title="Asikon — AI-Powered Learning Platform"
        description="Master AI, Python, and modern skills with expert-led courses, a 24/7 AI tutor, and a community of learners."
        url={`${SITE_URL}/`}
      />

      <div className="home-higgsfield min-h-screen pb-10">
        <NeonPromoTicker />
        <FeaturedMediaRow />
        <ToolsBentoGrid />
        <LiveStatsBar />
        <TrendingRail title="Trending now" items={trending} viewAllHref="/shop?filter=trending" />
        <CategoryShelf />
        <TracksSection />
        <AiTutorTeaser />
        <TrendingRail title="New arrivals" items={fresh} viewAllHref="/shop?filter=new" />
        <Deferred><MentorshipSpotlight /></Deferred>
        <Deferred><ResourcesRow /></Deferred>
        <Deferred><GameTeaser /></Deferred>
        <CommunityStrip />
        <Deferred><TestimonialsMarquee /></Deferred>
        <TrustStrip />
        <Deferred><PartnerLogos /></Deferred>
        <Deferred><FaqAccordion /></Deferred>
        <HomeCtaPanel />
      </div>

      {user && <AiTutorFab />}
    </AppLayout>
  );
};

export default Index;
