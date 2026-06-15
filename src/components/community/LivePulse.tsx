import { cn } from "@/lib/utils";

interface LivePulseProps {
  count: number;
  className?: string;
}

export function LivePulse({ count, className }: LivePulseProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "bg-primary/10 text-primary border border-primary/20",
        "text-[10px] uppercase tracking-[0.18em] font-mono",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      Live
      {count > 0 && <span className="text-primary/80 normal-case tracking-normal">· {count} new</span>}
    </span>
  );
}
