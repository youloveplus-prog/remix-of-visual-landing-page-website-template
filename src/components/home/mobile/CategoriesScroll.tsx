import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { Reveal } from "@/components/transitions/Reveal";
import { cn } from "@/lib/utils";

// Responsive variants: 1x=64, 2x=128, 3x=192 (tiles render at 52px CSS).
// vite-imagetools generates webp + jpg variants at build time.
const SRCSET_Q = "?w=64;128;192&format=webp&as=srcset" as const;
const FALLBACK_Q = "?w=128&format=jpg" as const;

import aiSet from "@/assets/categories/ai.jpg?w=64;128;192&format=webp&as=srcset";
import aiSrc from "@/assets/categories/ai.jpg?w=128&format=jpg";
import devSet from "@/assets/categories/dev.jpg?w=64;128;192&format=webp&as=srcset";
import devSrc from "@/assets/categories/dev.jpg?w=128&format=jpg";
import designSet from "@/assets/categories/design.jpg?w=64;128;192&format=webp&as=srcset";
import designSrc from "@/assets/categories/design.jpg?w=128&format=jpg";
import financeSet from "@/assets/categories/finance.jpg?w=64;128;192&format=webp&as=srcset";
import financeSrc from "@/assets/categories/finance.jpg?w=128&format=jpg";
import businessSet from "@/assets/categories/business.jpg?w=64;128;192&format=webp&as=srcset";
import businessSrc from "@/assets/categories/business.jpg?w=128&format=jpg";
import appsSet from "@/assets/categories/apps.jpg?w=64;128;192&format=webp&as=srcset";
import appsSrc from "@/assets/categories/apps.jpg?w=128&format=jpg";
import gamesSet from "@/assets/categories/games.jpg?w=64;128;192&format=webp&as=srcset";
import gamesSrc from "@/assets/categories/games.jpg?w=128&format=jpg";
import booksSet from "@/assets/categories/books.jpg?w=64;128;192&format=webp&as=srcset";
import booksSrc from "@/assets/categories/books.jpg?w=128&format=jpg";
import promptsSet from "@/assets/categories/prompts.jpg?w=64;128;192&format=webp&as=srcset";
import promptsSrc from "@/assets/categories/prompts.jpg?w=128&format=jpg";
import mentorsSet from "@/assets/categories/mentors.jpg?w=64;128;192&format=webp&as=srcset";
import mentorsSrc from "@/assets/categories/mentors.jpg?w=128&format=jpg";
import communitySet from "@/assets/categories/community.jpg?w=64;128;192&format=webp&as=srcset";
import communitySrc from "@/assets/categories/community.jpg?w=128&format=jpg";
import tracksSet from "@/assets/categories/tracks.jpg?w=64;128;192&format=webp&as=srcset";
import tracksSrc from "@/assets/categories/tracks.jpg?w=128&format=jpg";

type Cat = { src: string; srcSet: string; label: string; href: string };

const CATS: Cat[] = [
  { src: aiSrc,        srcSet: aiSet,        label: "AI & ML",     href: "/shop?category=ai" },
  { src: devSrc,       srcSet: devSet,       label: "Development", href: "/shop?category=dev" },
  { src: designSrc,    srcSet: designSet,    label: "Design",      href: "/shop?category=design" },
  { src: financeSrc,   srcSet: financeSet,   label: "Finance",     href: "/shop?category=finance" },
  { src: businessSrc,  srcSet: businessSet,  label: "Business",    href: "/shop?category=business" },
  { src: appsSrc,      srcSet: appsSet,      label: "Apps",        href: "/shop?category=apps" },
  { src: gamesSrc,     srcSet: gamesSet,     label: "Games",       href: "/shop?category=games" },
  { src: booksSrc,     srcSet: booksSet,     label: "Books",       href: "/shop?type=ebooks" },
  { src: promptsSrc,   srcSet: promptsSet,   label: "Prompts",     href: "/prompts" },
  { src: mentorsSrc,   srcSet: mentorsSet,   label: "Mentors",     href: "/mentors" },
  { src: communitySrc, srcSet: communitySet, label: "Community",   href: "/community" },
  { src: tracksSrc,    srcSet: tracksSet,    label: "Tracks",      href: "/shop?type=courses" },
];

export function CategoriesScroll() {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });

  const pairs: Cat[][] = [];
  for (let i = 0; i < CATS.length; i += 2) pairs.push(CATS.slice(i, i + 2));

  return (
    <Reveal as="section" className="section-x">
      <div className="flex items-end justify-between mb-2">
        <h2 className="font-semibold text-base">Categories</h2>
        <Link to="/shop" className="text-xs text-primary font-medium">See all</Link>
      </div>

      {/* Mobile: 2-row scroll, image chips */}
      <div className="md:hidden -mx-3 px-3 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2.5">
          {pairs.map((pair, i) => (
            <div key={i} className="shrink-0 flex flex-col gap-2.5 w-[78px]">
              {pair.map((c) => <CatTile key={c.label} {...c} />)}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-6 lg:grid-cols-12 gap-3">
        {CATS.map((c) => <CatTile key={c.label} {...c} />)}
      </div>
    </Reveal>
  );
}

function CatTile({ src, srcSet, label, href }: Cat) {
  return (
    <Link
      to={href}
      className="group focus-ring flex flex-col items-center gap-1.5 rounded-2xl py-1.5 px-1 active:scale-[0.94] hover:-translate-y-0.5 transition-transform"
    >
      <div
        className={cn(
          "relative w-[52px] h-[52px] rounded-[16px] overflow-hidden",
          "border border-white/10",
          "shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.45),inset_0_1px_0_hsl(var(--glass-highlight)/0.18)]",
          "transition-all duration-300 group-hover:shadow-[0_12px_28px_-12px_hsl(var(--primary)/0.6)]",
        )}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes="52px"
          alt={label}
          loading="lazy"
          decoding="async"
          width={52}
          height={52}
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-2 top-1 h-1/3 rounded-full bg-gradient-to-b from-white/35 to-transparent blur-[2px]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[16px]"
        />
      </div>
      <span className="text-[11px] font-medium leading-tight text-center truncate w-full text-foreground/85">
        {label}
      </span>
    </Link>
  );
}
