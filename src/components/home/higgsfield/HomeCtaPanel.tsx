import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { homeType } from "@/components/home/typography";

/** Brand collaboration logos — shown in their own rounded cards. */
const COLLABORATORS = [
  {
    name: "OpenAI",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.515-4.902 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.985 5.985 0 0 0 .515 4.901 6.046 6.046 0 0 0 6.51 2.9 5.985 5.985 0 0 0 4.504 2.01 6.046 6.046 0 0 0 5.766-4.207 5.985 5.985 0 0 0 3.998-2.9 6.046 6.046 0 0 0-.743-7.097zM13.255 22.61a4.482 4.482 0 0 1-2.879-1.04l.142-.08 4.778-2.758a.78.78 0 0 0 .393-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.492 4.493zM3.6 18.49a4.482 4.482 0 0 1-.535-3.014l.142.085 4.782 2.758a.778.778 0 0 0 .787 0l5.838-3.37v2.333a.072.072 0 0 1-.029.062L9.756 20.14a4.504 4.504 0 0 1-6.156-1.65zM2.34 8.103A4.482 4.482 0 0 1 4.681 6.13v5.683a.78.78 0 0 0 .394.68l5.808 3.355-2.02 1.168a.072.072 0 0 1-.067 0L3.96 14.234a4.504 4.504 0 0 1-1.62-6.131zm16.59 3.853L13.099 8.6 15.115 7.43a.072.072 0 0 1 .067 0l4.835 2.793a4.494 4.494 0 0 1-.673 8.105v-5.683a.79.79 0 0 0-.414-.689zm2.01-3.024l-.141-.085-4.774-2.776a.78.78 0 0 0-.788 0L9.4 9.444V7.1a.072.072 0 0 1 .029-.062l4.835-2.787a4.5 4.5 0 0 1 6.677 4.658zM8.3 13.05l-2.02-1.164a.07.07 0 0 1-.038-.057V6.241a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.78.78 0 0 0-.394.68z" />
      </svg>
    ),
  },
  {
    name: "Anthropic",
    svg: (
      <span className="font-display text-[18px] font-extrabold tracking-tight">Anthropic</span>
    ),
  },
  {
    name: "GitHub",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: "Notion",
    svg: (
      <span className="font-display text-[18px] font-extrabold tracking-tight">Notion</span>
    ),
  },
  {
    name: "Figma",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto">
        <path d="M8 24c2.21 0 4-1.79 4-4v-4H8a4 4 0 0 0 0 8zM4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zM4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zM12 0h4a4 4 0 0 1 0 8h-4zM20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
      </svg>
    ),
  },
  {
    name: "VS Code",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto">
        <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
      </svg>
    ),
  },
  {
    name: "Google",
    svg: (
      <span className="font-display text-[18px] font-extrabold tracking-tight">Google</span>
    ),
  },
];

export function HomeCtaPanel() {
  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[20px] border border-white/10 bg-[#0a0a0a] px-6 pb-8 pt-10 sm:px-10 sm:pb-12 sm:pt-14">
        {/* Soft indigo top glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-64 w-[80%] rounded-full bg-primary/15 blur-3xl"
        />

        <div className="relative flex flex-col items-center text-center">
          {/* Gradient pill eyebrow */}
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary via-primary/80 to-[hsl(190_85%_55%)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_6px_24px_-8px_hsl(var(--primary)/0.7)]">
            Unlimited Asikon AI Access
          </span>

          {/* Big silver headline */}
          <h2
            className={`mt-6 ${homeType.bandTitle}`}
            style={{
              backgroundImage:
                "linear-gradient(180deg, #f4f4f5 0%, #a1a1aa 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Master AI and ship real projects in weeks
          </h2>

          <p className={`mt-5 max-w-md ${homeType.hook}`}>
            The best courses, a 24/7 AI tutor, and a community of builders — all powered by top-tier tools to level up your craft.
          </p>

          {/* Single primary CTA */}
          <Link
            to="/auth"
            className="group mt-8 inline-flex h-14 w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-[15px] font-bold text-primary-foreground shadow-[0_18px_44px_-14px_hsl(var(--primary)/0.7)] transition-transform active:scale-[0.98] hover:-translate-y-0.5"
          >
            Try it yourself
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/shop?type=courses"
            className="mt-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-white/55 transition-colors hover:text-white"
          >
            Browse courses →
          </Link>
        </div>

        {/* Partner tagline */}
        <p className="relative mt-14 text-center text-[15px] leading-relaxed text-white/45 sm:mt-16">
          Partnering with global industry leaders
          <br className="sm:hidden" /> to power your creativity
        </p>

        {/* Partner logo cards — horizontal scroll */}
        <div className="relative mt-6 -mx-6 sm:-mx-10">
          <div
            className="flex gap-3 overflow-x-auto px-6 pb-2 sm:px-10 [scrollbar-width:none]"
            style={{ scrollbarWidth: "none" }}
          >
            <style>{`.partner-scroll::-webkit-scrollbar{display:none}`}</style>
            {COLLABORATORS.map((c) => (
              <div
                key={c.name}
                title={c.name}
                aria-label={c.name}
                className="partner-scroll flex h-20 w-40 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
              >
                {c.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
