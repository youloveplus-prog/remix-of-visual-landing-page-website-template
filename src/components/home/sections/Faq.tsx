import { HelpCircle } from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";
import { panelClass, headlineClass, subheadClass } from "@/components/home/_panel";

const FAQS = [
  { q: "Need prior experience?", a: "No — most courses start from zero." },
  { q: "Is the AI tutor free?", a: "Daily free messages + welcome coins." },
  { q: "Payment options?", a: "Card and bKash. All products are digital — instant access." },
  { q: "Certificates?", a: "Yes, for every paid course." },
];

export function Faq({ title = "Common questions" }: { title?: string }) {
  return (
    <Reveal as="section" className="section-x">
      <div className={panelClass}>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className={headlineClass}>{title}</h2>
          <p className={subheadClass}>Answers to what learners ask most.</p>
        </div>

        <div className="relative mt-6 grid grid-cols-1 gap-2 sm:mt-10 sm:grid-cols-2 sm:gap-3">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="surface-panel-soft rounded-[16px] p-3 transition-colors hover:border-primary/40 sm:rounded-[20px] sm:p-4"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:h-9 sm:w-9">
                  <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-grotesk text-[13px] font-bold leading-tight tracking-tight text-panel-fg sm:text-[15px]">
                    {f.q}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-panel-muted sm:text-[13px]">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
