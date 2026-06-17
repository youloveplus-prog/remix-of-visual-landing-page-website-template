import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  MessageSquare,
  Bot,
  Trophy,
  Heart,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/transitions/Reveal";
import logo from "@/assets/logo.png";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";
import { EduvoraHero } from "@/components/home/EduvoraHero";
import { PartnerMarquee } from "@/components/home/PartnerMarquee";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Why Asikon", href: "#why" },
  { label: "Steps", href: "#steps" },
  { label: "Stories", href: "#stories" },
  { label: "Pricing", href: "#pricing" },
];

const floatingChips = [
  { label: "Student", className: "left-[6%] top-[18%]" },
  { label: "Parent", className: "right-[8%] top-[14%]" },
  { label: "Mentor", className: "left-[4%] top-[44%]" },
  { label: "Creator", className: "right-[5%] top-[48%]" },
];

const partners = ["IPSUM", "Logoipsum", "ASIKON", "EduPro"];

const features = [
  {
    title: "Expert-Led Courses",
    desc: "Learn AI, Python, and modern skills through structured, project-based tracks.",
    icon: GraduationCap,
  },
  {
    title: "24/7 AI tutor",
    desc: "Ask questions any time in Bangla or English and get patient, step-by-step answers.",
    icon: Bot,
  },
  {
    title: "Curated Book Shop",
    desc: "Hand-picked books, prompt packs, and learning kits delivered across Bangladesh.",
    icon: BookOpen,
  },
  {
    title: "1-on-1 Mentorship",
    desc: "Match your child with a personal tutor through our vetted mentor program.",
    icon: Users,
  },
  {
    title: "Trusted Community",
    desc: "Real reviews from verified buyers and active learners — no fake hype.",
    icon: MessageSquare,
  },
  {
    title: "Rewards & Streaks",
    desc: "Earn coins, climb the leaderboard, and unlock perks as you keep learning.",
    icon: Trophy,
  },
];

const stats = [
  { value: "40%", label: "Faster skill progress with guided AI tutoring." },
  { value: "3×", label: "Higher course completion vs. self-study alone." },
  { value: "100%", label: "Verified buyer reviews — no paid placements." },
  { value: "10k+", label: "Active learners, parents, and mentors growing together." },
];

const steps = [
  {
    n: "01",
    title: "Create your free account",
    desc: "Sign up in seconds with email OTP. Get 100 welcome coins instantly.",
  },
  {
    n: "02",
    title: "Pick a track or shop a book",
    desc: "Browse AI courses, books, and prompts curated for Bangladeshi learners.",
  },
  {
    n: "03",
    title: "Learn, earn, and grow",
    desc: "Chat with the AI tutor, hit your streak, and book a mentor when you're ready.",
  },
];

const stories = [
  {
    quote:
      "Asikon made AI feel approachable. My daughter is now building her own small projects.",
    name: "Nusrat R.",
    role: "Parent, Dhaka",
  },
  {
    quote:
      "The AI tutor answers in Bangla. That alone changed how my students learn after class.",
    name: "Tanvir A.",
    role: "Mentor, Chattogram",
  },
  {
    quote:
      "Honest reviews and real delivery. Books arrived in 2 days with cash on delivery.",
    name: "Mehedi H.",
    role: "Student, Sylhet",
  },
];

export default function Welcome() {
  return (
    <div className="min-h-dvh bg-background text-foreground antialiased">
      <SEO
        title="Asikon — Learn AI, the Bangladeshi Way"
        description="Asikon is an AI-powered learning platform for Bangladesh. Expert courses, a 24/7 Bangla AI tutor, curated books, and 1-on-1 mentorship."
        url="https://style-verse-suite.lovable.app/welcome"
      />

      {/* Top Nav */}
      <header className="sticky top-0 z-40 liquid-nav border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/welcome" className="flex items-center gap-2 focus-ring rounded-lg">
            <img src={logo} alt="Asikon" className="h-8 w-8 rounded-lg" />
            <span className="font-display font-bold text-lg tracking-tight">Asikon</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="rounded-full px-4 gradient-primary text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="mx-auto max-w-7xl w-full">
        <EduvoraHero variant="marketing" />
      </div>

      {/* Partner strip */}
      <PartnerMarquee />

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Unlock premium learning with
              <br />
              our advanced features.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything a learner, parent, or mentor needs — designed to scale with your goals.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 60}>
                  <div className="group h-full rounded-2xl border border-border liquid-glass p-6 hover:border-primary/40 hover:shadow-[var(--shadow-glow)] transition-all">
                    <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                      <Icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="mt-5 font-semibold text-lg">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why / Stats */}
      <section id="why" className="py-20 lg:py-28 bg-secondary/30 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Why learners choose Asikon
            </h2>
            <p className="mt-4 text-muted-foreground">
              Trusted by families across Bangladesh to learn smarter, safer, and faster.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <Reveal key={s.value} delay={i * 70}>
                <div className="rounded-2xl border border-border liquid-glass p-6 h-full">
                  <div className="flex items-start justify-between">
                    <p className="font-display font-bold text-4xl lg:text-5xl tracking-tight">{s.value}</p>
                    <span className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 grid place-items-center">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </span>
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Get started in just 3 easy steps
            </h2>
            <p className="mt-4 text-muted-foreground">
              A guided onboarding designed for speed and simplicity.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
            <Reveal>
              <div className="rounded-2xl overflow-hidden border border-border shadow-xl liquid-glass">
                <img src={courseAiMl} alt="Asikon dashboard preview" className="w-full aspect-[4/3] object-cover" />
              </div>
            </Reveal>
            <div className="space-y-4">
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="rounded-2xl border border-border liquid-glass p-5 flex gap-4 items-start hover:border-primary/40 transition-colors">
                    <span className="h-10 w-10 shrink-0 rounded-full gradient-primary text-primary-foreground grid place-items-center text-sm font-bold">
                      {s.n}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg">{s.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success stories */}
      <section id="stories" className="py-20 lg:py-28 bg-secondary/30 border-y border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight">
              Real results, real impact.
              <br />Our success stories.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Real-world stories from learners, parents, and mentors growing with Asikon.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {stories.map((s, i) => (
              <Reveal key={s.name} delay={i * 80}>
                <figure className="h-full rounded-2xl border border-border liquid-glass p-6 flex flex-col">
                  <div className="flex items-center gap-0.5 text-primary">
                    {[0, 1, 2, 3, 4].map((k) => (
                      <Star key={k} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-sm leading-relaxed flex-1">
                    "{s.quote}"
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <span className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 grid place-items-center font-semibold text-primary">
                      {s.name[0]}
                    </span>
                    <span>
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.role}</p>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-3xl border border-primary/30 p-10 lg:p-14 text-center"
              style={{ background: "var(--gradient-primary-soft)" }}
            >
              <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "var(--gradient-primary)" }} />
              <ShieldCheck className="mx-auto h-10 w-10 text-primary-foreground" />
              <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-primary-foreground tracking-tight">
                Start learning with Asikon today.
              </h2>
              <p className="mt-3 text-primary-foreground/90 max-w-xl mx-auto">
                Free to join. 100 welcome coins. Cancel anytime. Cash on delivery on books.
              </p>
              <div className="mt-7 flex items-center justify-center gap-3">
                <Link to="/auth">
                  <Button size="lg" className="rounded-full bg-background text-foreground hover:bg-background/90 px-6">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="rounded-full px-6 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10">
                    Learn more
                  </Button>
                </Link>
              </div>
              <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-primary-foreground/90">
                {["Instant Access", "Bangla + English", "Secure Checkout", "Verified Reviews"].map((t) => (
                  <li key={t} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Asikon" className="h-7 w-7 rounded-md" />
            <span className="font-semibold">Asikon</span>
            <span className="text-xs text-muted-foreground ml-2">© {new Date().getFullYear()} — Made with <Heart className="inline h-3 w-3 text-primary fill-primary" /> in Bangladesh</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/shop" className="hover:text-foreground">Explore</Link>
            <Link to="/community" className="hover:text-foreground">Community</Link>
            <Link to="/auth" className="hover:text-foreground">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
