const steps = [
  { n: "01", t: "Tell us your goal", d: "Three minutes of onboarding shapes your personal path." },
  { n: "02", t: "Get a daily mission", d: "One small, focused lesson every day. No overwhelm." },
  { n: "03", t: "Learn, build, repeat", d: "Track your streak, ask the AI tutor, and grow week by week." },
];

export function AboutSteps() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 border-y border-border/40 bg-card/30">
      <div className="container-editorial">
        <div className="mb-10 lg:mb-14 max-w-2xl">
          <p className="eyebrow-bar mb-3">How ASIKON works</p>
          <h2 className="display-2">Three steps. That's the whole loop.</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 relative">
          {steps.map((s, i) => (
            <div key={s.n} className="glass-strong rounded-2xl p-6 sm:p-8 relative">
              <div
                className="font-display text-5xl sm:text-6xl font-semibold tracking-tight bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-primary)" }}
              >
                {s.n}
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight mt-4">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.d}</p>
              {i < steps.length - 1 && (
                <div
                  aria-hidden
                  className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px"
                  style={{ background: "var(--gradient-hairline)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
