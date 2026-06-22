import { Link } from "react-router-dom";
import { homeType } from "@/components/home/typography";

/** Brand collaboration logos — simple inline SVGs to keep zero-dependency. */
const COLLABORATORS = [
  {
    name: "OpenAI",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-auto">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.515-4.902 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.985 5.985 0 0 0 .515 4.901 6.046 6.046 0 0 0 6.51 2.9 5.985 5.985 0 0 0 4.504 2.01 6.046 6.046 0 0 0 5.766-4.207 5.985 5.985 0 0 0 3.998-2.9 6.046 6.046 0 0 0-.743-7.097zM13.255 22.61a4.482 4.482 0 0 1-2.879-1.04l.142-.08 4.778-2.758a.78.78 0 0 0 .393-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.492 4.493zM3.6 18.49a4.482 4.482 0 0 1-.535-3.014l.142.085 4.782 2.758a.778.778 0 0 0 .787 0l5.838-3.37v2.333a.072.072 0 0 1-.029.062L9.756 20.14a4.504 4.504 0 0 1-6.156-1.65zM2.34 8.103A4.482 4.482 0 0 1 4.681 6.13v5.683a.78.78 0 0 0 .394.68l5.808 3.355-2.02 1.168a.072.072 0 0 1-.067 0L3.96 14.234a4.504 4.504 0 0 1-1.62-6.131zm16.59 3.853L13.099 8.6 15.115 7.43a.072.072 0 0 1 .067 0l4.835 2.793a4.494 4.494 0 0 1-.673 8.105v-5.683a.79.79 0 0 0-.414-.689zm2.01-3.024l-.141-.085-4.774-2.776a.78.78 0 0 0-.788 0L9.4 9.444V7.1a.072.072 0 0 1 .029-.062l4.835-2.787a4.5 4.5 0 0 1 6.677 4.658zM8.3 13.05l-2.02-1.164a.07.07 0 0 1-.038-.057V6.241a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.78.78 0 0 0-.394.68zm1.097-2.366 2.601-1.5 2.602 1.5v3l-2.602 1.5-2.601-1.5z" />
      </svg>
    ),
  },
  {
    name: "Anthropic",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-auto">
        <path d="M14.504 4h-3.008L5 20h3.176l1.298-3.35h5.052L15.824 20H19L14.504 4zm-4.04 9.954L12 9.66l1.536 4.295h-3.072z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-auto">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    name: "Notion",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-auto">
        <path d="M4.46 4.21c.51.33.84.43 1.57.43.92 0 1.14-.13 2.41-1C9.65 2.85 11.2 2 12.91 2c1.47 0 2.23.33 3.18.9l5.24 3.23c.5.27.7.36 1.12.36.51 0 .62-.14.95-.46v11.43c0 .92-.54 1.41-1.44 1.41-.33 0-.57-.05-.95-.27l-4.5-2.8c-.41-.24-.6-.32-1-.32-.4 0-.6.08-.98.32l-4.53 2.83c-.43.27-.65.35-1.03.35-.9 0-1.41-.51-1.41-1.41V6.25c0-.92.54-1.41 1.41-1.41.33 0 .57.08.95.3l3.53 2.2v5.37l-3.53-2.23V4.21z" />
      </svg>
    ),
  },
  {
    name: "Figma",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-auto">
        <path d="M8 24c2.21 0 4-1.79 4-4v-4H8a4 4 0 0 0 0 8zM4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zM4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4zM12 0h4a4 4 0 0 1 0 8h-4zM20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
      </svg>
    ),
  },
  {
    name: "VS Code",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-auto">
        <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
      </svg>
    ),
  },
];

export function HomeCtaPanel() {
  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[20px] border border-white/10 bg-[#0a0a0a] p-8 sm:p-12">
        {/* Indigo corner glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
        />
        {/* Bottom accent line */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[2px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
        />

        <div className="relative flex flex-col items-center text-center">
          <span className={homeType.eyebrow}>Start today</span>

          <h2 className={`mt-4 ${homeType.sectionTitle} text-white`}>
            Learn AI the way the best builders do.
          </h2>

          <p className={`mt-4 max-w-md ${homeType.hook}`}>
            Courses, a 24/7 AI tutor, and a community of learners — all in one place. No fluff. No subscriptions you forget.
          </p>

          {/* Brand collaboration ribbon */}
          <div className="mt-8 flex w-full flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
              In collaboration with
            </span>
            <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-4 text-white/55">
              {COLLABORATORS.map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  aria-label={c.name}
                  className="grayscale transition-all duration-300 hover:text-white hover:grayscale-0"
                >
                  {c.svg}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs — stacked, centered */}
          <div className="mt-9 flex w-full max-w-xs flex-col gap-3">
            <Link
              to="/auth"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-[13px] font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.6)] transition-transform active:scale-[0.98] hover:opacity-95"
            >
              Create free account
            </Link>
            <Link
              to="/shop?type=courses"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 px-6 text-[13px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
