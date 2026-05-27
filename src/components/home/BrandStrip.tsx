const BRANDS = [
  { name: "ASIKON", style: "font-display font-extrabold tracking-tight" },
  { name: "TOZO", style: "font-display font-black tracking-wider" },
  { name: "HellBabies", style: "italic font-bold tracking-tight" },
  { name: "cocokind", style: "font-serif font-medium tracking-tight lowercase" },
  { name: "Oxyfresh", style: "font-serif font-semibold" },
  { name: "DOT & KEY", style: "font-display font-bold tracking-[0.15em]" },
  { name: "Skybags", style: "italic font-semibold" },
  { name: "Bellefit", style: "font-display font-extrabold" },
  { name: "AMAZING LACE", style: "font-display font-bold tracking-[0.18em]" },
  { name: "HEIRESS", style: "font-display font-bold tracking-[0.2em]" },
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
