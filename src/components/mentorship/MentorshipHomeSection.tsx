import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import tutorImage from "@/assets/home-tutor.jpg";

export function MentorshipHomeSection() {
  return (
    <section className="section-x">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/6]">
        {/* Background image */}
        <img
          src={tutorImage}
          alt="A friendly home tutor helping a child study at home"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />

        {/* Brand gradient overlay — strong on left, fades to right */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.92) 38%, hsl(var(--primary) / 0.55) 60%, transparent 85%)",
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center p-5 sm:p-7 lg:p-10 max-w-[68%] sm:max-w-[60%] lg:max-w-[55%]">
          <span className="inline-flex w-fit items-center rounded-full bg-white/15 backdrop-blur-sm text-primary-foreground text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 border border-white/25 mb-3">
            For parents
          </span>

          <h2 className="font-display font-bold text-primary-foreground leading-[1.1] tracking-tight text-[22px] sm:text-3xl lg:text-[40px]">
            Find a trusted home tutor for your child.
          </h2>

          <p className="hidden sm:block text-primary-foreground/85 mt-3 leading-relaxed text-sm lg:text-base max-w-md">
            Book a free demo class, meet a background-checked teacher, and only continue if it feels right for your family.
          </p>

          <p className="text-primary-foreground/85 text-[12.5px] mt-2 sm:hidden">
            Book a free demo class with a verified teacher.
          </p>

          <div className="mt-4 lg:mt-6">
            <Button asChild variant="secondary" size="lg" className="shadow-lg">
              <Link to="/mentors" className="inline-flex items-center gap-1.5">
                Book a free demo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
