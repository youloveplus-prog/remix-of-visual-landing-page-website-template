import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CHIPS = [
  "bg-[hsl(var(--chip-butter))]",
  "bg-[hsl(var(--chip-lavender))]",
  "bg-[hsl(var(--chip-mint))]",
  "bg-[hsl(var(--chip-cream))]",
] as const;

interface LegalSectionProps {
  index: number;
  title: string;
  children: ReactNode;
  className?: string;
}

export const LegalSection = ({
  index,
  title,
  children,
  className,
}: LegalSectionProps) => {
  const chip = CHIPS[(index - 1) % CHIPS.length];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      id={`section-${index}`}
      className={cn(
        "legal-card rounded-[28px] p-6 sm:p-8 transition-all duration-500 ease-out",
        chip,
        "shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)]",
        "border border-white/40",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4 mb-3">
        <span
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
            "bg-white/70 text-sm font-bold text-foreground/80 font-dot",
            "shadow-sm border border-white/50"
          )}
        >
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight leading-snug mt-2">
          {title}
        </h2>
      </div>
      <div className="prose-legal pl-14">{children}</div>
    </div>
  );
};
