import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import courseArt from "@/assets/coming-soon-course.webp";
import bookArt from "@/assets/coming-soon-book.webp";
import teachArt from "@/assets/coming-soon-teaching.webp";

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
    chip: "New Courses",
    title: "Master AI & ML",
    subtitle: "Expert-led courses in Python, ML and modern AI tools",
    href: "/shop?type=courses",
    art: courseArt,
    tone: "dark",
  },
  {
    chip: "Free Library",
    title: "1000+ AI Prompts",
    subtitle: "Boost your productivity with our curated prompts",
    href: "/prompts",
    art: bookArt,
    tone: "gray",
  },
  {
    chip: "Rewards",
    title: "Learning Rewards",
    subtitle: "Earn coins and XP for every lesson you complete",
    href: "/game",
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
    card: "bg-primary text-primary-foreground",
    title: "text-primary-foreground",
    sub: "text-primary-foreground/80",
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
      <div className="surface-panel relative overflow-hidden rounded-[22px] px-4 pb-5 pt-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] sm:rounded-[32px] sm:px-8 sm:pb-10 sm:pt-12">
        {/* Decorative floaters */}
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden>
          <div className="absolute left-[5%] top-[6%] h-4 w-4 rotate-[18deg] rounded-[4px] bg-[#1a1a1a] shadow-md sm:left-[8%] sm:top-[8%] sm:h-7 sm:w-7" />
          <div className="absolute left-[4%] top-[28%] text-primary sm:left-[10%] sm:top-[34%]">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="currentColor" className="sm:h-12 sm:w-12">
              <path d="M32 6c5 0 9 4 9 9 0 2-.6 3.8-1.6 5.3C45 19.5 50 24 50 30c0 5-4 9-9 9-2 0-3.8-.6-5.3-1.6.6 4.6 4.6 8.6 9.3 9.6L32 60 19 47c4.7-1 8.7-5 9.3-9.6C26.8 38.4 25 39 23 39c-5 0-9-4-9-9 0-6 5-10.5 10.6-9.7C23.6 18.8 23 17 23 15c0-5 4-9 9-9z" />
            </svg>
          </div>
          <div className="absolute right-[4%] top-[22%] text-[#bcd6f5] sm:right-[8%] sm:top-[30%]">
            <svg width="30" height="26" viewBox="0 0 24 21" fill="currentColor" className="sm:h-10 sm:w-12">
              <path d="M12 21s-7-4.5-9.5-9C.8 8.3 2.5 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 5.7 4.3 4 8-2.5 4.5-9.5 9-9.5 9z" />
            </svg>
          </div>
          <Sparkle className="absolute left-[18%] top-[4%] h-2.5 w-2.5 sm:left-[22%] sm:top-[6%] sm:h-5 sm:w-5" />
          <Sparkle className="absolute right-[18%] top-[5%] h-2.5 w-2.5 sm:right-[22%] sm:top-[8%] sm:h-5 sm:w-5" />
          <Sparkle className="absolute left-[10%] top-[55%] h-2 w-2 sm:left-[14%] sm:top-[60%] sm:h-3 sm:w-3" />
          <Sparkle className="absolute right-[10%] top-[52%] h-2 w-2 sm:right-[14%] sm:top-[58%] sm:h-3 sm:w-3" />
          <Sparkle className="absolute left-[38%] top-[1%] h-2 w-2 sm:left-[42%] sm:top-[2%] sm:h-2.5 sm:w-2.5" />
        </div>

        {/* Hero */}
        <div className="relative mx-auto max-w-2xl text-center">
          <h1
            className="font-grotesk text-[28px] font-extrabold leading-[1.05] tracking-[-0.035em] text-panel-fg sm:text-[60px]"
          >
            NO-1 Free-To-Learn
            <br />
            <span className="relative inline-block">
              Platform of 2026
              {/* tilted sticker */}
              <span className="absolute -right-1 top-[42%] rotate-[-8deg] rounded-[5px] border border-black/10 bg-white px-1 py-0.5 text-center text-[7px] font-semibold leading-tight text-[#0e0e10] shadow-sm sm:-right-4 sm:rounded-[6px] sm:px-1.5 sm:text-[10px]">
                free
              </span>
            </span>
          </h1>

          <p className="mt-2.5 text-[12.5px] font-medium tracking-tight text-panel-muted sm:mt-4 sm:text-[16px]">
            Learn without payment today!
          </p>

          {/* Stacked layered CTA pill */}
          <div className="relative mt-5 inline-flex items-center justify-center sm:mt-7">
            {/* stack shadows */}
            <span className="absolute inset-x-2 -bottom-2 h-full rounded-full border border-black/10 bg-white" />
            <span className="absolute inset-x-1 -bottom-1 h-full rounded-full border border-black/10 bg-white" />
            <div className="relative rounded-full border border-black/10 bg-white p-0.5 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.25)] sm:p-1">
              <Link
                to="/courses"
                className="relative inline-flex items-center gap-1.5 rounded-full bg-[#2541ff] px-4 py-2 text-[13px] font-extrabold tracking-tight text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)] transition-transform hover:scale-[1.03] hover:bg-[#1d36e0] sm:px-7 sm:py-3 sm:text-[16px]"
              >
                <span aria-hidden>✦</span>
                Learn for Free!
                <Sparkle className="absolute -right-1 -top-1 h-2.5 w-2.5 opacity-70 sm:h-3 sm:w-3" />
              </Link>
            </div>
            {/* emoji bubble + zzz */}
            <div className="absolute -right-7 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-xs shadow-sm sm:-right-12 sm:h-10 sm:w-10 sm:text-base">
              🥱
            </div>
            <span className="absolute -right-0.5 -top-2.5 text-[8px] font-bold text-[#9aa0b4] sm:-right-1 sm:-top-4 sm:text-xs">
              z<span className="text-[7px] sm:text-[10px]">z</span>
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="relative mt-6 grid grid-cols-3 gap-1.5 sm:mt-10 sm:gap-4">
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
                className="h-full"
              >
                <Link
                  to={item.href}
                  className={`group relative flex h-full min-h-[150px] flex-col overflow-hidden rounded-[14px] p-2 shadow-[0_18px_50px_-25px_rgba(0,0,0,0.45)] transition-shadow hover:shadow-[0_28px_70px_-25px_rgba(0,0,0,0.55)] sm:min-h-[320px] sm:rounded-[26px] sm:p-5 ${t.card}`}
                >
                  <span
                    className={`inline-flex w-fit items-center gap-0.5 rounded-full px-1 py-px text-[7px] font-medium sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px] ${t.chip}`}
                  >
                    <span className="h-1 w-1 rounded-full bg-black/70 sm:h-2 sm:w-2" />
                    {item.chip}
                  </span>

                  <h3
                    className={`mt-1 whitespace-pre-line font-grotesk text-[11px] font-bold leading-[1.05] tracking-tight sm:mt-3 sm:text-[26px] ${t.title}`}
                  >
                    {item.title}
                  </h3>
                  <p className={`mt-0.5 line-clamp-2 text-[8.5px] leading-snug sm:mt-1.5 sm:line-clamp-none sm:text-[13px] ${t.sub}`}>
                    {item.subtitle}
                  </p>

                  <div className="pointer-events-none relative mt-auto h-[55px] w-full sm:h-[150px]">
                    <img
                      src={item.art}
                      alt=""
                      loading="lazy"
                      aria-hidden="true"
                      className="absolute -bottom-1 right-0 h-[75px] w-auto max-w-[130%] object-contain transition-transform duration-700 group-hover:scale-[1.04] sm:-bottom-2 sm:h-[190px]"
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
