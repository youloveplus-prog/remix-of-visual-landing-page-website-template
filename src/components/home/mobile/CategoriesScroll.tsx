import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { Reveal } from "@/components/transitions/Reveal";
import { cn } from "@/lib/utils";

import aiImg from "@/assets/categories/ai.jpg";
import devImg from "@/assets/categories/dev.jpg";
import designImg from "@/assets/categories/design.jpg";
import financeImg from "@/assets/categories/finance.jpg";
import businessImg from "@/assets/categories/business.jpg";
import appsImg from "@/assets/categories/apps.jpg";
import gamesImg from "@/assets/categories/games.jpg";
import booksImg from "@/assets/categories/books.jpg";
import promptsImg from "@/assets/categories/prompts.jpg";
import mentorsImg from "@/assets/categories/mentors.jpg";
import communityImg from "@/assets/categories/community.jpg";
import tracksImg from "@/assets/categories/tracks.jpg";

type Cat = { image: string; label: string; href: string };

const CATS: Cat[] = [
  { image: aiImg,        label: "AI & ML",     href: "/shop?category=ai" },
  { image: devImg,       label: "Development", href: "/shop?category=dev" },
  { image: designImg,    label: "Design",      href: "/shop?category=design" },
  { image: financeImg,   label: "Finance",     href: "/shop?category=finance" },
  { image: businessImg,  label: "Business",    href: "/shop?category=business" },
  { image: appsImg,      label: "Apps",        href: "/shop?category=apps" },
  { image: gamesImg,     label: "Games",       href: "/shop?category=games" },
  { image: booksImg,     label: "Books",       href: "/shop?type=ebooks" },
  { image: promptsImg,   label: "Prompts",     href: "/prompts" },
  { image: mentorsImg,   label: "Mentors",     href: "/mentors" },
  { image: communityImg, label: "Community",   href: "/community" },
  { image: tracksImg,    label: "Tracks",      href: "/shop?type=courses" },
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

function CatTile({ image, label, href }: Cat) {
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
          src={image}
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
