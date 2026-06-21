import { cn } from "@/lib/utils";
import { Coins } from "lucide-react";

interface CoinBadgeProps {
  amount: number;
  className?: string;
  showIcon?: boolean;
}

export function CoinBadge({ amount, className, showIcon = true }: CoinBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "bg-gradient-to-r from-[hsl(var(--chip-butter)/0.3)] to-[hsl(var(--chip-butter)/0.1)]",
        "border border-amber-500/30",
        className
      )}
    >
      {showIcon && <Coins className="h-4 w-4 text-amber-400" />}
      <span className="text-sm font-semibold text-amber-400">
        {amount.toLocaleString()}
      </span>
    </div>
  );
}
