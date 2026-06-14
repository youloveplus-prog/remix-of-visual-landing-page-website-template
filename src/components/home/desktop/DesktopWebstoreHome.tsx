import { Link } from "react-router-dom";
import { useMemo } from "react";
import { ArrowRight, Search, Sparkles, GraduationCap, BookOpen, MessageCircle, Users, Wand2, Trophy, Star } from "lucide-react";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";

const categories = [
  { id: "all", label: "All topics", href: "/shop", dotClass: "bg-indigo-400", active: true },
  { id: "courses", label: "Courses", href: "/shop?type=courses" },
  { id: "books", label: "Books", href: "/shop?type=books" },
  { id: "prompts", label: "Prompts", href: "/prompts" },
  { id: "ai", label: "AI Tutor", href: "/learn" },
  { id: "mentors", label: "Mentors", href: "/mentors" },
  { id: "community", label: "Community", href: "/community" },
  { id: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
];

const cardTints = [
  "from-indigo-900/50 to-slate-800",
  "from-purple-900/50 to-slate-800",
  "from-cyan-900/40 to-slate-800",
  "from-fuchsia-900/40 to-slate-800",
];
const badgeTints = ["bg-indigo-500", "bg-purple-500", "bg-cyan-500", "bg-fuchsia-500"];
const rankTints = ["bg-indigo-600", "bg-purple-600", "bg-teal-600"];

function CardImage({ image, index, initial }: { image?: string | null; index: number; initial: string }) {
  return (
    <div className={`aspect-video bg-slate-900 rounded-xl mb-3 overflow-hidden border border-slate-800 group-hover:border-indigo-500/50 transition-all`}>
      {image ? (
        <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full bg-gradient-to-tr ${cardTints[index % cardTints.length]} flex items-center justify-center p-4`}>
          <div className={`w-12 h-12 ${badgeTints[index % badgeTints.length]} rounded-lg shadow-lg flex items-center justify-center font-bold text-lg font-display`}>
            {initial}
          </div>
        </div>
      )}
    </div>
  );
}

interface CardItem {
  id: string;
  title: string;
  meta: string;
  rating?: number;
  href: string;
  image?: string | null;
}

function ProductGrid({ items, title, viewAllHref }: { items: CardItem[]; title: string; viewAllHref: string }) {
  return (
    <section>
      <div className="flex justify-between items-end mb-5">
        <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
        <Link to={viewAllHref} className="text-sm text-primary font-semibold hover:underline">See more</Link>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {items.slice(0, 4).map((item, i) => (
          <Link key={item.id} to={item.href} className="group cursor-pointer focus-ring rounded-xl">
            <CardImage image={item.image} index={i} initial={item.title[0]?.toUpperCase() ?? "A"} />
            <h3 className="text-sm font-semibold leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              {typeof item.rating === "number" && (
                <>
                  <span className="text-foreground/80 font-medium">{item.rating.toFixed(1)}</span>
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span className="mx-0.5">•</span>
                </>
              )}
              <span>{item.meta}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TopChartsPanel({ title, items }: { title: string; items: CardItem[] }) {
  return (
    <div className="bg-slate-900/30 rounded-2xl border border-slate-800 p-5 flex flex-col">
      <h3 className="font-display text-base font-bold mb-4 tracking-tight">{title}</h3>
      <div className="space-y-4 flex-1">
        {items.slice(0, 3).map((item, i) => (
          <Link key={item.id} to={item.href} className="flex items-center gap-3 group">
            <span className="text-sm font-bold text-slate-500 w-4 tabular-nums">{i + 1}</span>
            <div className={`w-10 h-10 ${rankTints[i % rankTints.length]} rounded-lg shrink-0 overflow-hidden flex items-center justify-center`}>
              {item.image ? (
                <img src={item.image} alt="" loading="lazy" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">{item.title[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h4>
              <p className="text-[10px] text-muted-foreground">{item.meta}</p>
            </div>
          </Link>
        ))}
      </div>
      <button className="w-full mt-5 pt-3 border-t border-slate-800 text-[10px] text-primary font-bold uppercase tracking-widest">
        See all
      </button>
    </div>
  );
}

export function DesktopWebstoreHome() {
  const { data: products } = useProducts({ limit: 20 });
  const { data: featured } = useFeaturedProducts(10);

  const toCard = (p: any, meta = "Course"): CardItem => ({
    id: p.id,
    title: p.name,
    meta,
    rating: p.rating ?? undefined,
    href: `/product/${p.slug}`,
    image: p.image_url,
  });

  const trending = useMemo<CardItem[]>(() => (featured ?? []).slice(0, 4).map((p) => toCard(p, "Trending")), [featured]);
  const newArrivals = useMemo<CardItem[]>(() => (products ?? []).slice(0, 4).map((p) => toCard(p, "New")), [products]);
  const top3a = useMemo<CardItem[]>(() => (featured ?? []).slice(0, 3).map((p) => toCard(p, "Development")), [featured]);
  const top3b = useMemo<CardItem[]>(() => (products ?? []).slice(0, 3).map((p) => toCard(p, "Most loved")), [products]);
  const top3c = useMemo<CardItem[]>(() => (products ?? []).slice(3, 6).map((p) => toCard(p, "Fresh")), [products]);

  return (
    <div className="hidden lg:block dark home-midnight bg-[#0a0a1a] text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8 space-y-12">

        {/* Search bar — Chrome-style pill */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Link
            to="/shop"
            className="block w-full bg-slate-900/50 border border-slate-800 rounded-full py-3 pl-11 pr-4 text-sm text-muted-foreground hover:border-primary/40 transition-colors focus-ring"
          >
            Search courses, mentors, prompts, and tools
          </Link>
        </div>

        {/* Hero collection banner */}
        <section className="relative rounded-3xl overflow-hidden aspect-[3/1] bg-gradient-to-br from-[hsl(var(--primary))] to-indigo-900 flex flex-col items-center justify-center p-10 text-center shadow-2xl shadow-primary/20">
          <div aria-hidden className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute top-0 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-10 w-64 h-64 bg-indigo-300 rounded-full blur-3xl" />
          </div>
          <h1 className="relative font-display text-5xl xl:text-6xl font-bold mb-3 leading-[1.05] tracking-tight text-primary-foreground">
            Master AI with<br />Practical Skills
          </h1>
          <p className="relative text-primary-foreground/80 text-sm mb-6 max-w-md">
            Hands-on learning with the industry's best mentors, instant AI tutoring, and a community that ships.
          </p>
          <Link
            to="/shop"
            className="relative inline-flex items-center gap-2 bg-background text-foreground text-sm font-bold px-6 py-2.5 rounded-full hover:bg-background/90 transition-colors"
          >
            Browse collection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Top categories */}
        <section>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground mb-4">Top categories</h2>
          <div className="flex gap-2.5 flex-wrap">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={c.href}
                className={
                  c.active
                    ? "shrink-0 bg-primary/15 border border-primary/30 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-foreground hover:bg-primary/25 transition-colors"
                    : "shrink-0 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:border-slate-700 transition-colors"
                }
              >
                {c.active && <span className="w-2 h-2 rounded-full bg-primary" />}
                {c.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Trending courses — 4 col grid */}
        <ProductGrid items={trending.length ? trending : newArrivals} title="Trending courses" viewAllHref="/shop?filter=trending" />

        {/* Top charts — 3 column leaderboard */}
        <section>
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Top charts</h2>
              <p className="text-sm text-muted-foreground mt-1">What learners are picking up this week</p>
            </div>
            <Link to="/leaderboard" className="text-sm text-primary font-semibold hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-3 gap-5">
            <TopChartsPanel title="Trending" items={top3a.length ? top3a : top3b} />
            <TopChartsPanel title="Popular" items={top3b} />
            <TopChartsPanel title="New & notable" items={top3c.length ? top3c : top3b} />
          </div>
        </section>

        {/* Editorial — AI Tutor */}
        <section className="rounded-3xl bg-primary/10 border border-primary/20 p-8 flex gap-8 items-center">
          <div className="flex-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Asikon AI · 24/7</span>
            <h3 className="font-display text-3xl font-bold text-foreground mb-2 tracking-tight">Your personal AI tutor</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-lg">
              Ask anything in Bangla or English. Get instant, patient, step-by-step answers on your courses, prompts, and code.
            </p>
            <Link
              to="/ai-tutor"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-foreground bg-primary px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Try AI Tutor
            </Link>
          </div>
          <div className="w-44 h-44 bg-primary/15 rounded-3xl flex items-center justify-center border border-primary/30 shrink-0">
            <Sparkles className="w-20 h-20 text-primary/60" />
          </div>
        </section>

        {/* Extend your learning — quick tools 4-up */}
        <section>
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Extend your learning</h2>
              <p className="text-sm text-muted-foreground mt-1">Tools, prompts and rituals that compound your progress</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {[
              { icon: GraduationCap, title: "Courses library", desc: "120+ structured lessons across AI, Python, and product.", href: "/shop?type=courses" },
              { icon: BookOpen, title: "Books & PDFs", desc: "Hand-picked, instantly delivered. No shipping.", href: "/shop?type=books" },
              { icon: Wand2, title: "Prompt packs", desc: "Battle-tested prompts for GPT-4, Claude, and Gemini.", href: "/prompts" },
              { icon: Users, title: "1-on-1 Mentors", desc: "Personal tutors for children. Waitlist now open.", href: "/mentors" },
            ].map((tile) => (
              <Link
                key={tile.title}
                to={tile.href}
                className="group rounded-2xl bg-slate-900/40 border border-slate-800 p-5 hover:border-primary/40 hover:-translate-y-0.5 transition-all focus-ring"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center mb-4">
                  <tile.icon className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-base text-foreground mb-1">{tile.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{tile.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* New arrivals — 4 col grid */}
        <ProductGrid items={newArrivals} title="New arrivals" viewAllHref="/shop?filter=new" />

        {/* Final editorial — community */}
        <section className="rounded-3xl bg-slate-900/40 border border-slate-800 p-8 flex gap-8 items-center">
          <div className="w-32 h-32 rounded-3xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
            <MessageCircle className="h-14 w-14 text-primary/70" />
          </div>
          <div className="flex-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Community</span>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2 tracking-tight">From verified learners</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xl">
              Real reviews and posts from buyers who completed the course — no paid placements, no fake hype.
            </p>
            <Link
              to="/community"
              className="inline-flex items-center gap-2 text-sm font-bold text-foreground border border-slate-700 px-5 py-2.5 rounded-lg hover:border-primary/40 hover:bg-slate-900 transition-colors"
            >
              <Trophy className="h-4 w-4 text-primary" />
              Open community
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
