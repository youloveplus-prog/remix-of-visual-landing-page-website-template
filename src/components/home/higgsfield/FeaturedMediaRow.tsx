import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { homeType } from "@/components/home/typography";

type Tile = {
  title: string;
  kicker: string;
  image: string;
  to: string;
  cta?: string;
};

const TILES: Tile[] = [
  {
    kicker: "FLAGSHIP COURSE",
    title: "Master Python from zero to AI",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=70",
    to: "/shop?type=courses",
    cta: "Start learning",
  },
  {
    kicker: "AI TUTOR",
    title: "Ask anything. Learn anything. 24/7.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=70",
    to: "/learn",
    cta: "Open tutor",
  },
  {
    kicker: "MENTORSHIP",
    title: "1-on-1 teachers for your child",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=70",
    to: "/mentors",
    cta: "Join waitlist",
  },
  {
    kicker: "PROMPTS",
    title: "200+ curated prompts. Free.",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=70",
    to: "/prompts",
    cta: "Browse",
  },
];

export function FeaturedMediaRow() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map((t) => (
          <Link
            key={t.title}
            to={t.to}
            className="group relative block aspect-[4/5] overflow-hidden rounded-[10px] border border-white/10 bg-neutral-900"
          >
            <img
              src={t.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <span className="self-start rounded-sm bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                {t.kicker}
              </span>
              <div>
                <h3 className={`${homeType.sectionTitle} text-white`}>
                  {t.title}
                </h3>

                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--hf-accent))]">
                  {t.cta ?? "Open"} <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
