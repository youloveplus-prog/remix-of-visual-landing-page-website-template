import { MissionVision } from "@/components/about/MissionVision";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";

export function IssueIndex() {
  return (
    <Spread>
      <Reveal>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold leading-[0.95] tracking-[-0.035em] text-[26px] sm:text-[34px] lg:text-[40px] text-brand-gradient mb-5 sm:mb-6">
            Why ASIKON.
          </h2>
          <MissionVision variant="compact" />
        </div>
      </Reveal>

    </Spread>
  );
}
