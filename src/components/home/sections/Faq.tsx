import { HelpCircle } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";

const FAQS = [
  { q: "Need prior experience?", a: "No — most courses start from zero." },
  { q: "Is the AI tutor free?", a: "Daily free messages + welcome coins." },
  { q: "bKash / Nagad?", a: "Yes — plus COD on physical books." },
  { q: "Certificates?", a: "Yes, for every paid course." },
];

export function Faq({ title = "Common questions" }: { title?: string }) {
  return (
    <Reveal as="section" className="section-x">
      <SectionHeader title={title} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
        {FAQS.map((f) => (
          <div key={f.q} className="rounded-2xl border border-border/50 glass p-3.5 transition-colors hover:border-primary/30">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[13px] leading-tight">{f.q}</p>
                <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{f.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
