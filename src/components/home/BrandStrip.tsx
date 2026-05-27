const BRANDS = [
  "ASIKON", "OpenAI", "Google", "Microsoft", "NVIDIA", "Amazon",
  "Meta", "Apple", "Samsung", "Adobe", "Intel",
];

export function BrandStrip() {
  const row = [...BRANDS, ...BRANDS];

  return (
    <section className="section-x" aria-label="Featured brands">
      <div className="relative overflow-hidden border-y-2 border-black bg-[#f6f5f0] py-4 lg:py-6">
        <div className="brand-marquee flex w-max items-center gap-6 lg:gap-8">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="brand-item shrink-0 inline-flex items-center px-4 py-2 rounded-xl border-2 border-black bg-white font-grotesk font-black tracking-tight whitespace-nowrap text-base lg:text-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all hover:bg-primary hover:text-primary-foreground"
            >
              {name}
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
      `}</style>
    </section>
  );
}
