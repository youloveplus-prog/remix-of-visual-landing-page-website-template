import { MissionVision } from "@/components/about/MissionVision";
import { Spread } from "./Spread";
import { Reveal } from "@/components/transitions/Reveal";
import { EDITORIAL_DELAY } from "./motion";

const toc = [
  { n: "01", label: "Cover", anchor: "#cover" },
  { n: "02", label: "Issue Index", anchor: "#issue-index" },
  { n: "03", label: "Feature Story", anchor: "#feature-story" },
  { n: "04", label: "Departments", anchor: "#departments" },
  { n: "05", label: "Back Matter", anchor: "#back-matter" },
];

export function IssueIndex() {
  return (
    <Spread pageNumber="02 / 05" label="Issue Index">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-20">
        <Reveal>
          <div>
            <p className="editorial-eyebrow mb-3">In this issue</p>
            <h2 className="font-display font-bold text-3xl lg:text-5xl tracking-[-0.02em] leading-[1.05] mb-6">
              Why we exist.
            </h2>
            <MissionVision variant="compact" />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <nav aria-label="Contents" className="lg:pl-8 lg:border-l lg:border-foreground/10">
            <p className="editorial-eyebrow mb-5">Contents</p>
            <ul className="space-y-3">
              {toc.map((item, i) => (
                <Reveal key={item.n} as="li" staggerIndex={i} staggerStep={EDITORIAL_DELAY.tocStep}>
                  <a
                    href={item.anchor}
                    className="group flex items-baseline gap-4 py-1 transition-colors hover:text-primary"
                  >
                    <span className="editorial-pagenum">{item.n}</span>
                    <span className="font-display text-lg lg:text-xl font-medium flex-1">
                      {item.label}
                    </span>
                    <span className="editorial-rule flex-1 max-w-[6rem] opacity-60" />
                    <span className="editorial-eyebrow opacity-0 group-hover:opacity-100 transition-opacity">
                      Read →
                    </span>
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
