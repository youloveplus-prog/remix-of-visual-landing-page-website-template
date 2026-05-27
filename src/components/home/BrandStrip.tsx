const BRANDS = [
  { name: "OpenAI", style: "font-display font-extrabold tracking-tight" },
  { name: "Google", style: "font-display font-black tracking-wider" },
  { name: "Microsoft", style: "font-display font-bold tracking-tight" },
  { name: "NVIDIA", style: "font-display font-extrabold tracking-[0.12em]" },
  { name: "Amazon", style: "font-display font-bold tracking-tight" },
  { name: "Meta", style: "italic font-semibold tracking-wide" },
  { name: "Apple", style: "font-display font-light tracking-tight" },
  { name: "Samsung", style: "font-display font-bold tracking-[0.15em]" },
  { name: "Adobe", style: "font-display font-extrabold tracking-tight" },
  { name: "Intel", style: "font-display font-bold tracking-[0.18em]" },
];

export function BrandStrip() {
  // Duplicate for seamless marquee loop
  const row = [...BRANDS, ...BRANDS];

  return (
    <section className="section-x" aria-label="Featured brands">
      <div className="relative overflow-hidden py-6 lg:py-8">
        {/* Edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 lg:w-24 z-10 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-24 z-10 bg-gradient-to-l from-background to-transparent"
        />

        <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-10 lg:gap-16">
          {row.map((b, i) => (
            <span
              key={`${b.name}-${i}`}
              className={`shrink-0 text-foreground/70 hover:text-foreground transition-colors text-xl lg:text-2xl xl:text-3xl whitespace-nowrap ${b.style}`}
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
