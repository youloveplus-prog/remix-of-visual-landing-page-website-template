import { MissionVision } from "@/components/about/MissionVision";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";
import { EDITORIAL_DELAY } from "./motion";

const toc = [
  { n: "01", label: "Cover", anchor: "#cover" },
  { n: "02", label: "Index", anchor: "#issue-index" },
  { n: "03", label: "Trust", anchor: "#trust" },
  { n: "04", label: "Feature", anchor: "#feature-story" },
  { n: "05", label: "Departments", anchor: "#departments" },
  { n: "06", label: "Back Matter", anchor: "#back-matter" },
];

export function IssueIndex() {
  return (
    <Spread label="Index">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 sm:gap-12 lg:gap-20">
        <Reveal>
          <div>
            <p className="editorial-eyebrow mb-3">In this issue</p>
            <h2 className="editorial-headline mb-5 sm:mb-6">Why ASIKON.</h2>
            <MissionVision variant="compact" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <nav aria-label="Contents" className="lg:pl-8 lg:border-l lg:border-foreground/10">
            <p className="editorial-eyebrow mb-4 sm:mb-5">Contents</p>
            <ul className="space-y-2 sm:space-y-2.5">
              {toc.map((item, i) => (
                <Reveal key={item.n} as="li" staggerIndex={i} staggerStep={EDITORIAL_DELAY.tocStep}>
                  <a
                    href={item.anchor}
                    className="group flex items-baseline gap-4 py-1 transition-colors hover:text-primary"
                  >
                    <span className="editorial-pagenum w-6">{item.n}</span>
                    <span className="editorial-subhead font-medium flex-1">
                      {item.label}
                    </span>
                    <span className="editorial-rule flex-1 max-w-[3rem] sm:max-w-[5rem]" />
                  </a>
                </Reveal>
              ))}
            </ul>
          </nav>
        </Reveal>
      </div>
    </Spread>
  );
}
