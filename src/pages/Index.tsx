import { SEO } from "@/components/SEO";
import { lazy, Suspense, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { FirstRunTour } from "@/components/onboarding/FirstRunTour";

import { CommunityCarousel } from "@/components/community/CommunityCarousel";
import { ProductCarousel } from "@/components/carousels";
import { mockPosts } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { useHomeSections, HomeSection } from "@/hooks/useHomeSections";
import { useAuth } from "@/hooks/useAuth";
import { AiTutorFab } from "@/components/home/AiTutorFab";
import { PartnerMarquee } from "@/components/home/PartnerMarquee";

// Editorial spreads
import { EditorialCover } from "@/components/home/editorial/EditorialCover";
import { IssueIndex } from "@/components/home/editorial/IssueIndex";
import { FeatureStory } from "@/components/home/editorial/FeatureStory";
import { Department } from "@/components/home/editorial/Department";
import { Spread } from "@/components/home/editorial/Spread";
import { BackMatter } from "@/components/home/editorial/BackMatter";
import { TrustCarousel } from "@/components/home/editorial/TrustCarousel";

// Lazy department contents — protect first paint
const QuickAccessGrid = lazy(() =>
  import("@/components/home/workspace/QuickAccessGrid").then((m) => ({ default: m.QuickAccessGrid })),
);
const RecommendedForYou = lazy(() =>
  import("@/components/home/workspace/RecommendedForYou").then((m) => ({
    default: m.RecommendedForYou,
  })),
);
const AiAssistantBox = lazy(() =>
  import("@/components/home/workspace/AiAssistantBox").then((m) => ({ default: m.AiAssistantBox })),
);
const MobileCoursesTop = lazy(() =>
  import("@/components/home/mobile/MobileCoursesTop").then((m) => ({ default: m.MobileCoursesTop })),
);
const GalleryCarousel = lazy(() =>
  import("@/components/home/mobile/GalleryCarousel").then((m) => ({ default: m.GalleryCarousel })),
);
const MasterpieceShowcase = lazy(() =>
  import("@/components/home/MasterpieceShowcase").then((m) => ({ default: m.MasterpieceShowcase })),
);
const ComingSoonTrio = lazy(() => import("@/components/home/ComingSoonTrio"));
const MentorshipHomeSection = lazy(() =>
  import("@/components/mentorship/MentorshipHomeSection").then((m) => ({
    default: m.MentorshipHomeSection,
  })),
);

const Fallback = () => <Skeleton className="h-32 w-full rounded-2xl" />;

const transformProduct = (p: any) => ({
  id: p.id,
  name: p.name,
  brand: "Asikon Academy",
  price: p.price,
  originalPrice: p.original_price || undefined,
  image: p.image_url || "/placeholder.svg",
  rating: p.rating || 0,
  reviews: p.review_count || 0,
  isNew: false,
  isTrending: p.is_featured || false,
  slug: p.slug,
});

const Index = () => {
  const { user } = useAuth();

  const { data: products, isLoading: productsLoading } = useProducts({ limit: 20 });
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts(10);
  const { data: sections } = useHomeSections();

  const trendingItems = useMemo(
    () => featuredProducts?.map(transformProduct) || [],
    [featuredProducts],
  );
  const newArrivalItems = useMemo(
    () => products?.slice().reverse().map(transformProduct) || [],
    [products],
  );

  const enabledSections = useMemo(
    () => (sections ?? []).filter((s) => s.enabled),
    [sections],
  );

  // Admin-ordered sections still drive Library carousel order
  const adminLibrarySections = enabledSections.filter((s) =>
    ["trending", "new_arrivals", "curated"].includes(s.key),
  );

  const renderAdminSection = (sec: HomeSection) => {
    if (sec.key === "trending") {
      return featuredLoading ? (
        <Skeleton key={sec.id} className="h-64 rounded-2xl" />
      ) : (
        <ProductCarousel
          key={sec.id}
          products={trendingItems}
          title={sec.title_override ?? "Trending now"}
          viewAllHref="/shop?filter=trending"
        />
      );
    }
    if (sec.key === "new_arrivals") {
      return productsLoading ? (
        <Skeleton key={sec.id} className="h-64 rounded-2xl" />
      ) : (
        <ProductCarousel
          key={sec.id}
          products={newArrivalItems}
          title={sec.title_override ?? "New arrivals"}
          viewAllHref="/shop?filter=new"
        />
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <FirstRunTour />
      <SEO
        title="Asikon — AI-Powered Learning Platform"
        description="Master AI, Python, and modern skills with expert-led courses, a 24/7 AI tutor, and a community of learners."
        url="https://asikonpro.lovable.app/"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What is Asikon?", acceptedAnswer: { "@type": "Answer", text: "Asikon is an AI-powered learning platform with courses, books, a 24/7 AI tutor, and 1-on-1 mentorship." } },
            { "@type": "Question", name: "How do I pay?", acceptedAnswer: { "@type": "Answer", text: "We accept card and bKash. All products are digital with instant access — no shipping required." } },
            { "@type": "Question", name: "Do I get a certificate?", acceptedAnswer: { "@type": "Answer", text: "Yes, every Asikon course includes a verified completion certificate you can share on LinkedIn or your CV." } },
          ],
        })}</script>
      </SEO>

      <div className="home-editorial min-h-screen bg-background">
        <MobilePage
          maxWidth="full"
          padded={false}
          spacing="space-y-12 sm:space-y-20 lg:space-y-32"
          className="pt-0 lg:pt-0 pb-16 sm:pb-20"
        >
          {/* Spread 1 — Cover */}
          <div id="cover">
            <EditorialCover />
          </div>

          {/* Quiet partner marquee */}
          <PartnerMarquee />

          {/* Spread 2 — Issue Index */}
          <div id="issue-index">
            <IssueIndex />
          </div>

          {/* Spread 3 — Trust carousel */}
          <div id="trust">
            <Spread label="Trust">
              <TrustCarousel />
            </Spread>
          </div>

          {/* Spread 4 — Feature Story */}
          <div id="feature-story">
            <FeatureStory />
          </div>

          {/* Spread 5 — Departments */}
          <div id="departments">
            <Spread label="Departments">
              <div className="space-y-14 sm:space-y-16 lg:space-y-24">
                <Department
                  number="05.1"
                  name="Library"
                  dek="Courses, books, and curated collections."
                >
                  <div className="space-y-10">
                    <Suspense fallback={<Fallback />}><MobileCoursesTop /></Suspense>
                    {adminLibrarySections.map(renderAdminSection)}
                    <Suspense fallback={<Fallback />}><GalleryCarousel /></Suspense>
                  </div>
                </Department>

                <Department
                  number="05.2"
                  name="Workshop"
                  dek="Quick access, AI help, and what's next for you."
                >
                  <div className="space-y-8">
                    <Suspense fallback={<Fallback />}><QuickAccessGrid /></Suspense>
                    <Suspense fallback={<Fallback />}><AiAssistantBox /></Suspense>
                    {user && (
                      <Suspense fallback={<Fallback />}><RecommendedForYou /></Suspense>
                    )}
                  </div>
                </Department>

                <Department
                  number="05.3"
                  name="Community"
                  dek="What learners are making this week."
                >
                  <div className="space-y-10">
                    <CommunityCarousel
                      posts={mockPosts}
                      title="From the community"
                      viewAllHref="/community"
                    />
                    <Suspense fallback={<Fallback />}><MasterpieceShowcase /></Suspense>
                  </div>
                </Department>

                <Department
                  number="05.4"
                  name="Mentorship"
                  dek="Personal teachers for children — waitlist only."
                >
                  <div className="space-y-10">
                    <Suspense fallback={<Fallback />}><MentorshipHomeSection /></Suspense>
                    <Suspense fallback={<Fallback />}><ComingSoonTrio /></Suspense>
                  </div>
                </Department>
              </div>
            </Spread>
          </div>

          {/* Spread 6 — Back Matter */}
          <div id="back-matter">
            <BackMatter showPersonal={!!user} />
          </div>
        </MobilePage>
      </div>

      {user && <AiTutorFab />}
    </AppLayout>
  );
};

export default Index;
