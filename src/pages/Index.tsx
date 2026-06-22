import { SEO } from "@/components/SEO";
import { AppLayout } from "@/components/layout/AppLayout";
import { FirstRunTour } from "@/components/onboarding/FirstRunTour";
import { useAuth } from "@/hooks/useAuth";
import { AiTutorFab } from "@/components/home/AiTutorFab";
import { SITE_URL } from "@/config/site";
import { useMemo } from "react";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";

import { NeonPromoTicker } from "@/components/home/higgsfield/NeonPromoTicker";
import { FeaturedMediaRow } from "@/components/home/higgsfield/FeaturedMediaRow";
import { ToolsBentoGrid } from "@/components/home/higgsfield/ToolsBentoGrid";
import { TrendingRail, type TrendingItem } from "@/components/home/higgsfield/TrendingRail";
import { CommunityStrip } from "@/components/home/higgsfield/CommunityStrip";
import { HomeCtaPanel } from "@/components/home/higgsfield/HomeCtaPanel";

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

      <div className="home-higgsfield min-h-screen">
        <NeonPromoTicker />
        <FeaturedMediaRow />
        <ToolsBentoGrid />
        <TrendingRail
          title="Trending now"
          items={trending}
          viewAllHref="/shop?filter=trending"
        />
        <TrendingRail
          title="New arrivals"
          items={fresh}
          viewAllHref="/shop?filter=new"
        />
        <CommunityStrip />
        <HomeCtaPanel />
      </div>

      {user && <AiTutorFab />}
    </AppLayout>
  );
};

export default Index;
