const PARTNERS = [
  "OPENAI",
  "GITHUB",
  "FIGMA",
  "VERCEL",
  "STRIPE",
  "NOTION",
  "LINEAR",
  "SUPABASE",
];

export function PartnerLogos() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10">
      <div className="mb-3 text-center text-[10px] uppercase tracking-[0.22em] text-white/35">
        Tools our learners build with
      </div>
      <div className="grid grid-cols-4 gap-px overflow-hidden rounded-[10px] border border-white/10 bg-white/5 sm:grid-cols-8">
        {PARTNERS.map((p) => (
          <div
            key={p}
            className="flex h-16 items-center justify-center bg-black text-[12px] font-bold tracking-[0.18em] text-white/30 transition-colors hover:text-white"
          >
            {p}
          </div>
        ))}
      </div>
    </section>
  );
}
