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
} from "lucide-react";

import { AppLayout } from "@/components/layout/AppLayout";
import { MissionVision } from "@/components/about/MissionVision";
import { Reveal } from "@/components/transitions/Reveal";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import heroStudent from "@/assets/about/hero-student.jpg";
import storyClassroom from "@/assets/about/story-classroom.jpg";
import featureNotes from "@/assets/about/feature-notes.jpg";
import featureMentor from "@/assets/about/feature-mentor.jpg";

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */
function CinematicHero() {
  return (
    <section className="relative isolate overflow-hidden min-h-[78vh] sm:min-h-[85vh] lg:min-h-[92vh] flex items-end">
      <img
        src={heroStudent}
        alt="A young Bangladeshi student learning at night"
        width={1080}
        height={1920}
        className="absolute inset-0 w-full h-full object-cover object-[60%_center] lg:object-[70%_center]"
        fetchPriority="high"
      />
      {/* layered cinematic gradient + brand wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/10" />
      <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-background lg:via-background/70 lg:to-transparent" />
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{ background: "var(--gradient-primary-soft)" }}
      />
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full blur-[120px] opacity-25"
           style={{ background: "var(--gradient-primary)" }} />

      <div className="relative z-10 container-editorial pb-14 sm:pb-20 lg:pb-32 pt-28 lg:pt-40">
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-7">
            <p className="eyebrow-bar mb-5">About ASIKON</p>
            <h1
              className="font-display font-semibold tracking-[-0.035em] leading-[1.02] text-foreground"
              style={{ fontSize: "clamp(2.4rem, 7vw, 5.25rem)" }}
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
            <p className="mt-6 max-w-[44ch] text-[15px] sm:text-base lg:text-lg leading-[1.65] text-muted-foreground">
              AI-powered learning, built for Bangladesh. One small lesson a day,
              guided by a tutor that listens.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-full px-7 h-12 w-full sm:w-auto">
                <Link to="/learn">
                  Start learning <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7 h-12 w-full sm:w-auto glass border-white/10"
              >
                <Link to="/learn">
                  <Sparkles className="mr-1.5 h-4 w-4" /> Explore tracks
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
  { k: "10k+", v: "Active learners" },
  { k: "500+", v: "Lessons crafted" },
  { k: "24", v: "Learning tracks" },
  { k: "1.2M", v: "AI conversations" },
];

function GlassStats() {
  return (
    <section className="container-editorial py-12 sm:py-16 lg:py-20">
      {/* Mobile: glass cards. Desktop: hairline row. */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {STATS.map((s) => (
          <div
            key={s.v}
            className="relative overflow-hidden rounded-3xl p-5 glass-strong border border-white/10"
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "var(--gradient-hairline)" }}
            />
            <div
              className="font-display text-[2rem] font-semibold tracking-tight tabular-nums bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              {s.k}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {s.v}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-4 border-y border-border/50">
        {STATS.map((s, i) => (
          <div
            key={s.v}
            className={cn(
              "py-10 px-6",
              i > 0 && "border-l border-border/50",
            )}
          >
            <div
              className="font-display text-5xl xl:text-6xl font-semibold tracking-tight tabular-nums bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              {s.k}
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {s.v}
            </div>
          </div>
        ))}
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
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  reverse?: boolean;
}) {
  const Media = (
    <div
      className={cn(
        "relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[5/6] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-white/10 group",
        reverse ? "lg:col-span-5" : "lg:col-span-6",
      )}
    >
      <img
        src={image}
        alt={alt}
        loading="lazy"
        width={1536}
        height={1280}
        className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.5rem] sm:rounded-[2rem] pointer-events-none" />
    </div>
  );

  const Copy = (
    <div
      className={cn(
        "lg:py-6",
        reverse ? "lg:col-span-7 lg:pr-10" : "lg:col-span-6 lg:pl-6",
      )}
    >
      <p className="eyebrow-bar mb-3">{eyebrow}</p>
      <h2
        className="font-display font-semibold tracking-[-0.025em] leading-[1.05] text-foreground"
        style={{ fontSize: "clamp(1.85rem, 4vw, 3rem)" }}
      >
        {title}
      </h2>
      <p className="mt-5 max-w-[52ch] text-[15px] sm:text-base leading-[1.65] text-muted-foreground">
        {body}
      </p>
    </div>
  );

  return (
    <section className="container-editorial py-14 sm:py-20 lg:py-28">
      <div className="grid gap-8 lg:gap-16 items-center lg:grid-cols-12">
        {reverse ? (
          <>
            {Copy}
            {Media}
          </>
        ) : (
          <>
            {Media}
            {Copy}
          </>
        )}
      </div>
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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
  });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSel);
    onSel();
  }, [emblaApi]);

  return (
    <section className="py-16 sm:py-24 lg:py-32 border-y border-border/40 bg-card/20">
      <div className="container-editorial mb-10 lg:mb-14">
        <p className="eyebrow-bar mb-3">What we believe</p>
        <h2
          className="font-display font-semibold tracking-[-0.025em] leading-[1.05] max-w-[18ch]"
          style={{ fontSize: "clamp(1.85rem, 4.5vw, 3.5rem)" }}
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

      <div
        className="overflow-hidden pl-[max(1rem,calc((100vw-72rem)/2))]"
        ref={emblaRef}
      >
        <div className="flex gap-4 sm:gap-5 pr-4">
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className="shrink-0 basis-[86%] sm:basis-[48%] lg:basis-[28%] xl:basis-[24%] glass-strong border border-white/10 rounded-[1.75rem] p-7 sm:p-8 relative overflow-hidden hover-lift"
              >
                <div
                  className="absolute top-0 left-6 right-6 h-px"
                  style={{ background: "var(--gradient-hairline)" }}
                />
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: "var(--gradient-primary-soft)" }}
                >
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-semibold mb-2.5 leading-[1.2] tracking-[-0.01em]">
                  {p.title}
                </h3>
                <p className="text-[14px] text-muted-foreground leading-[1.6]">
                  {p.body}
                </p>
                <div className="absolute bottom-4 right-5 text-[10px] font-mono text-muted-foreground/40">
                  0{i + 1}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="container-editorial flex gap-1.5 mt-8">
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
    <section className="container-editorial py-16 sm:py-24 lg:py-32">
      <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
        <p className="eyebrow-bar mb-3 justify-center inline-flex">Loved by learners</p>
        <h2
          className="font-display font-semibold tracking-[-0.025em] leading-[1.05]"
          style={{ fontSize: "clamp(1.85rem, 4.5vw, 3.25rem)" }}
        >
          Real stories. Real momentum.
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="shrink-0 basis-[90%] sm:basis-[60%] lg:basis-[36%] px-2 sm:px-3"
            >
              <article className="relative glass-strong border border-white/10 rounded-[1.75rem] p-7 sm:p-9 min-h-[240px] h-full">
                <Quote className="absolute top-5 right-5 w-9 h-9 text-primary/15" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-display text-[17px] sm:text-lg leading-[1.4] tracking-[-0.005em] text-foreground/90">
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
    <section className="py-16 sm:py-24 lg:py-32 border-y border-border/40 bg-card/20">
      <div className="container-editorial grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="eyebrow-bar mb-3">Our story</p>
          <h2
            className="font-display font-semibold tracking-[-0.025em] leading-[1.05] mb-7 max-w-[18ch]"
            style={{ fontSize: "clamp(1.85rem, 4.5vw, 3.5rem)" }}
          >
            From a Dhaka classroom to learners everywhere.
          </h2>
          <div className="space-y-5 text-[15px] sm:text-base leading-[1.7] text-muted-foreground max-w-[58ch]">
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
          <div className="glass-strong border border-white/10 rounded-[1.75rem] sm:rounded-[2rem] p-7 lg:p-8 lg:sticky lg:top-28 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-30"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="relative grid grid-cols-3 gap-5 lg:block lg:space-y-0">
              <MetaRow label="Founded" value="2024" />
              <div className="hidden lg:block my-5 h-px" style={{ background: "var(--gradient-hairline)" }} />
              <MetaRow label="Based in" value="Dhaka, BD" />
              <div className="hidden lg:block my-5 h-px" style={{ background: "var(--gradient-hairline)" }} />
              <MetaRow label="Built for" value="Every learner." />
            </div>
            <p className="relative text-[14px] sm:text-[15px] text-muted-foreground mt-7 italic leading-[1.6] max-w-[40ch]">
              &ldquo;Education should feel like a guide walking beside you, not
              a wall in front of you.&rdquo;
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="font-display text-xl sm:text-2xl lg:text-3xl font-semibold mt-1 leading-tight">
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
    <section className="relative isolate overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="absolute inset-0 -z-10 aurora-bg" />
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[80%] aspect-square rounded-full blur-[140px] opacity-25 -z-10"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="container-editorial text-center max-w-3xl">
        <p className="eyebrow-bar mb-4 justify-center inline-flex">Start today</p>
        <h2
          className="font-display font-semibold tracking-[-0.03em] leading-[1.02]"
          style={{ fontSize: "clamp(2.25rem, 6vw, 4.75rem)" }}
        >
          Your future self{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            starts today.
          </span>
        </h2>
        <p className="mt-6 text-[15px] sm:text-base lg:text-lg leading-[1.65] text-muted-foreground max-w-[44ch] mx-auto">
          One small lesson. One calm streak. Everything changes from there.
        </p>
        <div className="mt-9 flex flex-col items-center gap-4">
          <Button asChild size="lg" className="rounded-full px-10 h-14 text-base w-full sm:w-auto">
            <Link to="/learn">
              Begin your journey <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Link
            to="/learn"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore tracks first
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
        <div className="max-w-2xl mb-8 lg:mb-10">
          <p className="eyebrow-bar mb-3">What drives us</p>
          <h2
            className="font-display font-semibold tracking-[-0.025em] leading-[1.05]"
            style={{ fontSize: "clamp(1.85rem, 4.5vw, 3.25rem)" }}
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
        />
      </Reveal>

      <Reveal as="div"><PrinciplesCarousel /></Reveal>

      <Reveal as="div">
        <ImageTextRow
          eyebrow="Made in Bangladesh"
          title="Built where it is needed most."
          body="Made in Dhaka by educators, designers, and engineers. Built for learners across Bangladesh and beyond."
          image={storyClassroom}
          alt="A Bangladeshi classroom with students learning together"
        />
      </Reveal>

      <Reveal as="div"><TestimonialsCarousel /></Reveal>

      <Reveal as="div"><FinalCTA /></Reveal>
    </AppLayout>
  );
};

export default About;
