import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-fashion-1.jpg";

export function HeroBanner() {
  return (
    <div className="relative h-[220px] sm:h-64 overflow-hidden rounded-none sm:rounded-2xl sm:mx-4">
      <img
        src={heroImage}
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/55 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-center p-5 sm:p-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] px-2 py-1 rounded-full gradient-primary text-primary-foreground w-fit mb-3">
          New drop
        </span>
        <h2 className="font-display text-xl sm:text-2xl font-bold mb-1.5 tracking-tight">
          Skill up this week
        </h2>
        <p className="text-[13px] sm:text-sm text-muted-foreground mb-4 max-w-[220px]">
          Top-rated courses, hand-picked for you.
        </p>
        <Button variant="secondary" size="sm" className="w-fit">
          Shop now
        </Button>
      </div>
    </div>
  );
}
