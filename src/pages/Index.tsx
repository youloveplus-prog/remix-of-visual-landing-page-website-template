import { SEO } from "@/components/SEO";
import { Gift, Flame, Sparkles, GraduationCap, BookOpen, ArrowUpRight, Play, CalendarDays, BarChart3, ShoppingBag, Trophy, Users, MessageCircle, Wand2, Library, Bookmark, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { lazy, Suspense, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { FirstRunTour } from "@/components/onboarding/FirstRunTour";

import { PostCard } from "@/components/community/PostCard";
import { CommunityCarousel } from "@/components/community/CommunityCarousel";
import { ProductCarousel } from "@/components/carousels";
import { mockPosts } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import { MobileScroller } from "@/components/ui/mobile-scroller";
import { GreetingStrip } from "@/components/home/workspace/GreetingStrip";
import { QuickAccessGrid } from "@/components/home/workspace/QuickAccessGrid";
import { ImageHeroSlider } from "@/components/home/mobile/ImageHeroSlider";
import { FlexiTopSection } from "@/components/home/mobile/FlexiTopSection";
import { DesktopHeroBento } from "@/components/home/desktop/DesktopHeroBento";
import { BrandStrip } from "@/components/home/BrandStrip";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { useHomeSections, HomeSection } from "@/hooks/useHomeSections";
import { useAuth } from "@/hooks/useAuth";
import { TodayMissionCard } from "@/features/mission/TodayMissionCard";

// Lazy-load below-the-fold sections so their JS doesn't block first paint.
const HowItWorks = lazy(() => import("@/components/home/sections/HowItWorks").then(m => ({ default: m.HowItWorks })));
const WhyTrust = lazy(() => import("@/components/home/sections/WhyTrust").then(m => ({ default: m.WhyTrust })));
const MentorshipHomeSection = lazy(() => import("@/components/mentorship/MentorshipHomeSection").then(m => ({ default: m.MentorshipHomeSection })));
const ProgressSnapshot = lazy(() => import("@/components/home/workspace/ProgressSnapshot").then(m => ({ default: m.ProgressSnapshot })));
const ContinueLearningRow = lazy(() => import("@/components/home/workspace/ContinueLearningRow").then(m => ({ default: m.ContinueLearningRow })));
const AiAssistantBox = lazy(() => import("@/components/home/workspace/AiAssistantBox").then(m => ({ default: m.AiAssistantBox })));
const ActivityFeed = lazy(() => import("@/components/home/workspace/ActivityFeed").then(m => ({ default: m.ActivityFeed })));
const MobileCoursesTop = lazy(() => import("@/components/home/mobile/MobileCoursesTop").then(m => ({ default: m.MobileCoursesTop })));
const GalleryCarousel = lazy(() => import("@/components/home/mobile/GalleryCarousel").then(m => ({ default: m.GalleryCarousel })));
const MasterpieceShowcase = lazy(() => import("@/components/home/MasterpieceShowcase").then(m => ({ default: m.MasterpieceShowcase })));
const ComingSoonTrio = lazy(() => import("@/components/home/ComingSoonTrio"));
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
  quick_actions: () => {
    const chips = [
      { icon: Play, label: "Continue", href: "/learn" },
      { icon: Sparkles, label: "AI Tutor", href: "/learn" },
      { icon: Wand2, label: "Prompts", href: "/prompts" },
      { icon: CalendarDays, label: "Planner", href: "/learn" },
      { icon: BarChart3, label: "Progress", href: "/learn" },
      { icon: Library, label: "Library", href: "/library" },
      { icon: ShoppingBag, label: "Shop", href: "/shop" },
      { icon: Users, label: "Mentors", href: "/mentors" },
      { icon: MessageCircle, label: "Community", href: "/community" },
      { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
      { icon: Bookmark, label: "Wishlist", href: "/wishlist" },
      { icon: Bell, label: "Notifications", href: "/notifications" },
    ];
    return (
      <Reveal as="section" className="section-x space-y-4">
        {/* Horizontal chip row — centered when it fits, scrollable on overflow */}
        <div className="-mx-4 overflow-x-auto hide-scrollbar pb-1">
          <div className="flex justify-start lg:justify-center gap-2.5 px-4 w-max min-w-full snap-x snap-mandatory scroll-px-4">
            {chips.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.label}
                  to={c.href}
                  className="snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-secondary/40 border border-border hover:border-primary/40 hover:bg-secondary/70 transition-colors pressable focus-ring"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium whitespace-nowrap text-foreground">{c.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 2-col bento: AI Tutor + Streak */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/learn"
            className="midnight-tile p-5 h-40 flex flex-col justify-between focus-ring overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1">
                AI Tutor
                <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
              </h3>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground mt-1">
                Active 24/7
              </p>
            </div>
          </Link>

          <div className="midnight-tile midnight-glow p-5 h-40 flex flex-col justify-between overflow-hidden"
               style={{ background: "hsl(var(--primary) / 0.08)", borderColor: "hsl(var(--primary) / 0.25)" }}>
            <div className="relative z-10 w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
              <Flame className="h-5 w-5" />
            </div>
            <div className="relative z-10">
              <h3 className="font-display font-bold text-base text-foreground">Daily streak</h3>
              <p className="text-[10px] uppercase tracking-widest font-semibold text-primary mt-1">
                +30 XP today
              </p>
            </div>
          </div>

        </div>
      </Reveal>
    );
  },
  quick_categories: () => {
    const [courses, books, prompts, trending] = quickCategories;
    const Eyebrow = ({ children }: { children: React.ReactNode }) => (
      <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">{children}</p>
    );
    return (
      <section className="section-x">
        <div className="grid grid-cols-3 grid-rows-2 gap-3">
          {/* Hero: Courses */}
          <Reveal delay={0} variant="scale" className="col-span-2 row-span-2">
            <Link
              to={courses.href}
              className="midnight-tile midnight-glow pressable focus-ring relative flex flex-col justify-between p-5 h-full min-h-[12rem] overflow-hidden"
            >
              <div className="flex items-start justify-between relative z-10">
                <Eyebrow>ASIKON</Eyebrow>
                <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)/0.55)]">
                  <courses.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="font-display font-bold text-2xl leading-tight text-foreground">
                  Courses<br/>library
                </h3>
                <div className="flex items-center gap-5 mt-4">
                  <div>
                    <p className="font-display font-bold text-base text-foreground">120+</p>
                    <Eyebrow>Lessons</Eyebrow>
                  </div>
                  <div>
                    <p className="font-display font-bold text-base text-foreground">24/7</p>
                    <Eyebrow>AI Tutor</Eyebrow>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Books */}
          <Reveal delay={60} variant="scale" className="col-span-1">
            <Link to={books.href} className="midnight-tile pressable focus-ring relative flex flex-col justify-between p-4 h-full min-h-[5.75rem]">
              <div className="flex items-start justify-between">
                <Eyebrow>Read</Eyebrow>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <books.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="font-display font-bold text-sm text-foreground">{books.label}</p>
            </Link>
          </Reveal>

          {/* Prompts */}
          <Reveal delay={120} variant="scale" className="col-span-1">
            <Link to={prompts.href} className="midnight-tile pressable focus-ring relative flex flex-col justify-between p-4 h-full min-h-[5.75rem]">
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_hsl(142_71%_45%/0.9)]" />
                  <Eyebrow>Live</Eyebrow>
                </span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <prompts.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="font-display font-bold text-sm text-foreground">{prompts.label}</p>
            </Link>
          </Reveal>

          {/* Trending wide */}
          <Reveal delay={180} variant="scale" className="col-span-3">
            <Link to={trending.href} className="midnight-tile pressable focus-ring flex items-center justify-between p-4 h-16">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <trending.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-foreground">{trending.label}</p>
                  <Eyebrow>What's hot today</Eyebrow>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Reveal>
        </div>
      </section>
    );
  },

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
    <Reveal as="section">
      <CommunityCarousel
        posts={mockPosts}
        title={sec.title_override ?? "From the community"}
        viewAllHref="/community"
      />
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
      <div className="home-midnight min-h-screen">
        <MobilePage spacing="space-y-5 lg:space-y-14">
          {user ? (
            <>
              {/* 1 — Hero slider (top priority on mobile) */}
              <div className="lg:hidden">
                {heroSection && <ImageHeroSlider />}
              </div>

              <div className="hidden lg:block"><DesktopHeroBento /></div>
              <div className="lg:hidden"><FlexiTopSection /></div>

              {/* Hero slider on desktop after bento */}
              <div className="hidden lg:block">
                {heroSection && <ImageHeroSlider />}
              </div>
              <BrandStrip />

              {/* 2 — Calm greeting */}
              <GreetingStrip />

              {/* 3 — The single most important thing on the screen */}
              <section className="section-x">
                <TodayMissionCard />
              </section>

              {/* 4 — Continue where you left off */}
              <ContinueLearningRow />

              {/* 5 — Four calm tiles: Tutor / Shop / Community / Mentors */}
              <QuickAccessGrid />

              {/* 6 — AI assistant entry */}
              <AiAssistantBox />

              {/* 7 — Discovery: courses + commerce sections (admin-ordered) */}
              <MobileCoursesTop />
              <GalleryCarousel />
              <MasterpieceShowcase />
              <ComingSoonTrio />
              {restSections.map(renderSection)}

              {/* 8 — Quiet personal footer: progress + activity */}
              <ProgressSnapshot />
              <ActivityFeed />
            </>
          ) : (
            <>
              <div className="hidden lg:block"><DesktopHeroBento /></div>
              <div className="lg:hidden"><FlexiTopSection /></div>
              {heroSection && renderSection(heroSection)}
              <BrandStrip />
              <GalleryCarousel />
              <MasterpieceShowcase />
              <ComingSoonTrio />
              {restSections.map(renderSection)}
            </>
          )}
        </MobilePage>
      </div>

    </AppLayout>
  );
};

export default Index;
