const BRANDS = [
  { name: "ASIKON", style: "font-display font-black tracking-tight", color: "#E11D2E" },
  { name: "OpenAI", style: "font-display font-extrabold tracking-tight", color: "#10A37F" },
  { name: "Google", style: "font-display font-black tracking-wider", color: "#4285F4" },
  { name: "Microsoft", style: "font-display font-bold tracking-tight", color: "#00A4EF" },
  { name: "NVIDIA", style: "font-display font-extrabold tracking-[0.12em]", color: "#76B900" },
  { name: "Amazon", style: "font-display font-bold tracking-tight", color: "#FF9900" },
  { name: "Meta", style: "italic font-semibold tracking-wide", color: "#0866FF" },
  { name: "Apple", style: "font-display font-light tracking-tight", color: "#A2AAAD" },
  { name: "Samsung", style: "font-display font-bold tracking-[0.15em]", color: "#1428A0" },
  { name: "Adobe", style: "font-display font-extrabold tracking-tight", color: "#FF0000" },
  { name: "Intel", style: "font-display font-bold tracking-[0.18em]", color: "#0071C5" },
];

export function BrandStrip() {
  const row = [...BRANDS, ...BRANDS];

  return (
    <section className="section-x" aria-label="Featured brands">
      <div className="relative overflow-hidden py-6 lg:py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-16 lg:w-24 z-10 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-24 z-10 bg-gradient-to-l from-background to-transparent"
        />

        <div className="brand-marquee flex w-max gap-10 lg:gap-16">
          {row.map((b, i) => (
            <span
              key={`${b.name}-${i}`}
              style={{ ["--brand-color" as string]: b.color }}
              className={`brand-item shrink-0 text-foreground transition-colors duration-300 text-xl lg:text-2xl xl:text-3xl whitespace-nowrap cursor-pointer ${b.style}`}
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
        .brand-marquee {
          animation: marquee 40s linear infinite;
        }
        .brand-marquee:has(.brand-item:hover) {
          animation-play-state: paused;
        }
        .brand-item:hover {
          color: var(--brand-color);
        }
      `}</style>
    </section>
  );
}
