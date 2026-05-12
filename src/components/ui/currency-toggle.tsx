import { useCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencyToggleProps {
  className?: string;
  /** Compact pill (icon-only height). Default true for headers. */
  compact?: boolean;
}

/** Two-segment toggle between USD and BDT. */
export function CurrencyToggle({ className, compact = true }: CurrencyToggleProps) {
  const { currency, setCurrency } = useCurrency();

  const Item = ({ value, label }: { value: "USD" | "BDT"; label: string }) => {
    const active = currency === value;
    return (
      <button
        type="button"
        onClick={() => setCurrency(value)}
        aria-pressed={active}
        className={cn(
          "relative px-2 rounded-full text-[11px] font-semibold transition-colors focus-ring",
          compact ? "h-6" : "h-7 px-3 text-xs",
          active
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        style={
          active ? { background: "var(--gradient-primary)" } : undefined
        }
      >
        {label}
      </button>
    );
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 p-0.5 rounded-full border border-border/60 bg-secondary/50 backdrop-blur-sm",
        className
      )}
      role="group"
      aria-label="Currency"
    >
      <Item value="BDT" label="৳ BDT" />
      <Item value="USD" label="$ USD" />
    </div>
  );
}
