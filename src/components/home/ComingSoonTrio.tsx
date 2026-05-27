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
    chip: "bg-white text-black",
  },
  gray: {
    card: "bg-[#ececec] text-[#111]",
    title: "text-[#0e0e10]",
    sub: "text-[#5b5b62]",
    chip: "bg-white text-black",
  },
  lime: {
    card: "bg-[#c8ff5a] text-[#111]",
    title: "text-[#0e0e10]",
    sub: "text-[#2b2b30]",
    chip: "bg-white text-black",
  },
};

const Sparkle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path
      d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z"
      stroke="#9aa0b4"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ComingSoonTrio() {
  return (
    <section className="section-x">
      <div className="relative overflow-hidden rounded-[28px] border border-black/5 bg-[#f6f5f0] px-4 pb-6 pt-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] sm:rounded-[32px] sm:px-8 sm:pb-10 sm:pt-12">
        {/* Decorative floaters */}
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden>
          <div className="absolute left-[5%] top-[8%] h-5 w-5 rotate-[18deg] rounded-[5px] bg-[#1a1a1a] shadow-md sm:left-[8%] sm:h-7 sm:w-7" />
          <div className="absolute left-[6%] top-[34%] text-[#b9ec4d] sm:left-[10%]">
            <svg width="38" height="38" viewBox="0 0 64 64" fill="currentColor" className="sm:h-12 sm:w-12">
              <path d="M32 6c5 0 9 4 9 9 0 2-.6 3.8-1.6 5.3C45 19.5 50 24 50 30c0 5-4 9-9 9-2 0-3.8-.6-5.3-1.6.6 4.6 4.6 8.6 9.3 9.6L32 60 19 47c4.7-1 8.7-5 9.3-9.6C26.8 38.4 25 39 23 39c-5 0-9-4-9-9 0-6 5-10.5 10.6-9.7C23.6 18.8 23 17 23 15c0-5 4-9 9-9z" />
            </svg>
          </div>
          <div className="absolute right-[6%] top-[30%] text-[#bcd6f5] sm:right-[8%]">
            <svg width="40" height="36" viewBox="0 0 24 21" fill="currentColor" className="sm:h-10 sm:w-12">
              <path d="M12 21s-7-4.5-9.5-9C.8 8.3 2.5 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 5.7 4.3 4 8-2.5 4.5-9.5 9-9.5 9z" />
            </svg>
          </div>
          <Sparkle className="absolute left-[22%] top-[6%] h-3 w-3 sm:h-5 sm:w-5" />
          <Sparkle className="absolute right-[22%] top-[8%] h-3 w-3 sm:h-5 sm:w-5" />
          <Sparkle className="absolute left-[14%] top-[60%] h-3 w-3" />
          <Sparkle className="absolute right-[14%] top-[58%] h-3 w-3" />
          <Sparkle className="absolute left-[42%] top-[2%] h-2.5 w-2.5" />
        </div>

        {/* Hero */}
        <div className="relative mx-auto max-w-2xl text-center">
          <h1
            className="font-grotesk font-black tracking-[-0.03em] text-[#0e0e10]"
            style={{ fontSize: "clamp(28px, 8vw, 56px)", lineHeight: 1.02 }}
          >
            Nº1 Free-To-Play
            <br />
            <span className="relative inline-block">
              Social Casino
              {/* tilted sticker */}
              <span className="absolute -right-1 top-[38%] rotate-[-8deg] rounded-[6px] border border-black/10 bg-white px-1.5 py-0.5 text-center text-[8px] font-semibold leading-tight text-[#0e0e10] shadow-sm sm:-right-3 sm:text-[10px]">
                No purchase
                <br />
                neccessary
              </span>
            </span>
          </h1>

          <p className="mt-3 text-[13px] text-[#5b5b62] sm:text-[15px]">
            Play without payment today!
          </p>

          {/* Stacked layered CTA pill */}
          <div className="relative mt-6 inline-flex items-center justify-center">
            {/* stack shadows */}
            <span className="absolute inset-x-2 -bottom-2 h-full rounded-full border border-black/10 bg-white" />
            <span className="absolute inset-x-1 -bottom-1 h-full rounded-full border border-black/10 bg-white" />
            <div className="relative rounded-full border border-black/10 bg-white p-1 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.25)]">
              <Link
                to="/courses"
                className="relative inline-flex items-center gap-1.5 rounded-full bg-[#c8ff5a] px-5 py-2 text-[14px] font-extrabold text-[#0e0e10] shadow-[inset_0_-2px_0_rgba(0,0,0,0.08)] transition-transform hover:scale-[1.03] sm:px-6 sm:py-2.5 sm:text-[15px]"
              >
                <span aria-hidden>✦</span>
                Play for Free!
                <Sparkle className="absolute -right-1 -top-1 h-3 w-3 opacity-70" />
              </Link>
            </div>
            {/* emoji bubble + zzz */}
            <div className="absolute -right-9 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-sm shadow-sm sm:-right-12 sm:h-10 sm:w-10 sm:text-base">
              😴
            </div>
            <span className="absolute -right-1 -top-3 text-[10px] font-bold text-[#9aa0b4] sm:-top-4 sm:text-xs">
              z<span className="text-[8px] sm:text-[10px]">z</span>
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="relative mt-6 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 sm:mt-10 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
          {ITEMS.map((item, i) => {
            const t = TONES[item.tone];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="h-full w-[72vw] max-w-[260px] flex-shrink-0 snap-center sm:w-auto sm:max-w-none"
              >
                <Link
                  to={item.href}
                  className={`group relative flex h-full min-h-[210px] flex-col overflow-hidden rounded-[18px] p-3 shadow-[0_18px_50px_-25px_rgba(0,0,0,0.45)] transition-shadow hover:shadow-[0_28px_70px_-25px_rgba(0,0,0,0.55)] sm:min-h-[320px] sm:rounded-[26px] sm:p-5 ${t.card}`}
                >
                  <span
                    className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium sm:px-2.5 sm:py-1 sm:text-[11px] ${t.chip}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-black/70 sm:h-2 sm:w-2" />
                    {item.chip}
                  </span>

                  <h3
                    className={`mt-2 whitespace-pre-line font-grotesk text-[15px] font-bold leading-[1.05] tracking-tight sm:mt-3 sm:text-[26px] ${t.title}`}
                  >
                    {item.title}
                  </h3>
                  <p className={`mt-1 text-[11px] leading-snug sm:mt-1.5 sm:text-[13px] ${t.sub}`}>
                    {item.subtitle}
                  </p>

                  <div className="pointer-events-none relative mt-auto h-[90px] w-full sm:h-[150px]">
                    <img
                      src={item.art}
                      alt=""
                      loading="lazy"
                      aria-hidden="true"
                      className="absolute -bottom-1 right-0 h-[120px] w-auto max-w-[125%] object-contain transition-transform duration-700 group-hover:scale-[1.04] sm:-bottom-2 sm:h-[190px]"
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
