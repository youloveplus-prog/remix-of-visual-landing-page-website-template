import { Link } from "react-router-dom";

export function HomeCtaPanel() {
  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[12px] border border-white/10 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-10 sm:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[hsl(var(--hf-accent))]/20 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--hf-accent))]">
            Start today
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight leading-[1.08] text-white">
            Learn AI the way the best builders do.
          </h2>
          <p className="mt-4 max-w-lg text-[15px] text-white/60">
            Courses, a 24/7 AI tutor, and a community of learners — all in one place. No fluff. No subscriptions you forget.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="inline-flex h-11 items-center rounded-md bg-[hsl(var(--hf-accent))] px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white hover:opacity-90"
            >
              Create free account
            </Link>
            <Link
              to="/shop?type=courses"
              className="inline-flex h-11 items-center rounded-md border border-white/15 px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white hover:border-white/40"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
