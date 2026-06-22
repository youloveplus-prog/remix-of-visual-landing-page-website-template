import { SEO } from "@/components/SEO";
import { AppLayout } from "@/components/layout/AppLayout";
import { FirstRunTour } from "@/components/onboarding/FirstRunTour";
import { useAuth } from "@/hooks/useAuth";
import { AiTutorFab } from "@/components/home/AiTutorFab";
import { LazyMount } from "@/components/home/LazyMount";
import { LiveActivityToaster } from "@/components/home/LiveActivityToaster";
import { LiveActivityFeed } from "@/components/home/higgsfield/LiveActivityFeed";
import { SITE_URL } from "@/config/site";
import { lazy, Suspense, useMemo, type ReactNode } from "react";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

import { HiggsfieldHero } from "@/components/home/higgsfield/HiggsfieldHero";
import { HeroFeatureSlider } from "@/components/home/higgsfield/HeroFeatureSlider";
import { ProductShowcase } from "@/components/home/higgsfield/ProductShowcase";
import { NeonPromoTicker } from "@/components/home/higgsfield/NeonPromoTicker";
import { PromoToolsBlock } from "@/components/home/higgsfield/PromoToolsBlock";
import { SuperagentBand } from "@/components/home/higgsfield/SuperagentBand";
import { ToolsBentoGrid } from "@/components/home/higgsfield/ToolsBentoGrid";
import { ExploreTopicsCloud } from "@/components/home/higgsfield/ExploreTopicsCloud";
import { LiveStatsBar } from "@/components/home/higgsfield/LiveStatsBar";
import { TrendingRail, type TrendingItem } from "@/components/home/higgsfield/TrendingRail";
import { CategoryShelf } from "@/components/home/higgsfield/CategoryShelf";
import { TracksSection } from "@/components/home/higgsfield/TracksSection";
import { AiTutorTeaser } from "@/components/home/higgsfield/AiTutorTeaser";
import { CommunityStrip } from "@/components/home/higgsfield/CommunityStrip";
import { TrustStrip } from "@/components/home/higgsfield/TrustStrip";
import { HomeCtaPanel } from "@/components/home/higgsfield/HomeCtaPanel";
import { MobileAppDownload } from "@/components/home/higgsfield/MobileAppDownload";

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
        <HeroFeatureSlider />
        <HiggsfieldHero />
        <NeonPromoTicker />
        <PromoToolsBlock />
        <SuperagentBand />
        <ToolsBentoGrid />
        <LiveStatsBar />
        <LiveActivityFeed />
        <TrendingRail title="Trending now" items={trending} viewAllHref="/shop?filter=trending" />
        <CategoryShelf />
        <TracksSection />
        <AiTutorTeaser />
        <ProductShowcase
          eyebrow="Project-based"
          title="Courses to ship real things"
          description="Hands-on tracks with code, quizzes, and an AI tutor by your side."
          kinds={["course"]}
          viewAllHref="/shop?type=courses"
          featuredVideo="https://cdn.pixabay.com/video/2023/10/08/184145-873592957_large.mp4"
        />
        <ProductShowcase
          eyebrow="Done-for-you"
          title="Digital services on demand"
          description="1-on-1 mentorship, code reviews, career sprints — booked instantly."
          kinds={["service"]}
          viewAllHref="/shop?type=services"
          accent="text-lime-300"
        />
        <ProductShowcase
          eyebrow="Instant download"
          title="Digital products & toolkits"
          description="E-books, prompt packs and starter kits — delivered to your inbox in seconds."
          kinds={["ebook", "bundle"]}
          viewAllHref="/shop?type=digital"
          accent="text-amber-300"
        />
        <TrendingRail title="New arrivals" items={fresh} viewAllHref="/shop?filter=new" />
        <Deferred><MentorshipSpotlight /></Deferred>
        <Deferred><ResourcesRow /></Deferred>
        <Deferred><GameTeaser /></Deferred>
        <CommunityStrip />
        <Deferred><TestimonialsMarquee /></Deferred>
        <TrustStrip />
        <Deferred><PartnerLogos /></Deferred>
        <Deferred><FaqAccordion /></Deferred>
        <ExploreTopicsCloud />
        <MobileAppDownload />
        <HomeCtaPanel />
      </div>

      <LiveActivityToaster />
      {user && <AiTutorFab />}
    </AppLayout>
  );
};

export default Index;
