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
    chip: "New Course",
    title: "Agentic AI\nEngineering",
    subtitle: "Build production AI agents end-to-end.",
    href: "/courses",
    art: courseArt,
    tone: "dark",
  },
  {
    chip: "Coming Soon",
    title: "Prompting in\nPractice",
    subtitle: "A field guide for serious AI users.",
    href: "/shop",
    art: bookArt,
    tone: "gray",
  },
  {
    chip: "Waitlist Open",
    title: "1-on-1\nTeaching",
    subtitle: "Personal tutor, weekly live sessions.",
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
    sub: "text-white/65",
    chip: "bg-white/95 text-black",
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

export default function ComingSoonTrio() {
  return (
    <section className="section-x">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          What's next
        </p>
        <h2 className="font-grotesk text-2xl font-semibold text-foreground sm:text-3xl">
          New <span className="text-primary">·</span> Coming soon
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                {/* Chip */}
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium shadow-sm ${t.chip}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-black/80" />
                  {item.chip}
                </span>

                {/* Title + subtitle */}
                <h3
                  className={`mt-4 whitespace-pre-line font-grotesk text-[26px] font-bold leading-[1.05] tracking-tight sm:text-[28px] ${t.title}`}
                >
                  {item.title}
                </h3>
                <p className={`mt-2 text-[13px] leading-snug ${t.sub}`}>
                  {item.subtitle}
                </p>

                {/* Illustration — anchored bottom, slightly oversized */}
                <div className="pointer-events-none relative mt-auto h-[150px] w-full">
                  <img
                    src={item.art}
                    alt=""
                    loading="lazy"
                    aria-hidden="true"
                    className="absolute -bottom-4 -right-3 h-[180px] w-auto max-w-[115%] object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
