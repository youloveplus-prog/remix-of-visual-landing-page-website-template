import { Star } from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";
import { TONES, TONE_CYCLE, panelClass, headlineClass, subheadClass } from "@/components/home/_panel";

const ITEMS = [
  { name: "Tanvir H.", role: "Python student", quote: "AI tutor explained recursion in Bangla — finally clicked." },
  { name: "Ayesha R.", role: "ML beginner", quote: "Landed my first freelance gig in 6 weeks." },
  { name: "Rakib M.", role: "Prompt engineer", quote: "Prompt library saves me hours every day." },
];

export function Testimonials({ title = "Loved by learners" }: { title?: string }) {
  return (
    <Reveal as="section" className="section-x">
      <div className={panelClass}>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className={headlineClass}>{title}</h2>
          <p className={subheadClass}>Real stories from learners across Bangladesh.</p>
        </div>

        <div className="relative mt-6 grid grid-cols-3 gap-1.5 sm:mt-10 sm:gap-4">
          {ITEMS.map((it, i) => {
            const t = TONES[TONE_CYCLE[i % 3]];
            return (
              <div
                key={it.name}
                className={`relative flex h-full min-h-[160px] flex-col overflow-hidden rounded-[14px] p-2.5 shadow-[0_18px_50px_-25px_rgba(0,0,0,0.45)] sm:min-h-[240px] sm:rounded-[26px] sm:p-5 ${t.card}`}
              >
                <span className={`inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-medium sm:px-2.5 sm:py-1 sm:text-[11px] ${t.chip}`}>
                  {it.role}
                </span>
                <div className="mt-1.5 flex gap-0.5 sm:mt-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`h-2 w-2 fill-current sm:h-3 sm:w-3 ${TONE_CYCLE[i % 3] === "gray" ? "text-primary" : "text-white"}`} />
                  ))}
                </div>
                <p className={`mt-1.5 flex-1 text-[9px] leading-snug sm:mt-3 sm:text-[13px] ${t.sub}`}>
                  "{it.quote}"
                </p>
                <p className={`mt-2 font-grotesk text-[10px] font-bold tracking-tight sm:mt-3 sm:text-[14px] ${t.title}`}>
                  {it.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}
