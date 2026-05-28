import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBuyerBadgeProps {
  className?: string;
  showText?: boolean;
}

export function VerifiedBuyerBadge({ className, showText = true }: VerifiedBuyerBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/30 rounded-full text-[10.5px] font-semibold",
      className
    )}>
      <ShieldCheck className="h-3 w-3" />
      {showText && <span>Verified Buyer</span>}
    </div>
  );
}
