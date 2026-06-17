import { cn } from "@/lib/utils";

interface LivePulseProps {
  count: number;
  className?: string;
  variant?: "chip" | "inline";
}

export function LivePulse({ count, className, variant = "chip" }: LivePulseProps) {
  const isInline = variant === "inline";
  return (
    <span
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.18em] text-[10px]",
        isInline
          ? "text-primary"
          : "rounded-full px-2.5 py-1 bg-primary/10 text-primary border border-primary/20",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      Live
      {count > 0 && (
        <span className={cn("normal-case tracking-normal", isInline ? "text-muted-foreground" : "text-primary/80")}>
          · {count} new
        </span>
      )}
    </span>
  );
}
