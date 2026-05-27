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
/*  Hero — cinematic full-bleed                                               */
/* -------------------------------------------------------------------------- */
function CinematicHero() {
  return (
    <section className="relative isolate overflow-hidden min-h-[88vh] flex items-end">
      <img
        src={heroStudent}
        alt="A young Bangladeshi student learning at night"
        width={1080}
        height={1920}
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
      />
      {/* layered cinematic gradient + brand wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
      <div
        className="absolute inset-0 opacity-60 mix-blend-soft-light"
        style={{ background: "var(--gradient-primary-soft)" }}
      />
      <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] rounded-full blur-[120px] opacity-30"
           style={{ background: "var(--gradient-primary)" }} />

      <div className="relative z-10 container-editorial pb-16 sm:pb-24 lg:pb-32 pt-32">
        <p className="eyebrow-bar mb-5">About ASIKON</p>
        <h1 className="display-1 max-w-4xl">
          Learning, reimagined for every{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
            Bangladeshi student.
          </span>
        </h1>
        <p className="body-lg mt-6 max-w-xl text-muted-foreground">
          An AI-powered learning universe built to make education simple, smart,
          and unmistakably yours — one small daily lesson at a time.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-7 h-12">
            <Link to="/learn">
              Start learning <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-7 h-12 glass border-white/10">
            <Link to="/learn">
              <Sparkles className="mr-1.5 h-4 w-4" /> Explore tracks
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Liquid-glass stats row                                                    */
/* -------------------------------------------------------------------------- */
const STATS = [
  { k: "10k+", v: "Active learners" },
  { k: "500+", v: "Lessons crafted" },
  { k: "24", v: "Learning tracks" },
  { k: "1.2M", v: "AI conversations" },
];

function GlassStats() {
  return (
    <section className="container-editorial py-12 sm:py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map((s) => (
          <div
            key={s.v}
            className="relative overflow-hidden rounded-3xl p-5 sm:p-6 glass-strong border border-white/10"
          >
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{ background: "var(--gradient-hairline)" }} />
            <div className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
                {s.k}
              </span>
            </div>
            <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {s.v}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Image + text alternating section                                          */
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
  return (
    <section className="container-editorial py-14 sm:py-20">
      <div className={cn(
        "grid gap-8 lg:gap-14 items-center lg:grid-cols-2",
        reverse && "lg:[&>*:first-child]:order-2",
      )}>
        <div className="relative aspect-[4/5] sm:aspect-[5/4] rounded-[2rem] overflow-hidden border border-white/10 group">
          <img
            src={image}
            alt={alt}
            loading="lazy"
            width={1536}
            height={1280}
            className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] pointer-events-none" />
        </div>
        <div>
          <p className="eyebrow-bar mb-3">{eyebrow}</p>
          <h2 className="display-2 mb-5">{title}</h2>
          <p className="body-lg text-muted-foreground">{body}</p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Principles — embla carousel                                               */
/* -------------------------------------------------------------------------- */
const PRINCIPLES = [
  { icon: Zap,           title: "Small wins beat big bursts",  body: "Five focused minutes today outpaces a six-hour cram next week." },
  { icon: Sparkles,      title: "AI should teach, not replace",body: "Our AI is a patient tutor — guiding, never substituting human care." },
  { icon: Heart,         title: "Learning must feel calm",     body: "No streak-shaming, no anxiety. Progress, not pressure." },
  { icon: GraduationCap, title: "Every learner deserves a guide", body: "Personalized missions for absolute beginners and advanced builders alike." },
  { icon: Globe2,        title: "Mother-tongue first",         body: "Bangla-aware explanations so nothing gets lost in translation." },
  { icon: ShieldCheck,   title: "Skills over certificates",    body: "We measure progress in what you can build, not paper on the wall." },
];

function PrinciplesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true, dragFree: true });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSel);
    onSel();
  }, [emblaApi]);

  return (
    <section className="py-16 sm:py-24 border-y border-border/40 bg-card/20">
      <div className="container-editorial mb-10">
        <p className="eyebrow-bar mb-3">What we believe</p>
        <h2 className="display-2 max-w-2xl">
          Six principles that{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
            shape every screen.
          </span>
        </h2>
      </div>

      <div className="overflow-hidden pl-[max(1rem,calc((100vw-72rem)/2))]" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-5 pr-4">
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            return (
              <article
                key={p.title}
                className="shrink-0 basis-[82%] sm:basis-[44%] lg:basis-[30%] xl:basis-[24%] glass-strong border border-white/10 rounded-[2rem] p-7 sm:p-8 relative overflow-hidden hover-lift"
              >
                <div className="absolute top-0 left-6 right-6 h-px"
                     style={{ background: "var(--gradient-hairline)" }} />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                     style={{ background: "var(--gradient-primary-soft)" }}>
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 leading-snug">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                <div className="absolute bottom-4 right-5 text-xs font-mono text-muted-foreground/40">
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
/*  Testimonials — autoplay glass carousel                                    */
/* -------------------------------------------------------------------------- */
const TESTIMONIALS = [
  { name: "Tanvir H.",  role: "Python student",   text: "The AI tutor explained recursion in Bangla — finally clicked. I felt seen by the platform." },
  { name: "Ayesha R.",  role: "ML beginner",      text: "Landed my first freelance gig in 6 weeks. The daily missions kept me consistent without burnout." },
  { name: "Rakib M.",   role: "Prompt engineer",  text: "The prompt library alone saves me hours every day. The whole experience feels premium and calm." },
  { name: "Nadia K.",   role: "Class 10 student", text: "Asikon doesn't punish me for missing a day. I come back and pick up exactly where I left off." },
  { name: "Imran S.",   role: "Career switcher",  text: "Made the jump from sales to data analysis with a real portfolio. The mentors are the secret weapon." },
];

function TestimonialsCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" }, [
    Autoplay({ delay: 5500, stopOnInteraction: false }),
  ]);

  return (
    <section className="container-editorial py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="eyebrow-bar mb-3 justify-center inline-flex">Loved by learners</p>
        <h2 className="display-2">Real stories. Real momentum.</h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="shrink-0 basis-full sm:basis-[60%] lg:basis-[44%] px-3">
              <article className="relative glass-strong border border-white/10 rounded-[2rem] p-8 sm:p-10 min-h-[260px]">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/15" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-display text-lg sm:text-xl leading-snug text-foreground/90">
                  "{t.text}"
                </p>
                <div className="mt-6 pt-5 border-t border-border/40">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
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
/*  Story block — sticky meta card                                            */
/* -------------------------------------------------------------------------- */
function StorySection() {
  return (
    <section className="py-16 sm:py-24 lg:py-28 border-y border-border/40 bg-card/20">
      <div className="container-editorial grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="eyebrow-bar mb-3">Our story</p>
          <h2 className="display-2 mb-6">From a Dhaka classroom to learners everywhere.</h2>
          <div className="space-y-5 body-lg text-muted-foreground">
            <p>ASIKON started with a simple frustration: brilliant Bangladeshi students were being asked to learn in systems built for someone else, somewhere else.</p>
            <p>We believed the answer wasn't more content — it was the right content, in the right size, at the right time. So we built an AI tutor that listens, a daily mission that respects your time, and a community that cheers you on.</p>
            <p>Today ASIKON is a complete learning universe — calm, smart, and unmistakably made for you.</p>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <div className="glass-strong border border-white/10 rounded-[2rem] p-7 lg:sticky lg:top-24 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-30"
                 style={{ background: "var(--gradient-primary)" }} />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Founded</p>
              <p className="font-display text-3xl font-semibold mt-1">2024</p>
              <div className="my-5 h-px" style={{ background: "var(--gradient-hairline)" }} />
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Based in</p>
              <p className="font-display text-3xl font-semibold mt-1">Dhaka, BD</p>
              <div className="my-5 h-px" style={{ background: "var(--gradient-hairline)" }} />
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Built for</p>
              <p className="font-display text-3xl font-semibold mt-1">Every learner.</p>
              <p className="text-sm text-muted-foreground mt-5 italic leading-relaxed">
                "Education should feel like a guide walking beside you — not a wall in front of you."
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Final CTA                                                                 */
/* -------------------------------------------------------------------------- */
function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 aurora-bg" />
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-[80%] aspect-square rounded-full blur-[140px] opacity-30 -z-10"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="container-editorial text-center max-w-2xl">
        <p className="eyebrow-bar mb-4 justify-center inline-flex">Start today</p>
        <h2 className="display-1">
          Your future self{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
            starts today.
          </span>
        </h2>
        <p className="body-lg mt-6 text-muted-foreground">
          One small lesson. One calm streak. That's how everything changes.
        </p>
        <div className="mt-9 flex justify-center">
          <Button asChild size="lg" className="rounded-full px-10 h-14 text-base">
            <Link to="/learn">
              Begin your journey <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
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

      <Reveal as="section" className="container-editorial pt-4 pb-16 sm:pb-20">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow-bar mb-3">What drives us</p>
          <h2 className="display-2">Mission &amp; Vision.</h2>
        </div>
        <MissionVision />
      </Reveal>

      <Reveal as="div">
        <ImageTextRow
          eyebrow="Built for focus"
          title="A calm classroom in your pocket."
          body="Every lesson is a single, focused moment — designed to be finished in the time between two cups of tea. No infinite feeds, no anxiety, just clear next steps that compound into real skill."
          image={featureNotes}
          alt="A student taking notes beside a phone showing a lesson"
        />
      </Reveal>

      <Reveal as="div"><StorySection /></Reveal>

      <Reveal as="div">
        <ImageTextRow
          reverse
          eyebrow="Human + AI"
          title="A patient tutor that never gets tired."
          body="When the AI explains, it explains in your language and at your pace. When you need a human, real mentors are one tap away. The two work together — and you stay at the center of the story."
          image={featureMentor}
          alt="A mentor guiding a student through a lesson"
        />
      </Reveal>

      <Reveal as="div"><PrinciplesCarousel /></Reveal>

      <Reveal as="div">
        <ImageTextRow
          eyebrow="Made in Bangladesh"
          title="Built where it's needed most."
          body="ASIKON is built by a tight team of educators, designers, and engineers in Dhaka — for learners across Bangladesh and the world. Local context, global craft."
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
