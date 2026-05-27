import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import courseArt from "@/assets/coming-soon-course.png";
import bookArt from "@/assets/coming-soon-book.png";
import teachArt from "@/assets/coming-soon-teaching.png";

type Tone = "dark" | "gray" | "lime";

type Item = {
  chip: string;
  title: string;
  subtitle: string;
  href: string;
  art: string;
  tone: Tone;
};

const ITEMS: Item[] = [
  {
    chip: "Welcome Bonus",
    title: "Welcome Bonus",
    subtitle: "Spin the Wheel and win Free Spins!",
    href: "/courses",
    art: courseArt,
    tone: "dark",
  },
  {
    chip: "Play for Free",
    title: "No purchase\nneccessary!",
    subtitle: "Play without payment today!",
    href: "/shop",
    art: bookArt,
    tone: "gray",
  },
  {
    chip: "Free Coins",
    title: "Free Sweep Coins",
    subtitle: "Earn for free every day!",
    href: "/mentors",
    art: teachArt,
    tone: "lime",
  },
];

const TONES: Record<
  Tone,
  { card: string; title: string; sub: string; chip: string }
> = {
  dark: {
    card: "bg-[#111114] text-white",
    title: "text-white",
    sub: "text-white/70",
    chip: "bg-white text-black border border-black/5",
  },
  gray: {
    card: "bg-[#ececec] text-[#111]",
    title: "text-[#0e0e10]",
    sub: "text-[#5b5b62]",
    chip: "bg-white text-black border border-black/5",
  },
  lime: {
    card: "bg-[#c8ff5a] text-[#111]",
    title: "text-[#0e0e10]",
    sub: "text-[#2b2b30]",
    chip: "bg-white text-black border border-black/5",
  },
};

const Sparkle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path
      d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z"
      stroke="#9aa0b4"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ComingSoonTrio() {
  return (
    <section className="section-x">
      <div className="relative overflow-hidden rounded-[32px] border border-black/5 bg-[#f5f4ef] px-5 py-10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] sm:px-8 sm:py-14">
        {/* Decorative floaters */}
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden>
          {/* dark tilted square top-left */}
          <div className="absolute left-[6%] top-[14%] h-6 w-6 rotate-[18deg] rounded-[6px] bg-[#1a1a1a] shadow-md sm:h-8 sm:w-8" />
          {/* lime clover left */}
          <div className="absolute left-[10%] top-[42%] text-[#b9ec4d] sm:left-[14%]">
            <svg width="44" height="44" viewBox="0 0 64 64" fill="currentColor">
              <path d="M32 6c5 0 9 4 9 9 0 2-.6 3.8-1.6 5.3C45 19.5 50 24 50 30c0 5-4 9-9 9-2 0-3.8-.6-5.3-1.6.6 4.6 4.6 8.6 9.3 9.6L32 60 19 47c4.7-1 8.7-5 9.3-9.6C26.8 38.4 25 39 23 39c-5 0-9-4-9-9 0-6 5-10.5 10.6-9.7C23.6 18.8 23 17 23 15c0-5 4-9 9-9z" />
            </svg>
          </div>
          {/* blue heart right */}
          <div className="absolute right-[8%] top-[36%] text-[#bcd6f5]">
            <svg width="48" height="42" viewBox="0 0 24 21" fill="currentColor">
              <path d="M12 21s-7-4.5-9.5-9C.8 8.3 2.5 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 5.7 4.3 4 8-2.5 4.5-9.5 9-9.5 9z" />
            </svg>
          </div>
          {/* sparkles */}
          <Sparkle className="absolute left-[26%] top-[10%] h-4 w-4 sm:h-5 sm:w-5" />
          <Sparkle className="absolute right-[26%] top-[12%] h-4 w-4 sm:h-5 sm:w-5" />
          <Sparkle className="absolute left-[18%] top-[58%] h-3 w-3" />
          <Sparkle className="absolute right-[18%] top-[60%] h-3 w-3" />
        </div>

        {/* Hero copy */}
        <div className="relative mx-auto max-w-2xl text-center">
          <h1 className="font-grotesk text-[34px] font-extrabold leading-[1.02] tracking-tight text-[#0e0e10] sm:text-[52px]">
            New <span className="relative inline-block">·
              {/* tiny sticker */}
              <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 translate-x-full rotate-[-6deg] rounded-md border border-black/10 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#0e0e10] shadow-sm sm:inline-block">
                No purchase
                <br />
                neccessary
              </span>
            </span>
            <br />
            Coming Soon
          </h1>
          <p className="mt-3 text-sm text-[#5b5b62] sm:text-base">
            Fresh drops landing soon — courses, books, and 1-on-1 teaching.
          </p>

          {/* CTA pill */}
          <div className="relative mt-6 inline-flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#c8ff5a]/40 blur-md" />
            <div className="relative rounded-full bg-white p-1 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.2)] ring-1 ring-black/10">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-full bg-[#c8ff5a] px-6 py-2.5 text-[15px] font-bold text-[#0e0e10] shadow-inner transition-transform hover:scale-[1.03]"
              >
                <span className="text-[#0e0e10]">✦</span>
                Explore for Free!
              </Link>
            </div>
            {/* speech bubble */}
            <div className="absolute -right-10 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-base shadow-sm sm:flex">
              😄
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="relative mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {ITEMS.map((item, i) => {
            const t = TONES[item.tone];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="h-full"
              >
                <Link
                  to={item.href}
                  className={`group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[26px] p-5 shadow-[0_18px_50px_-25px_rgba(0,0,0,0.45)] transition-shadow hover:shadow-[0_28px_70px_-25px_rgba(0,0,0,0.55)] ${t.card}`}
                >
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-medium ${t.chip}`}
                  >
                    {item.chip}
                  </span>

                  <h3
                    className={`mt-3 whitespace-pre-line font-grotesk text-[24px] font-bold leading-[1.05] tracking-tight sm:text-[26px] ${t.title}`}
                  >
                    {item.title}
                  </h3>
                  <p className={`mt-2 text-[13px] leading-snug ${t.sub}`}>
                    {item.subtitle}
                  </p>

                  <div className="pointer-events-none relative mt-auto h-[150px] w-full">
                    <img
                      src={item.art}
                      alt=""
                      loading="lazy"
                      aria-hidden="true"
                      className="absolute -bottom-2 right-0 h-[190px] w-auto max-w-[120%] object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
