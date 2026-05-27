import { SEO } from "@/components/SEO";
import { Gift, Flame, Sparkles, GraduationCap, BookOpen, ArrowUpRight, Play, CalendarDays, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { lazy, Suspense, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { FirstRunTour } from "@/components/onboarding/FirstRunTour";

import { PostCard } from "@/components/community/PostCard";
import { ProductCarousel } from "@/components/carousels";
import { mockPosts } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import { MobileScroller } from "@/components/ui/mobile-scroller";
import { GreetingStrip } from "@/components/home/workspace/GreetingStrip";
import { QuickAccessGrid } from "@/components/home/workspace/QuickAccessGrid";
import { ProgressSnapshot } from "@/components/home/workspace/ProgressSnapshot";
import { ContinueLearningRow } from "@/components/home/workspace/ContinueLearningRow";
import { AiAssistantBox } from "@/components/home/workspace/AiAssistantBox";
import { ActivityFeed } from "@/components/home/workspace/ActivityFeed";
import { MobileCoursesTop } from "@/components/home/mobile/MobileCoursesTop";
import { ImageHeroSlider } from "@/components/home/mobile/ImageHeroSlider";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { useHomeSections, HomeSection } from "@/hooks/useHomeSections";
import { useAuth } from "@/hooks/useAuth";
import { TodayMissionCard } from "@/features/mission/TodayMissionCard";

// Lazy-load below-the-fold sections so their JS doesn't block first paint.
const HowItWorks = lazy(() => import("@/components/home/sections/HowItWorks").then(m => ({ default: m.HowItWorks })));
const WhyTrust = lazy(() => import("@/components/home/sections/WhyTrust").then(m => ({ default: m.WhyTrust })));
const MentorshipHomeSection = lazy(() => import("@/components/mentorship/MentorshipHomeSection").then(m => ({ default: m.MentorshipHomeSection })));
const SectionFallback = () => <div className="section-x"><Skeleton className="w-full h-32 rounded-2xl" /></div>;



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

const quickCategories = [
  { icon: GraduationCap, label: "Courses", href: "/shop?type=courses" },
  { icon: BookOpen, label: "Books", href: "/shop?type=books" },
  { icon: Sparkles, label: "Prompts", href: "/prompts" },
  { icon: Flame, label: "Trending", href: "/shop?filter=trending" },
];

const ProductCardSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border/50 flex flex-col h-full">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="p-3 flex flex-col flex-1 gap-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <div className="flex items-center justify-between mt-auto">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-3 w-8" />
      </div>
    </div>
  </div>
);

const CarouselSkeleton = ({ title }: { title: string }) => (
  <div>
    <div className="flex items-center justify-between mb-3 section-x">
      <h2 className="font-semibold text-lg">{title}</h2>
    </div>
    <div className="flex gap-3 overflow-hidden pl-4 lg:pl-0">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex-[0_0_45%] sm:flex-[0_0_35%] md:flex-[0_0_28%] lg:flex-[0_0_22%] xl:flex-[0_0_18%]">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

type RenderCtx = {
  sec: HomeSection;
  products: any[] | undefined;
  featuredProducts: any[] | undefined;
  productsLoading: boolean;
  featuredLoading: boolean;
  trendingItems: any[];
  newArrivalItems: any[];
  curated: any[];
};

const SECTION_RENDERERS: Record<string, (ctx: RenderCtx) => JSX.Element | null> = {
  hero: () => <ImageHeroSlider />,
  mentorship: () => <MentorshipHomeSection />,
  quick_actions: () => (
    <Reveal as="section" className="section-x">
      {/* Mobile: 2 compact tiles. Desktop: 2 wide cards. */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <Link
          to="/learn"
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 sm:p-4 pressable focus-ring"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[13px] sm:text-sm flex items-center gap-1 truncate">
                AI Tutor
                <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">24/7 · Bangla & English</p>
            </div>
          </div>
        </Link>
        <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[13px] sm:text-sm truncate">Daily streak</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground truncate">+30 XP today</p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  ),
  quick_categories: () => (
    <section className="section-x">
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {quickCategories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Reveal key={cat.label} delay={i * 60} variant="scale">
              <Link
                to={cat.href}
                className="pressable focus-ring flex flex-col items-center justify-center gap-1.5 aspect-[1.1] rounded-2xl bg-card border border-border hover:border-foreground/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Icon className="h-[16px] w-[16px] text-foreground" />
                </div>
                <span className="text-[11px] font-medium">{cat.label}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  ),
  trending: ({ sec, featuredLoading, trendingItems }) => (
    <Reveal as="section">
      {featuredLoading ? (
        <CarouselSkeleton title={sec.title_override ?? "Trending now"} />
      ) : (
        <ProductCarousel products={trendingItems} title={sec.title_override ?? "Trending now"} viewAllHref="/shop?filter=trending" />
      )}
    </Reveal>
  ),
  community: ({ sec }) => (
    <Reveal as="section" className="section-x">
      <SectionHeader
        title={sec.title_override ?? "From the community"}
        viewAllHref="/community"
        viewAllLabel="View all"
      />
      <PostCard post={mockPosts[0]} />
    </Reveal>
  ),
  how_it_works: ({ sec }) => <HowItWorks title={sec.title_override ?? undefined} />,
  why_trust: ({ sec }) => <WhyTrust title={sec.title_override ?? undefined} />,
  curated: ({ sec, productsLoading, curated }) => (
    <section className="section-x">
      <SectionHeader title={sec.title_override ?? "Curated for you"} viewAllHref="/shop" />
      {productsLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (<ProductCardSkeleton key={i} />))}
        </div>
      ) : (
        <MobileScroller itemWidthMobile="46%" gridCols="md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" gap="gap-3 lg:gap-4">
          {curated.map((p: any) => (
            <Link key={p.id} to={`/product/${p.slug}`} className="h-full block focus-ring rounded-2xl">
              <ProductCard product={transformProduct(p)} variant="compact" />
            </Link>
          ))}
        </MobileScroller>
      )}
    </section>
  ),
  new_arrivals: ({ sec, productsLoading, newArrivalItems }) => (
    <Reveal as="section">
      {productsLoading ? (
        <CarouselSkeleton title={sec.title_override ?? "New arrivals"} />
      ) : (
        <ProductCarousel products={newArrivalItems} title={sec.title_override ?? "New arrivals"} viewAllHref="/shop?filter=new" />
      )}
    </Reveal>
  ),
};

const Index = () => {
  const { user } = useAuth();
  
  const { data: products, isLoading: productsLoading } = useProducts({ limit: 20 });
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts(10);
  const { data: sections } = useHomeSections();

  const trendingItems = useMemo(() => featuredProducts?.map(transformProduct) || [], [featuredProducts]);
  const newArrivalItems = useMemo(() => products?.slice().reverse().map(transformProduct) || [], [products]);
  const curated = useMemo(() => products?.slice(0, 10) || [], [products]);

  const enabledSections = useMemo(() => (sections ?? []).filter((s) => s.enabled), [sections]);

  const heroSection = enabledSections.find((s) => s.key === "hero");
  const restSections = enabledSections.filter((s) => s.key !== "hero");

  const renderSection = (sec: HomeSection) => {
    const render = SECTION_RENDERERS[sec.key];
    if (!render) return null;
    return (
      <div key={sec.id}>
        <Suspense fallback={<SectionFallback />}>
          {render({ sec, products, featuredProducts, productsLoading, featuredLoading, trendingItems, newArrivalItems, curated })}
        </Suspense>
      </div>
    );
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
            { "@type": "Question", name: "Is cash on delivery available?", acceptedAnswer: { "@type": "Answer", text: "Yes — cash on delivery is available across Bangladesh on all shop orders." } },
            { "@type": "Question", name: "Do I get a certificate?", acceptedAnswer: { "@type": "Answer", text: "Yes, every Asikon course includes a verified completion certificate you can share on LinkedIn or your CV." } },
          ],
        })}</script>
      </SEO>
      <MobilePage spacing="space-y-4 lg:space-y-14">
        {user ? (
          <>
            {/* 1 — Calm greeting */}
            <GreetingStrip />

            {/* 2 — The single most important thing on the screen */}
            <section className="section-x">
              <TodayMissionCard />
            </section>

            {/* 3 — Continue where you left off */}
            <ContinueLearningRow />

            {/* 4 — Four calm tiles: Tutor / Shop / Community / Mentors */}
            <QuickAccessGrid />

            {/* 5 — Editorial hero (admin banners) */}
            {heroSection && <ImageHeroSlider />}

            {/* 6 — AI assistant entry */}
            <AiAssistantBox />

            {/* 7 — Discovery: courses + commerce sections (admin-ordered) */}
            <MobileCoursesTop />
            {restSections.map(renderSection)}

            {/* 8 — Quiet personal footer: progress + activity */}
            <ProgressSnapshot />
            <ActivityFeed />
          </>
        ) : (
          <>
            {heroSection && renderSection(heroSection)}
            <QuickAccessGrid />
            {restSections.map(renderSection)}
          </>
        )}
      </MobilePage>
    </AppLayout>
  );
};

export default Index;
