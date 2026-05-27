import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import tileAi from "@/assets/about/tile-ai-tutor.jpg";
import tileCommunity from "@/assets/about/tile-community.jpg";
import tileDaily from "@/assets/about/tile-daily.jpg";
import tileBangla from "@/assets/about/tile-bangla.jpg";
import featureMentor from "@/assets/about/feature-mentor.jpg";
import featureNotes from "@/assets/about/feature-notes.jpg";
import storyClassroom from "@/assets/about/story-classroom.jpg";

type Tile = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta: string;
  to: string;
  image: string;
  alt: string;
  /** "dark" → light text on dark image; "light" → dark text on bright image */
  tone: "dark" | "light";
  /** mobile span — defaults to 2 (full width); desktop span on 12-col grid */
  spanMobile?: 1 | 2;
  spanDesktop?: 4 | 6 | 8 | 12;
  rows?: 1 | 2;
};

const TILES: Tile[] = [
  {
    eyebrow: "AI tutor",
    title: "A patient guide,\nalways on.",
    subtitle: "Explanations in your language, at your pace.",
    cta: "Meet the tutor",
    to: "/learn",
    image: tileAi,
    alt: "Glowing AI tutor interface above a desk",
    tone: "dark",
    spanMobile: 2,
    spanDesktop: 8,
    rows: 2,
  },
  {
    eyebrow: "Mother tongue",
    title: "Bangla-first.",
    subtitle: "Nothing lost in translation.",
    cta: "Learn in Bangla",
    to: "/learn",
    image: tileBangla,
    alt: "Bangla alphabet written in ink on cream paper",
    tone: "light",
    spanMobile: 2,
    spanDesktop: 4,
  },
  {
    eyebrow: "Daily mission",
    title: "Five quiet minutes.",
    subtitle: "Every day. Nothing more.",
    cta: "See today's lesson",
    to: "/learn",
    image: tileDaily,
    alt: "Hand holding a phone with a lesson on a Dhaka street",
    tone: "dark",
    spanMobile: 2,
    spanDesktop: 4,
  },
  {
    eyebrow: "Community",
    title: "Learn together.",
    subtitle: "Bangladeshi students lifting each other up.",
    cta: "Join the circle",
    to: "/community",
    image: tileCommunity,
    alt: "Bangladeshi students collaborating around a laptop",
    tone: "dark",
    spanMobile: 2,
    spanDesktop: 8,
  },
  {
    eyebrow: "1-on-1 mentor",
    title: "A real mentor,\none tap away.",
    subtitle: "Personal teachers for every child.",
    cta: "Book a mentor",
    to: "/mentorship",
    image: featureMentor,
    alt: "A Bangladeshi mentor guiding a student at a laptop",
    tone: "dark",
    spanMobile: 2,
    spanDesktop: 6,
  },
  {
    eyebrow: "Skill paths",
    title: "Tracks for every starting point.",
    cta: "Browse tracks",
    to: "/learn",
    image: featureNotes,
    alt: "A Bangla notebook beside a phone showing a lesson",
    tone: "dark",
    spanMobile: 2,
    spanDesktop: 6,
  },
];


function TileCard({ t }: { t: Tile }) {
  const desktopColMap: Record<number, string> = {
    4: "lg:col-span-4",
    6: "lg:col-span-6",
    8: "lg:col-span-8",
    12: "lg:col-span-12",
  };
  const mobileColMap: Record<number, string> = {
    1: "sm:col-span-1",
    2: "sm:col-span-2",
  };

  return (
    <Link
      to={t.to}
      className={cn(
        "group relative block overflow-hidden rounded-xl sm:rounded-[2rem] border border-white/10",
        "col-span-1 aspect-square sm:aspect-[5/4]",
        t.rows === 2 && "lg:row-span-2 lg:aspect-auto lg:min-h-[640px]",
        mobileColMap[t.spanMobile ?? 2],
        desktopColMap[t.spanDesktop ?? 6],
      )}
    >
      <img
        src={t.image}
        alt={t.alt}
        loading="lazy"
        width={1280}
        height={960}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      />
      {/* tone-aware gradient overlay */}
      <div
        className={cn(
          "absolute inset-0",
          t.tone === "dark"
            ? "bg-gradient-to-b from-black/10 via-black/30 to-black/75"
            : "bg-gradient-to-b from-white/0 via-white/10 to-white/80",
        )}
      />
      {/* brand wash on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-soft-light"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl sm:rounded-[2rem] pointer-events-none" />

      {/* content */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end p-2.5 sm:p-7 lg:p-9 text-center sm:text-left",
          t.tone === "dark" ? "text-white" : "text-neutral-900",
        )}
      >
        {t.eyebrow && (
          <p
            className={cn(
              "text-[9px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-medium mb-1 sm:mb-3 mx-auto sm:mx-0",
              t.tone === "dark" ? "text-white/70" : "text-neutral-700",
            )}
          >
            {t.eyebrow}
          </p>
        )}
        <h3
          className="font-display font-semibold tracking-[-0.025em] leading-[1.05] whitespace-pre-line text-[12px] sm:text-[1.75rem] lg:text-[2.25rem]"
        >
          {t.title}
        </h3>
        {t.subtitle && (
          <p
            className={cn(
              "hidden sm:block mt-1.5 sm:mt-3 text-[12.5px] sm:text-[14.5px] leading-[1.45] sm:leading-[1.5] max-w-[36ch] mx-auto sm:mx-0",
              t.tone === "dark" ? "text-white/75" : "text-neutral-700",
            )}
          >
            {t.subtitle}
          </p>
        )}
        <div className="mt-1.5 sm:mt-5 flex justify-center sm:justify-start">
          <span
            className={cn(
              "inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-4 h-6 sm:h-9 text-[10px] sm:text-[13px] font-medium liquid-glass-pill transition-transform group-hover:translate-y-[-1px]",
              t.tone === "dark" ? "on-dark text-white" : "text-neutral-900",
            )}
          >
            {t.cta}
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function BentoGallery() {
  return (
    <section className="container-editorial py-10 sm:py-20 lg:py-32">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-16">
        <p className="eyebrow-bar mb-3 justify-center inline-flex">Everything in one place</p>
        <h2
          className="font-display font-semibold tracking-[-0.03em] leading-[1.02]"
          style={{ fontSize: "clamp(1.6rem, 5vw, 3.5rem)" }}
        >
          One platform.{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            Every way to learn.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 auto-rows-auto gap-2 sm:gap-4 lg:gap-5">
        {TILES.map((t) => (
          <TileCard key={t.title} t={t} />
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Endless learning — horizontal showcase carousel (Apple TV row vibe)        */
/* -------------------------------------------------------------------------- */
const SHOWCASE = [
  {
    badge: "AI Tutor",
    title: "Ask anything,\nany time.",
    cta: "Try it",
    image: tileAi,
    tone: "dark" as const,
    to: "/learn",
  },
  {
    badge: "Mentorship",
    title: "Real teachers\nfor real kids.",
    cta: "Book now",
    image: featureMentor,
    tone: "dark" as const,
    to: "/mentorship",
  },
  {
    badge: "Community",
    title: "Study with\nyour people.",
    cta: "Join",
    image: tileCommunity,
    tone: "dark" as const,
    to: "/community",
  },
  {
    badge: "Bangla-first",
    title: "Lessons in\nyour language.",
    cta: "Open",
    image: tileBangla,
    tone: "light" as const,
    to: "/learn",
  },
  {
    badge: "Daily mission",
    title: "Five minutes,\nevery day.",
    cta: "Start",
    image: tileDaily,
    tone: "dark" as const,
    to: "/learn",
  },
  {
    badge: "Tracks",
    title: "From zero\nto shipped.",
    cta: "Browse",
    image: storyClassroom,
    tone: "dark" as const,
    to: "/learn",
  },
];

export function EndlessShowcase() {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    loop: true,
  });

  return (
    <section className="py-10 sm:py-20 lg:py-32 border-y border-border/40 bg-card/20">
      <div className="container-editorial text-center mb-8 sm:mb-10 lg:mb-14">
        <p className="eyebrow-bar mb-3 justify-center inline-flex">Endless learning</p>
        <h2
          className="font-display font-semibold tracking-[-0.03em] leading-[1.02]"
          style={{ fontSize: "clamp(1.6rem, 5vw, 3.5rem)" }}
        >
          A whole library, always open.
        </h2>
      </div>

      <div
        className="overflow-hidden pl-[max(1rem,calc((100vw-72rem)/2))]"
        ref={emblaRef}
      >
      <div className="flex gap-3 sm:gap-4 pr-4">
          {SHOWCASE.map((s) => (
            <Link
              to={s.to}
              key={s.title}
              className="group relative shrink-0 basis-[46%] sm:basis-[36%] lg:basis-[22%] aspect-[3/4] sm:aspect-[3/4] rounded-xl sm:rounded-[1.75rem] overflow-hidden border border-white/10"
            >
              <img
                src={s.image}
                alt=""
                loading="lazy"
                width={1280}
                height={960}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
              />
              <div
                className={cn(
                  "absolute inset-0",
                  s.tone === "dark"
                    ? "bg-gradient-to-b from-black/10 via-black/40 to-black/85"
                    : "bg-gradient-to-b from-white/0 via-white/20 to-white/85",
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 flex flex-col p-3 sm:p-6",
                  s.tone === "dark" ? "text-white" : "text-neutral-900",
                )}
              >
                <p
                  className={cn(
                    "text-[9px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] font-medium",
                    s.tone === "dark" ? "text-white/75" : "text-neutral-700",
                  )}
                >
                  {s.badge}
                </p>
                <div className="mt-auto">
                  <h3
                    className="font-display font-semibold tracking-[-0.02em] leading-[1.08] whitespace-pre-line text-[13px] sm:text-[1.05rem] lg:text-[1.6rem]"
                  >
                    {s.title}
                  </h3>
                  <div className="mt-2 sm:mt-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 h-6 sm:px-3.5 sm:h-8 text-[11px] sm:text-[12.5px] font-medium liquid-glass-pill",
                        s.tone === "dark" ? "on-dark text-white" : "text-neutral-900",
                      )}
                    >
                      {s.cta}
                      <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl sm:rounded-[1.75rem] pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
