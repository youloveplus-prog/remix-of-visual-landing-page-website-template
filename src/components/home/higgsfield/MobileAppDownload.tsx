import { Apple, Smartphone, QrCode, Star } from "lucide-react";

type StoreLink = {
  href: string;
  label: string;
  caption: string;
  Icon: typeof Apple;
};

const STORES: StoreLink[] = [
  {
    href: "#", // TODO: replace with App Store URL
    label: "App Store",
    caption: "Download on the",
    Icon: Apple,
  },
  {
    href: "#", // TODO: replace with Google Play URL
    label: "Google Play",
    caption: "Get it on",
    Icon: Smartphone,
  },
];

/**
 * Promotes the native mobile app on the home page.
 * Matches the rest of the home rails via `.hf-section` + `.hf-section-depth`
 * and uses the standard minimal title token.
 */
export function MobileAppDownload() {
  return (
    <section
      aria-label="Download the ASIKON mobile app"
      className="hf-section hf-section-depth relative w-full bg-black"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="hf-card-depth relative overflow-hidden border border-white/10 bg-neutral-950">
          {/* Indigo wash */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(120% 80% at 0% 0%, hsl(233 72% 28% / 0.55) 0%, transparent 55%), radial-gradient(80% 60% at 100% 100%, hsl(233 72% 45% / 0.35) 0%, transparent 60%)",
            }}
          />
          {/* Soft grain dots */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
            }}
          />

          <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:p-14">
            {/* Copy */}
            <div className="min-w-0">
              <p className="mb-2 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--hf-accent))]">
                Mobile app · iOS & Android
              </p>
              <h2 className="hf-title font-display">
                Take ASIKON with you. Learn, shop and chat on the go.
              </h2>
              <p className="mt-2 max-w-xl text-sm sm:text-[15px] text-white/60">
                Stream courses offline, get instant order updates and join live
                mentor sessions — all from one fast native app.
              </p>

              {/* Store buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {STORES.map(({ href, label, caption, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hf-card-depth-subtle group inline-flex items-center gap-3 border border-white/15 bg-white/[0.06] px-4 py-3 text-white transition hover:border-white/40 hover:bg-white/[0.1]"
                  >
                    <Icon className="h-7 w-7 shrink-0" strokeWidth={1.5} />
                    <span className="flex flex-col leading-none">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                        {caption}
                      </span>
                      <span className="mt-1 font-display text-base font-semibold">
                        {label}
                      </span>
                    </span>
                  </a>
                ))}
              </div>

              {/* Rating row */}
              <div className="mt-5 flex items-center gap-3 text-white/65">
                <div className="flex items-center gap-0.5 text-[hsl(var(--hf-accent))]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                  4.9 · 12k+ ratings
                </span>
              </div>
            </div>

            {/* QR + phone glyph (desktop only) */}
            <div className="hidden lg:flex items-center justify-end">
              <div className="hf-card-depth-subtle flex items-center gap-5 border border-white/12 bg-black/40 p-5">
                <div className="grid h-28 w-28 place-items-center border border-white/15 bg-white text-neutral-900">
                  <QrCode className="h-20 w-20" strokeWidth={1.25} />
                </div>
                <div className="max-w-[180px]">
                  <p className="font-display text-sm font-semibold text-white">
                    Scan to install
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    Point your phone camera at the code to open the right store
                    for your device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
