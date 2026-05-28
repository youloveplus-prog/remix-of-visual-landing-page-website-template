import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag, Users, GraduationCap, Sparkles } from "lucide-react";

const STORAGE_KEY = "asikon:onboarded:v1";

type Step = {
  icon: typeof BookOpen;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    icon: Sparkles,
    title: "Welcome to ASIKON",
    body: "Your AI-powered learning companion — shop, learn, and connect, all in one place.",
  },
  {
    icon: BookOpen,
    title: "Learn 24/7 with AI",
    body: "Ask any question to your AI tutor, follow tracks, and build skills at your own pace.",
  },
  {
    icon: ShoppingBag,
    title: "Trust-first marketplace",
    body: "Courses, ebooks and digital products with instant access, secure checkout, and verified buyer reviews.",
  },
  {
    icon: Users,
    title: "Community + Mentorship",
    body: "Join verified-buyer discussions and book 1-on-1 mentors for your child when seats open.",
  },
];

/**
 * One-time, dismissible welcome tour. Renders nothing once the user
 * has completed or skipped it. Mounted on the Home route.
 */
export function FirstRunTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Small delay so it doesn't compete with first paint
        const t = window.setTimeout(() => setOpen(true), 900);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* localStorage unavailable — silently skip */
    }
  }, []);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else finish();
  };

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : finish())}>
      <DialogContent className="glass-strong border-0 max-w-md rounded-3xl p-0 overflow-hidden">
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60 pointer-events-none"
            style={{ background: "var(--gradient-aurora)" }}
          />
          <div className="relative p-6 sm:p-8 text-center flex flex-col items-center gap-4">
            <div
              className="size-16 rounded-2xl grid place-items-center shadow-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Icon className="size-8 text-primary-foreground" aria-hidden />
            </div>
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                {current.title}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {current.body}
              </DialogDescription>
            </DialogHeader>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1" role="tablist" aria-label="Tour progress">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === step}
                  aria-label={`Step ${i + 1} of ${STEPS.length}`}
                  onClick={() => setStep(i)}
                  className={
                    "h-1.5 rounded-full transition-all " +
                    (i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50")
                  }
                />
              ))}
            </div>

            <div className="flex w-full items-center justify-between gap-2 pt-2">
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={finish}
                aria-label="Skip welcome tour"
              >
                Skip
              </Button>
              <Button
                className="rounded-full px-6"
                onClick={next}
                style={!isLast ? undefined : { background: "var(--gradient-primary)" }}
              >
                {isLast ? "Get started" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FirstRunTour;
