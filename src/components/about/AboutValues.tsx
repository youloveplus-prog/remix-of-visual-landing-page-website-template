import { Sparkles, Heart, Compass, Languages, GraduationCap, Wrench } from "lucide-react";

const values = [
  { icon: Sparkles, t: "Small daily wins beat big bursts.", d: "Five focused minutes today outpaces a six-hour cram next week." },
  { icon: Heart, t: "AI should teach, not replace teachers.", d: "Our AI is a patient tutor — guiding, never substituting human care." },
  { icon: Compass, t: "Learning must feel calm.", d: "No streak-shaming, no anxiety. Progress, not pressure." },
  { icon: GraduationCap, t: "Every learner deserves a guide.", d: "Personalized missions for absolute beginners and advanced builders alike." },
  { icon: Languages, t: "Mother-tongue first.", d: "Bangla-aware explanations so nothing gets lost in translation." },
  { icon: Wrench, t: "Skills over certificates.", d: "We measure progress in what you can build, not paper on the wall." },
];

export function AboutValues() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <div className="container-editorial">
        <div className="mb-10 lg:mb-14 max-w-2xl">
          <p className="eyebrow-bar mb-3">What we believe</p>
          <h2 className="display-2">Six principles that shape every screen.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {values.map(({ icon: Icon, t, d }) => (
            <article key={t} className="glass rounded-2xl p-6 hover-lift group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight">{t}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
