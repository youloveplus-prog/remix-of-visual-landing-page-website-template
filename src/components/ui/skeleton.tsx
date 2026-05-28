import { cn } from "@/lib/utils";

/**
 * Calm shimmer — slower (2s), lower-contrast than default pulse.
 * Honors prefers-reduced-motion.
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted/70",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_ease-in-out_infinite]",
        "before:bg-[linear-gradient(90deg,transparent,hsl(var(--background)/0.5),transparent)]",
        "motion-reduce:before:hidden",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
