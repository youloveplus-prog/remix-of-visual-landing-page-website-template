import { MissionVision } from "@/components/about/MissionVision";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";

export function IssueIndex() {
  return (
    <Spread>
      <Reveal>
        <div className="w-full max-w-[420px] sm:max-w-[560px] mx-auto relative px-4 sm:px-0">
          {/* Soft indigo glow */}
          <div
            aria-hidden
            className="absolute -top-4 -right-4 w-28 h-28 bg-primary/5 rounded-full blur-2xl pointer-events-none"
          />

          <div className="relative bg-card border border-primary/10 rounded-[20px] p-6 sm:p-8 lg:p-9 shadow-[0_8px_30px_rgb(59,79,224,0.04)] overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-primary" />

            <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
              {/* Mono label */}
              <div className="inline-flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-primary bg-primary/5 px-2 py-1 rounded-sm">
                  Mission 01
                </span>
              </div>

              {/* Headline */}
              <h2 className="font-display font-extrabold tracking-tighter leading-[0.9] text-primary text-[40px] sm:text-[48px] lg:text-[56px]">
                Why
                <br />
                ASIKON.
              </h2>

              {/* Separator */}
              <div className="w-10 sm:w-12 h-px bg-primary/20" />

              {/* Promise copy */}
              <div className="space-y-3 sm:space-y-4">
                <MissionVision variant="compact" />

                <div className="flex items-center gap-2.5 sm:gap-3 pt-3 sm:pt-4 border-t border-border">
                  <span className="relative flex h-2.5 w-2.5 sm:h-2 sm:w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-2 sm:w-2 bg-primary" />
                  </span>
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-muted-foreground">
                    Core Identity · v2.4
                  </span>
                </div>
              </div>
            </div>

            {/* Corner graphic */}
            <div
              aria-hidden
              className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 opacity-[0.04] pointer-events-none"
            >
              <svg width="100" height="100" className="sm:w-[120px] sm:h-[120px]" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-primary" />
                <path d="M50 10V90M10 50H90" stroke="currentColor" strokeWidth="8" className="text-primary" />
              </svg>
            </div>
          </div>
        </div>
      </Reveal>
    </Spread>
  );
}
