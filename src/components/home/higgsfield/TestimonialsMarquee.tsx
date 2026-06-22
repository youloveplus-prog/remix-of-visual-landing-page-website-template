import { Star, BadgeCheck } from "lucide-react";

const REVIEWS = [
  { name: "Rifat A.", quote: "The AI tutor finally made calculus click for me.", img: 11 },
  { name: "Nusrat J.", quote: "Spent 2 weeks on the Python track and built my first app.", img: 32 },
  { name: "Imran S.", quote: "My daughter loves her mentor — best money we've spent.", img: 12 },
  { name: "Sumaiya K.", quote: "Prompts library is gold. Use it every single day.", img: 25 },
  { name: "Tareq M.", quote: "Earning coins makes practice feel like a game.", img: 17 },
  { name: "Lubna H.", quote: "Community reviews helped me pick the right course.", img: 41 },
];

function Card({ name, quote, img }: { name: string; quote: string; img: number }) {
  return (
    <div className="flex w-[320px] shrink-0 flex-col gap-3 rounded-[10px] border border-white/10 bg-neutral-950 p-4">
      <div className="flex items-center gap-1 text-[hsl(var(--hf-accent))]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current" />
        ))}
      </div>
      <p className="text-[13px] leading-relaxed text-white/80">"{quote}"</p>
      <div className="mt-auto flex items-center gap-2">
        <img
          src={`https://i.pravatar.cc/64?img=${img}`}
          alt=""
          className="h-7 w-7 rounded-full object-cover"
        />
        <span className="text-[12px] font-medium text-white">{name}</span>
        <BadgeCheck className="h-3.5 w-3.5 text-[hsl(var(--hf-accent))]" aria-label="Verified buyer" />
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  const row = [...REVIEWS, ...REVIEWS];
  return (
    <section className="hf-section">
      <div className="mb-3 flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="hf-title font-display text-white">
          Learners love it
        </h2>
        <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          Verified buyers
        </span>
      </div>
      <div className="hf-marquee-mask space-y-3">
        <div className="flex gap-3 px-4 sm:px-6 lg:px-8 motion-safe:animate-[hf-marquee_40s_linear_infinite]">
          {row.map((r, i) => <Card key={`a-${i}`} {...r} />)}
        </div>
        <div className="flex gap-3 px-4 sm:px-6 lg:px-8 motion-safe:animate-[hf-marquee_55s_linear_infinite_reverse]">
          {row.map((r, i) => <Card key={`b-${i}`} {...r} />)}
        </div>
      </div>
    </section>
  );
}
