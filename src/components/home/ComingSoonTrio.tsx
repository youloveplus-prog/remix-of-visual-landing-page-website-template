import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import courseImg from "@/assets/course-ai-ml.jpg";
import bookImg from "@/assets/book-hardcover.jpg";
import teachImg from "@/assets/ai-tutor.jpg";

type Tone = "dark" | "glass" | "brand";

type Item = {
  chip: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  tone: Tone;
};

const ITEMS: Item[] = [
  {
    chip: "New Course",
    title: "Agentic AI Engineering",
    subtitle: "Build production AI agents end-to-end.",
    href: "/courses",
    image: courseImg,
    tone: "dark",
  },
  {
    chip: "Coming Soon",
    title: "Prompting in Practice",
    subtitle: "A field guide for serious AI users.",
    href: "/shop",
    image: bookImg,
    tone: "glass",
  },
  {
    chip: "Waitlist Open",
    title: "1-on-1 Teaching",
    subtitle: "Personal tutor, weekly live sessions.",
    href: "/mentors",
    image: teachImg,
    tone: "brand",
  },
];

const toneClasses: Record<
  Tone,
  { card: string; chip: string; title: string; sub: string }
> = {
  dark: {
    card: "bg-[#0e0e10] text-white",
    chip: "border-white/15 bg-white/5 text-white/85",
    title: "text-white",
    sub: "text-white/70",
  },
  glass: {
    card: "bg-card/70 text-foreground border border-border/60 backdrop-blur",
    chip: "border-border/60 bg-background/70 text-foreground/80",
    title: "text-foreground",
    sub: "text-muted-foreground",
  },
  brand: {
    card:
      "text-white bg-[linear-gradient(160deg,hsl(var(--primary))_0%,hsl(var(--primary)/0.7)_55%,hsl(var(--primary)/0.45)_100%)]",
    chip: "border-white/20 bg-white/10 text-white",
    title: "text-white",
    sub: "text-white/85",
  },
};

export default function ComingSoonTrio() {
  return (
    <section className="section-x">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          What's next
        </p>
        <h2 className="font-grotesk text-2xl font-semibold text-foreground sm:text-3xl">
          New <span className="text-primary">·</span> Coming soon
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ITEMS.map((item, i) => {
          const t = toneClasses[item.tone];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={item.href}
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-5 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)] ${t.card}`}
              >
                <span
                  className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-medium ${t.chip}`}
                >
                  {item.chip}
                </span>

                <h3
                  className={`mt-4 font-grotesk text-2xl font-bold leading-tight tracking-tight sm:text-[26px] ${t.title}`}
                >
                  {item.title}
                </h3>
                <p className={`mt-2 text-sm ${t.sub}`}>{item.subtitle}</p>

                <div className="relative mt-5 -mx-5 -mb-5 mt-auto aspect-[16/11] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
