import { MissionVision } from "@/components/about/MissionVision";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";

export function IssueIndex() {
  return (
    <Spread>
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="editorial-headline mb-5 sm:mb-6">Why ASIKON.</h2>
          <MissionVision variant="compact" />
        </div>
      </Reveal>
    </Spread>
  );
}
