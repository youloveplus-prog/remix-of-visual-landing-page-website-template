import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Heart,
  GraduationCap,
  Globe2,
  ShieldCheck,
  Quote,
  Star,
  Compass,
  PlayCircle,
} from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { MissionVision } from "@/components/about/MissionVision";
import { BentoGallery, EndlessShowcase } from "@/components/about/BentoGallery";
import { Reveal } from "@/components/transitions/Reveal";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import heroStudent from "@/assets/about/hero-student.jpg";
import storyClassroom from "@/assets/about/story-classroom.jpg";
import featureNotes from "@/assets/about/feature-notes.jpg";
import featureMentor from "@/assets/about/feature-mentor.webp";

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */
function CinematicHero() {
  return (
    <section className="relative isolate overflow-hidden min-h-[48vh] sm:min-h-[70vh] lg:min-h-[92vh] flex items-end">
      <img
        src={heroStudent}
        alt="A young Bangladeshi student learning at night"
        width={1080}
        height={1920}
        className="absolute inset-0 w-full h-full object-cover object-[60%_center] lg:object-[70%_center]"
        fetchPriority="high"
      />
      {/* layered cinematic gradient + brand wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
      <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-background lg:via-background/70 lg:to-transparent" />
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{ background: "var(--gradient-primary-soft)" }}
      />
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-[120px] opacity-25"
           style={{ background: "var(--gradient-primary)" }} />

      <div className="relative z-10 container-editorial pb-8 sm:pb-16 lg:pb-32 pt-16 sm:pt-24 lg:pt-40">
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-7 text-center lg:text-left">
            <p className="eyebrow-bar mb-5 justify-center lg:justify-start inline-flex lg:flex">About ASIKON</p>
            <h1
              className="font-display font-semibold tracking-[-0.035em] leading-[1.02] text-foreground"
              style={{ fontSize: "clamp(1.85rem, 6vw, 5.25rem)" }}
            >
              Learning,
              <br className="hidden sm:block" /> reimagined for{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                Bangladesh.
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 mx-auto lg:mx-0 max-w-[40ch] sm:max-w-[44ch] text-[13.5px] sm:text-base lg:text-lg leading-[1.6] sm:leading-[1.65] text-muted-foreground">
              AI-powered learning, built for Bangladesh. One small lesson a day,
              guided by a tutor that listens.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center lg:justify-start items-center">
              <Button
                asChild
                size="lg"
                className="group rounded-full px-6 sm:px-7 h-11 sm:h-12 w-full sm:w-auto shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.55)] hover:shadow-[0_12px_40px_-8px_hsl(var(--primary)/0.7)] transition-shadow"
              >
                <Link to="/learn">
                  <PlayCircle className="mr-1.5 h-4 w-4" />
                  Start learning
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-6 sm:px-7 h-11 sm:h-12 w-full sm:w-auto liquid-glass liquid-glass-interactive border-0 text-foreground"
              >
                <Link to="/learn">
                  <Compass className="mr-1.5 h-4 w-4" /> Explore tracks
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats row (clean hairline layout)                                         */
/* -------------------------------------------------------------------------- */
const STATS = [
  { k: "10k+", v: "Active learners", bn: "০" },
  { k: "500+", v: "Lessons crafted", bn: "১" },
  { k: "64", v: "Districts reached", bn: "২" },
  { k: "24", v: "Learning tracks", bn: "৩" },
  { k: "1.2M", v: "AI conversations", bn: "৪" },
];

function GlassStats() {
  return (
    <section className="container-editorial py-8 sm:py-14 lg:py-20">
      <div className="mb-5 sm:mb-7 flex items-center justify-center lg:justify-start gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--gradient-primary)" }}
        />
        Numbers from across Bangladesh
      </div>

      {/* Mobile: 2-up + last full-width liquid glass cards */}
      <div className="grid grid-cols-2 gap-2.5 lg:hidden">
        {STATS.map((s, i) => (
          <div
            key={s.v}
            className={cn(
              "relative overflow-hidden rounded-2xl p-4 liquid-glass",
              i === STATS.length - 1 && STATS.length % 2 === 1 && "col-span-2",
            )}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "var(--gradient-hairline)" }}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -bottom-4 text-[4rem] leading-none font-semibold text-foreground/[0.05] select-none"
              style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali',sans-serif" }}
            >
              {s.bn}
            </span>
            <div
              className="relative font-display text-[1.65rem] font-semibold tracking-tight tabular-nums bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              {s.k}
            </div>
            <div className="relative mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        <div className="liquid-glass rounded-[1.75rem] overflow-hidden">
          <div className="grid lg:grid-cols-5 divide-x divide-border/40">
            {STATS.map((s) => (
              <div
                key={s.v}
                className="relative overflow-hidden py-10 px-6"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 bottom-0 text-[6rem] leading-none font-semibold text-foreground/[0.05] select-none"
                  style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali',sans-serif" }}
                >
                  {s.bn}
                </span>
                <div
                  className="relative font-display text-4xl xl:text-5xl font-semibold tracking-tight tabular-nums bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  {s.k}
                </div>
                <div className="relative mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* -------------------------------------------------------------------------- */
/*  Image + text alternating section (asymmetric on desktop)                  */
/* -------------------------------------------------------------------------- */
function ImageTextRow({
  eyebrow,
  title,
  body,
  image,
  alt,
  reverse,
  meta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  reverse?: boolean;
  meta?: string[];
}) {
  return (
    <section className="container-editorial py-8 sm:py-14 lg:py-20">
      <article className="group relative mx-auto w-full max-w-[1180px] overflow-hidden rounded-2xl sm:rounded-[2.25rem] liquid-glass shadow-[0_20px_50px_-30px_hsl(var(--primary)/0.35)]">
        {/* hairline top */}
        <div
          className="absolute top-0 left-6 right-6 sm:left-10 sm:right-10 h-px z-10 pointer-events-none"
          style={{ background: "var(--gradient-hairline)" }}
        />
        {/* brand glow — sits behind copy column */}
        <div
          className={cn(
            "absolute -top-32 w-[28rem] h-[28rem] rounded-full blur-[120px] opacity-25 pointer-events-none",
            reverse ? "-left-24" : "-right-24",
          )}
          style={{ background: "var(--gradient-primary)" }}
        />

        <div className="relative grid lg:grid-cols-2 lg:items-stretch lg:min-h-[540px] xl:min-h-[580px]">
          {/* Media */}
          <div
            className={cn(
              "relative overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[540px]",
              reverse ? "lg:order-2" : "lg:order-1",
            )}
          >
            <img
              src={image}
              alt={alt}
              loading="lazy"
              width={1536}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1400 ease-out group-hover:scale-[1.04]"
            />
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-tr from-background/30 via-transparent to-transparent",
                reverse
                  ? "lg:bg-gradient-to-l lg:from-transparent lg:via-transparent lg:to-background/30"
                  : "lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-background/30",
              )}
            />
          </div>

          {/* Copy */}
          <div
            className={cn(
              "relative flex flex-col justify-center text-center lg:text-left p-5 sm:p-10 lg:p-14 xl:p-16",
              reverse ? "lg:order-1" : "lg:order-2",
            )}
          >
            {/* decorative brand bar */}
            <div
              className="mx-auto lg:mx-0 mb-4 h-[3px] w-7 rounded-full"
              style={{ background: "var(--gradient-primary)" }}
            />
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-medium text-primary/90 mb-3">
              {eyebrow}
            </p>
            <h2
              className="font-display font-semibold tracking-[-0.025em] leading-[1.05] text-foreground mx-auto lg:mx-0 max-w-[18ch]"
              style={{ fontSize: "clamp(1.45rem, 3.4vw, 2.75rem)" }}
            >
              {title}
            </h2>
            <p className="mt-3 sm:mt-5 mx-auto lg:mx-0 max-w-[42ch] text-[13.5px] sm:text-base leading-[1.6] sm:leading-[1.65] text-muted-foreground">
              {body}
            </p>

            {meta && meta.length > 0 && (
              <ul className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-2.5 gap-y-2 text-[11px] sm:text-[11.5px] uppercase tracking-[0.16em] text-muted-foreground/80">
                {meta.map((m, i) => (
                  <li key={m} className="flex items-center gap-2.5">
                    <span>{m}</span>
                    {i < meta.length - 1 && (
                      <span className="h-1 w-1 rounded-full bg-foreground/25" />
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 sm:mt-8 flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full px-4 h-9 text-[13px] font-medium liquid-glass-pill text-foreground/90 transition-transform group-hover:translate-x-0.5">
                Learn more
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Principles carousel                                                       */
/* -------------------------------------------------------------------------- */
const PRINCIPLES = [
  { icon: Zap, title: "Small wins compound.", body: "Five focused minutes today beats a six-hour cram next week." },
  { icon: Sparkles, title: "AI guides, never replaces.", body: "A patient tutor that listens, explains, and waits." },
  { icon: Heart, title: "Learning stays calm.", body: "No streak shaming. No anxiety. Just steady progress." },
  { icon: GraduationCap, title: "Every learner gets a guide.", body: "Personalized paths for beginners and pros alike." },
  { icon: Globe2, title: "Mother tongue first.", body: "Bangla-aware lessons so nothing gets lost in translation." },
  { icon: ShieldCheck, title: "Skills over certificates.", body: "We measure what you can build, not paper on the wall." },
];

function PrinciplesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSel);
    onSel();
  }, [emblaApi]);

  return (
    <section className="py-10 sm:py-20 lg:py-32 border-y border-border/40 bg-card/20">
      <div className="container-editorial mb-8 sm:mb-10 lg:mb-14 text-center">
        <p className="eyebrow-bar mb-3 justify-center inline-flex">What we believe</p>
        <h2
          className="font-display font-semibold tracking-[-0.025em] leading-[1.05] max-w-[24ch] mx-auto"
          style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.5rem)" }}
        >
          Six principles that{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            shape every screen.
          </span>
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>

        <div className="flex gap-3 sm:gap-5 pr-4">
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className="shrink-0 basis-[78%] sm:basis-[48%] lg:basis-[28%] xl:basis-[24%] liquid-glass liquid-glass-interactive rounded-2xl sm:rounded-[1.75rem] p-5 sm:p-8 relative overflow-hidden"
              >

                <div
                  className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-px"
                  style={{ background: "var(--gradient-hairline)" }}
                />
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6"
                  style={{ background: "var(--gradient-primary-soft)" }}
                >
                  <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-primary" />
                </div>
                <h3 className="font-display text-base sm:text-xl font-semibold mb-2 sm:mb-2.5 leading-[1.2] tracking-[-0.01em]">
                  {p.title}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-muted-foreground leading-[1.6]">
                  {p.body}
                </p>
                <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-5 text-[10px] font-mono text-muted-foreground/40">
                  0{i + 1}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="container-editorial flex justify-center gap-1.5 mt-6 sm:mt-8">
        {PRINCIPLES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to principle ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              selected === i ? "w-6 bg-primary" : "w-1.5 bg-foreground/15",
            )}
          />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Testimonials                                                              */
/* -------------------------------------------------------------------------- */
const TESTIMONIALS = [
  { name: "Tanvir H.", role: "Python student", text: "The AI tutor explained recursion in Bangla and it finally clicked." },
  { name: "Ayesha R.", role: "ML beginner", text: "I landed my first freelance gig in six weeks. The daily missions kept me consistent." },
  { name: "Rakib M.", role: "Prompt engineer", text: "The prompt library alone saves me hours every day. The whole experience feels calm." },
  { name: "Nadia K.", role: "Class 10 student", text: "Asikon never punishes me for missing a day. I come back and pick up where I left off." },
  { name: "Imran S.", role: "Career switcher", text: "I moved from sales to data analysis with a real portfolio. The mentors made it possible." },
];

function TestimonialsCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);

  return (
    <section className="container-editorial py-10 sm:py-20 lg:py-32">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-14">
        <p className="eyebrow-bar mb-3 justify-center inline-flex">Loved by learners</p>
        <h2
          className="font-display font-semibold tracking-[-0.025em] leading-[1.05]"
          style={{ fontSize: "clamp(1.6rem, 4.5vw, 3.25rem)" }}
        >
          Real stories. Real momentum.
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="shrink-0 basis-[86%] sm:basis-[60%] lg:basis-[36%] px-2 sm:px-3"
            >
              <article className="relative liquid-glass rounded-2xl sm:rounded-[1.75rem] p-5 sm:p-9 min-h-[200px] sm:min-h-[240px] h-full">
                <Quote className="absolute top-4 right-4 sm:top-5 sm:right-5 w-7 h-7 sm:w-9 sm:h-9 text-primary/15" />
                <div className="flex gap-0.5 mb-3 sm:mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-display text-[15px] sm:text-lg leading-[1.4] tracking-[-0.005em] text-foreground/90">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 pt-5 border-t border-border/40">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Story section                                                             */
/* -------------------------------------------------------------------------- */
function StorySection() {
  return (
    <section className="py-10 sm:py-20 lg:py-32 border-y border-border/40 bg-card/20">
      <div className="container-editorial grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16">
        <div className="lg:col-span-7 text-center lg:text-left">
          <p className="eyebrow-bar mb-3 justify-center lg:justify-start inline-flex lg:flex">Our story</p>
          <h2
            className="font-display font-semibold tracking-[-0.025em] leading-[1.05] mb-5 sm:mb-7 mx-auto lg:mx-0 max-w-[22ch] lg:max-w-[18ch]"
            style={{ fontSize: "clamp(1.55rem, 4.5vw, 3.5rem)" }}
          >
            From a Dhaka classroom to learners everywhere.
          </h2>
          <div className="space-y-3 sm:space-y-5 text-[13.5px] sm:text-base leading-[1.65] sm:leading-[1.7] text-muted-foreground mx-auto lg:mx-0 max-w-[52ch] sm:max-w-[58ch]">
            <p>
              Brilliant students were being asked to learn in systems built for
              someone else, somewhere else. That felt wrong.
            </p>
            <p>
              We believed the answer was not more content. It was the right
              content, in the right size, at the right time.
            </p>
            <p>
              So we built a tutor that listens, a daily mission that respects
              your time, and a community that cheers you on.
            </p>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="liquid-glass rounded-2xl sm:rounded-[2rem] p-5 sm:p-7 lg:p-8 lg:sticky lg:top-28 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-30"
              style={{ background: "var(--gradient-primary)" }}
            />

            {/* Dhaka skyline silhouette */}
            <svg
              aria-hidden
              viewBox="0 0 400 60"
              className="relative w-full h-10 sm:h-12 mb-4 sm:mb-5 text-foreground/70"
              fill="currentColor"
            >
              <path d="M0 60 L0 40 L18 40 L18 28 L32 28 L32 36 L46 36 L46 22 L58 22 L58 16 L66 16 L66 22 L78 22 L78 32 L94 32 L94 20 L110 20 L110 12 L116 12 L116 6 L122 6 L122 12 L128 12 L128 20 L144 20 L144 30 L158 30 L158 18 L170 18 L170 24 L182 24 L182 14 L194 14 L194 4 L200 4 L200 14 L206 14 L206 24 L220 24 L220 32 L234 32 L234 22 L248 22 L248 28 L262 28 L262 18 L276 18 L276 26 L290 26 L290 14 L302 14 L302 22 L316 22 L316 32 L330 32 L330 24 L344 24 L344 18 L356 18 L356 28 L370 28 L370 38 L384 38 L384 30 L400 30 L400 60 Z" />
            </svg>

            <div className="relative grid grid-cols-3 gap-4 sm:gap-5 lg:block lg:space-y-0">
              <MetaRow label="Founded" value="2024" />
              <div className="hidden lg:block my-5 h-px" style={{ background: "var(--gradient-hairline)" }} />
              <MetaRow label="Based in" value="Dhaka, BD" bnSubtitle="ঢাকা" />
              <div className="hidden lg:block my-5 h-px" style={{ background: "var(--gradient-hairline)" }} />
              <MetaRow label="Built for" value="Every learner." />
            </div>
            <p className="relative text-[13px] sm:text-[15px] text-muted-foreground mt-5 sm:mt-7 italic leading-[1.6] max-w-[40ch]">
              &ldquo;Education should feel like a guide walking beside you, not
              a wall in front of you.&rdquo;
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function MetaRow({ label, value, bnSubtitle }: { label: string; value: string; bnSubtitle?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      {bnSubtitle && (
        <p
          className="text-[11px] sm:text-xs text-primary/70 mt-0.5 leading-none"
          style={{ fontFamily: "'Hind Siliguri','Noto Sans Bengali',sans-serif" }}
        >
          {bnSubtitle}
        </p>
      )}
      <p className="font-display text-lg sm:text-2xl lg:text-3xl font-semibold mt-1 leading-tight">
        {value}
      </p>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/*  Final CTA                                                                 */
/* -------------------------------------------------------------------------- */
function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-28 lg:py-40">
      <div className="absolute inset-0 -z-10 aurora-bg" />
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[80%] aspect-square rounded-full blur-[140px] opacity-25 -z-10"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="container-editorial text-center max-w-3xl">
        <p className="eyebrow-bar mb-4 justify-center inline-flex">Start today</p>
        <h2
          className="font-display font-semibold tracking-[-0.03em] leading-[1.02]"
          style={{ fontSize: "clamp(1.85rem, 6vw, 4.75rem)" }}
        >
          Your future self{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            starts today.
          </span>
        </h2>
        <p className="mt-5 sm:mt-6 text-[14px] sm:text-base lg:text-lg leading-[1.65] text-muted-foreground max-w-[44ch] mx-auto">
          One small lesson. One calm streak. Everything changes from there.
        </p>
        <div className="mt-7 sm:mt-9 flex flex-col items-center gap-3 sm:gap-4">
          <Button
            asChild
            size="lg"
            className="group rounded-full px-8 sm:px-10 h-12 sm:h-14 text-sm sm:text-base w-full sm:w-auto shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.65)] hover:shadow-[0_14px_50px_-10px_hsl(var(--primary)/0.8)] transition-shadow"
          >
            <Link to="/learn">
              <GraduationCap className="mr-1.5 h-[18px] w-[18px] sm:h-5 sm:w-5" />
              Begin your journey
              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Compass className="h-3.5 w-3.5" /> Explore tracks first
          </Link>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */
const About = () => {
  return (
    <AppLayout>
      <SEO
        title="About ASIKON — AI-powered learning for Bangladesh"
        description="ASIKON is an AI-powered learning platform built to make education simple, smart, and accessible for every Bangladeshi student."
        url="https://asikonpro.lovable.app/about"
      />

      <CinematicHero />

      <Reveal as="div"><GlassStats /></Reveal>

      <Reveal as="section" className="container-editorial pt-4 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl mb-8 lg:mb-10 text-center lg:text-left mx-auto lg:mx-0">
          <p className="eyebrow-bar mb-3 justify-center lg:justify-start inline-flex lg:flex">What drives us</p>
          <h2
            className="font-display font-semibold tracking-[-0.025em] leading-[1.05]"
            style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)" }}
          >
            Mission and Vision.
          </h2>
        </div>
        <MissionVision />
      </Reveal>

      <Reveal as="div">
        <ImageTextRow
          eyebrow="Built for focus"
          title="A calm classroom in your pocket."
          body="Every lesson takes a few quiet minutes. No endless feed. No pressure. Just the next clear step, every day."
          image={featureNotes}
          alt="A student taking notes beside a phone showing a lesson"
          meta={["5 min lessons", "No streaks", "Daily mission"]}
        />
      </Reveal>

      <Reveal as="div"><StorySection /></Reveal>

      <Reveal as="div">
        <ImageTextRow
          reverse
          eyebrow="Human and AI"
          title="A patient tutor that never gets tired."
          body="The AI explains in your language, at your pace. Real mentors are one tap away when you need them."
          image={featureMentor}
          alt="A mentor guiding a student through a lesson"
          meta={["AI tutor", "Bangla-aware", "Mentors on tap"]}
        />
      </Reveal>

      <Reveal as="div"><BentoGallery /></Reveal>

      <Reveal as="div"><PrinciplesCarousel /></Reveal>

      <Reveal as="div"><EndlessShowcase /></Reveal>


      <Reveal as="div">
        <ImageTextRow
          eyebrow="Made in Bangladesh"
          title="Built where it is needed most."
          body="Made in Dhaka by educators, designers, and engineers. Built for learners across Bangladesh and beyond."
          image={storyClassroom}
          alt="A Bangladeshi classroom with students learning together"
          meta={["Dhaka-built", "For everyone", "Open source"]}
        />
      </Reveal>

      <Reveal as="div"><TestimonialsCarousel /></Reveal>

      <Reveal as="div"><FinalCTA /></Reveal>
    </AppLayout>
  );
};

export default About;
