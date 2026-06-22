import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Play } from "lucide-react";

const MEDIA = [
  {
    label: "AI Tutor",
    title: "Voice + chat, 24/7",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=70",
    to: "/learn",
  },
  {
    label: "Courses",
    title: "Project-based tracks",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=70",
    to: "/shop?type=courses",
  },
  {
    label: "Mentorship",
    title: "1-on-1 for your child",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=70",
    to: "/mentors",
  },
];

export function HiggsfieldHero() {
  return (
    <section className="hf-hero relative isolate overflow-hidden border-b border-white/10 bg-black">
      {/* Ambient indigo glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[1100px] -translate-x-1/2 rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "radial-gradient(closest-side, hsl(var(--hf-accent)), transparent)" }}
      />
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24 lg:pb-16 text-center sm:text-left">
        {/* Eyebrow */}
        <Link
          to="/learn"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/80 backdrop-blur transition hover:border-[hsl(var(--hf-accent))] hover:text-white"
        >
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--hf-accent))]" />
          New — AI Tutor now with voice
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>

        {/* Headline */}
        <h1 className="mt-7 max-w-[14ch] mx-auto sm:mx-0 font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-[68px] lg:text-[104px]">
          Learn anything.
          <br />
          <span className="text-white/60">Build </span>
          <span className="italic text-[hsl(var(--hf-accent))]">everything</span>
          <span className="text-white/60">.</span>
        </h1>

        <p className="mt-6 max-w-xl mx-auto sm:mx-0 text-base text-white/65 sm:text-lg">
          ASIKON is the AI-powered learning platform — courses, a 24/7 tutor, mentors,
          prompts and a community, all in one black canvas.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <Link
            to="/shop"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[hsl(var(--hf-accent))] px-5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_hsl(var(--hf-accent))] transition hover:brightness-110"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/learn"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/30 hover:bg-white/[0.08]"
          >
            <Play className="h-4 w-4 fill-current" />
            Try the AI Tutor
          </Link>
          <span className="w-full sm:w-auto sm:ml-1 text-xs text-white/50">
            12,400+ learners · No credit card
          </span>
        </div>


        {/* Featured media wall */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {MEDIA.map((m, i) => (
            <Link
              key={m.title}
              to={m.to}
              className={`group relative block overflow-hidden rounded-[14px] border border-white/10 bg-neutral-950 ${
                i === 0 ? "aspect-[4/5] sm:aspect-[3/4]" : "aspect-[4/5] sm:aspect-[3/4]"
              }`}
            >
              <img
                src={m.image}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                    {m.label}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold leading-tight text-white">
                    {m.title}
                  </div>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition group-hover:border-[hsl(var(--hf-accent))] group-hover:bg-[hsl(var(--hf-accent))]">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
