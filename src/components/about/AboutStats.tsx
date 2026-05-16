const stats = [
  { n: "10,420", l: "Active learners", c: "Across 64 districts" },
  { n: "182k", l: "Lessons completed", c: "And counting daily" },
  { n: "9.6", l: "Avg. day streak", c: "Calm, consistent learning" },
  { n: "1.2M", l: "AI conversations", c: "Personal guidance, on tap" },
];

export function AboutStats() {
  return (
    <section className="py-14 sm:py-20 lg:py-24 border-y border-border/40">
      <div className="container-editorial">
        <div className="mb-10 lg:mb-14 max-w-2xl">
          <p className="eyebrow-bar mb-3">Numbers that matter</p>
          <h2 className="display-2">Small wins, multiplied every day.</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s) => (
            <div key={s.l} className="glass-strong rounded-2xl p-5 sm:p-6 hover-lift relative overflow-hidden">
              <div
                aria-hidden
                className="absolute left-0 top-0 h-1 w-12 rounded-full"
                style={{ background: "var(--gradient-primary)" }}
              />
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
                {s.n}
              </div>
              <div className="mt-2 text-sm font-medium">{s.l}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.c}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
