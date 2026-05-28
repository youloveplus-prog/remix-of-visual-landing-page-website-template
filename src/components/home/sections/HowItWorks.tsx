import { Compass, Target, Trophy } from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";
import { TONES, TONE_CYCLE, panelClass, chipClass, headlineClass, subheadClass } from "@/components/home/_panel";

const STEPS = [
  { icon: Compass, title: "Discover", text: "Courses, books & prompts for your level." },
  { icon: Target, title: "Practice", text: "Learn with the 24/7 AI tutor." },
  { icon: Trophy, title: "Achieve", text: "Earn XP, badges, ship projects." },
];

export function HowItWorks({ title = "How it works" }: { title?: string }) {
  return (
    <Reveal as="section" className="section-x">
      <div className={panelClass}>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className={headlineClass}>{title}</h2>
          <p className={subheadClass}>Three simple steps to start learning today.</p>
        </div>

        <div className="relative mt-6 grid grid-cols-3 gap-1.5 sm:mt-10 sm:gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const t = TONES[TONE_CYCLE[i % 3]];
            return (
              <div
                key={step.title}
                className={`relative flex h-full min-h-[150px] flex-col overflow-hidden rounded-[14px] p-2 shadow-[0_18px_50px_-25px_rgba(0,0,0,0.45)] sm:min-h-[220px] sm:rounded-[26px] sm:p-5 ${t.card}`}
              >
                <span className={`inline-flex w-fit items-center gap-0.5 rounded-full px-1 py-px text-[7px] font-medium sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px] ${t.chip}`}>
                  <span className="h-1 w-1 rounded-full bg-black/70 sm:h-2 sm:w-2" />
                  Step {i + 1}
                </span>
                <h3 className={`mt-1 font-grotesk text-[11px] font-bold leading-[1.05] tracking-tight sm:mt-3 sm:text-[22px] ${t.title}`}>
                  {step.title}
                </h3>
                <p className={`mt-0.5 line-clamp-3 text-[8.5px] leading-snug sm:mt-1.5 sm:line-clamp-none sm:text-[13px] ${t.sub}`}>
                  {step.text}
                </p>
                <div className="mt-auto flex justify-end pt-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
                    TONE_CYCLE[i % 3] === "gray" ? "bg-black/10" : "bg-white/15"
                  }`}>
                    <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
