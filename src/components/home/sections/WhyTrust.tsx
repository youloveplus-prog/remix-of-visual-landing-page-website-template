import { ShieldCheck, Users, Headphones, Rocket } from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";
import { TONES, TONE_CYCLE, panelClass, headlineClass, subheadClass } from "@/components/home/_panel";

const POINTS = [
  { icon: ShieldCheck, title: "Verified content", text: "Reviewed by experts." },
  { icon: Users, title: "10K+ learners", text: "Active across BD." },
  { icon: Headphones, title: "24/7 AI tutor", text: "Your language." },
  { icon: Rocket, title: "Job-ready", text: "Real-world projects." },
];

export function WhyTrust({ title = "Why learners trust us" }: { title?: string }) {
  return (
    <Reveal as="section" className="section-x">
      <div className={panelClass}>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className={headlineClass}>{title}</h2>
          <p className={subheadClass}>Built on trust — every learner, every step.</p>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-1.5 sm:mt-10 sm:grid-cols-4 sm:gap-4">
          {POINTS.map((p, i) => {
            const Icon = p.icon;
            const t = TONES[TONE_CYCLE[i % 3]];
            return (
              <div
                key={p.title}
                className={`relative flex h-full min-h-[120px] flex-col overflow-hidden rounded-[14px] p-2.5 shadow-[0_18px_50px_-25px_rgba(0,0,0,0.45)] sm:min-h-[180px] sm:rounded-[26px] sm:p-5 ${t.card}`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-11 sm:w-11 ${
                  TONE_CYCLE[i % 3] === "gray" ? "bg-black/10" : "bg-white/15"
                }`}>
                  <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                </div>
                <p className={`mt-2 font-grotesk text-[11px] font-bold leading-tight tracking-tight sm:mt-4 sm:text-[16px] ${t.title}`}>
                  {p.title}
                </p>
                <p className={`mt-0.5 text-[9px] leading-snug sm:mt-1 sm:text-[12px] ${t.sub}`}>
                  {p.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
