import { Link } from "react-router-dom";
import { ArrowRight, Play, Star, Users, CheckSquare } from "lucide-react";
import courseAiMl from "@/assets/course-ai-ml.webp";

interface EduvoraHeroProps {
  variant?: "marketing" | "app";
}

export function EduvoraHero({ variant = "marketing" }: EduvoraHeroProps) {
  const ctaHref = variant === "marketing" ? "/auth" : "/shop";
  const ctaLabel = variant === "marketing" ? "Start learning" : "Explore courses";

  return (
    <section className="section-x pt-3 lg:pt-5">
      <div
        className="relative overflow-hidden rounded-3xl text-primary-foreground p-5 sm:p-8 lg:p-12"
        style={{ background: "var(--gradient-primary)" }}
      >
        {/* radial light accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 80% 20%, hsl(0 0% 100% / 0.18), transparent 60%)",
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center">
          {/* LEFT */}
          <div className="space-y-5 sm:space-y-6">
            <h1 className="font-display font-black uppercase tracking-tight leading-[0.95] text-[2rem] sm:text-5xl lg:text-6xl">
              Master AI with
              <br />
              practical{" "}
              <span className="inline-block border-2 border-primary-foreground/80 rounded-md px-3 py-0.5 mt-1">
                skills
              </span>
            </h1>

            <p className="text-sm sm:text-base text-primary-foreground/85 max-w-md leading-relaxed">
              Learn AI through simple, hands-on courses designed to help you build
              real-world skills — not just theory. Start quickly, progress
              confidently, apply immediately.
            </p>

            <div className="flex items-center gap-2">
              <Link
                to={ctaHref}
                aria-label={ctaLabel}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background pl-1.5 pr-5 py-1.5 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition"
              >
                <span className="grid place-items-center h-9 w-9 rounded-full bg-background text-foreground">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
                {ctaLabel}
              </Link>
            </div>

            {/* social proof row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-3 rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-3 py-1.5">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full ring-2 ring-primary bg-gradient-to-br from-amber-200 to-rose-300"
                      style={{ filter: `hue-rotate(${i * 40}deg)` }}
                    />
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="font-display font-bold text-sm">460+</p>
                  <p className="text-[10px] uppercase tracking-wider text-primary-foreground/75">
                    learners trained
                  </p>
                </div>
              </div>
              <Link
                to="/about"
                aria-label="Watch intro"
                className="grid place-items-center h-11 w-11 rounded-full bg-foreground text-background ring-2 ring-primary-foreground/40 hover:scale-105 transition"
              >
                <Play className="h-4 w-4 fill-current" />
              </Link>
            </div>
          </div>

          {/* RIGHT — image */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-50"
                style={{ background: "hsl(0 0% 100% / 0.18)" }}
              />
              <img
                src={courseAiMl}
                alt="Asikon courses"
                loading="eager"
                className="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* stat cards row */}
        <div className="relative mt-6 lg:mt-8 grid grid-cols-3 gap-2 sm:gap-3">
          <StatCard
            icon={<Star className="h-4 w-4" />}
            value="98%"
            label="success rate"
          />
          <StatCard
            icon={<Users className="h-4 w-4" />}
            value="100+"
            label="trusted partners"
            dark
          />
          <StatCard
            icon={<CheckSquare className="h-4 w-4" />}
            value="20+"
            label="active courses"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
  dark = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div
      className={
        dark
          ? "rounded-2xl bg-foreground text-background p-3 sm:p-4 flex flex-col gap-2"
          : "rounded-2xl bg-card text-card-foreground p-3 sm:p-4 flex flex-col gap-2"
      }
    >
      <div
        className={
          "grid place-items-center h-7 w-7 sm:h-8 sm:w-8 rounded-full " +
          (dark
            ? "bg-background/10 text-background"
            : "bg-foreground text-background")
        }
      >
        {icon}
      </div>
      <div className="leading-tight">
        <p className="font-display font-bold text-base sm:text-lg">{value}</p>
        <p
          className={
            "text-[10px] sm:text-xs " +
            (dark ? "text-background/70" : "text-muted-foreground")
          }
        >
          {label}
        </p>
      </div>
    </div>
  );
}
