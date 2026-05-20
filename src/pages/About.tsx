import { AppLayout } from "@/components/layout/AppLayout";
import { MissionVision } from "@/components/about/MissionVision";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutSteps } from "@/components/about/AboutSteps";
import { AboutCTA } from "@/components/about/AboutCTA";
import { Reveal } from "@/components/transitions/Reveal";
import { HowItWorks } from "@/components/home/sections/HowItWorks";
import { WhyTrust } from "@/components/home/sections/WhyTrust";
import { Testimonials } from "@/components/home/sections/Testimonials";
import { Faq } from "@/components/home/sections/Faq";
import { FinalCta } from "@/components/home/sections/FinalCta";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = "About ASIKON — AI-powered learning for Bangladesh";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "ASIKON is an AI-powered learning platform built to make education simple, smart, and accessible for every Bangladeshi student.",
    );
    return () => {
      document.title = prev;
      if (meta && prevDesc) meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <AppLayout>
      <Reveal as="div"><AboutHero /></Reveal>

      <Reveal as="section" className="py-16 sm:py-20 lg:py-24">
        <div className="container-editorial">
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow-bar mb-3">What drives us</p>
            <h2 className="display-2">Mission &amp; Vision.</h2>
          </div>
          <MissionVision />
        </div>
      </Reveal>

      <Reveal as="section" className="py-16 sm:py-20 lg:py-28 border-y border-border/40 bg-card/30">
        <div className="container-editorial grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow-bar mb-3">Our story</p>
            <h2 className="display-2 mb-6">From a classroom in Dhaka to learners everywhere.</h2>
            <div className="space-y-5 body-lg text-muted-foreground">
              <p>
                ASIKON started with a simple frustration: brilliant Bangladeshi students
                were being asked to learn in systems built for someone else, somewhere else.
              </p>
              <p>
                We believed the answer wasn't more content — it was the right content,
                in the right size, at the right time. So we built an AI tutor that listens,
                a daily mission that respects your time, and a community that cheers you on.
              </p>
              <p>
                Today ASIKON is a complete learning universe — calm, smart, and unmistakably
                made for you.
              </p>
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="glass-strong rounded-2xl p-7 lg:sticky lg:top-24">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Founded</p>
              <p className="font-display text-3xl font-semibold mt-1">2024</p>
              <div className="my-5 h-px" style={{ background: "var(--gradient-hairline)" }} />
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Based in</p>
              <p className="font-display text-3xl font-semibold mt-1">Dhaka, Bangladesh</p>
              <div className="my-5 h-px" style={{ background: "var(--gradient-hairline)" }} />
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Built for</p>
              <p className="font-display text-3xl font-semibold mt-1">Every learner.</p>
              <p className="text-sm text-muted-foreground mt-4 italic">
                "Education should feel like a guide walking beside you — not a wall in front of you."
              </p>
            </div>
          </aside>
        </div>
      </Reveal>

      <Reveal as="div"><AboutStats /></Reveal>
      <Reveal as="div"><AboutValues /></Reveal>
      <Reveal as="div"><AboutSteps /></Reveal>

      <Reveal as="section" className="py-16 sm:py-20 lg:py-24">
        <div className="container-editorial text-center max-w-3xl mx-auto">
          <p className="eyebrow-bar mb-3 justify-center inline-flex">Made in Bangladesh</p>
          <h2 className="display-2">A small team. A big belief.</h2>
          <p className="body-lg mt-5 text-muted-foreground">
            ASIKON is built by a tight team of educators, designers, and engineers in Dhaka —
            for learners across Bangladesh and the world.
          </p>
          <div className="mt-8 flex justify-center -space-x-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border-2 border-background"
                style={{ background: "var(--gradient-primary)", opacity: 0.6 + i * 0.07 }}
              />
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="div"><AboutCTA /></Reveal>
    </AppLayout>
  );
};

export default About;
