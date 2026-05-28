import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetaItemProps {
  icon?: LucideIcon;
  label: string;
  value?: string | number;
  className?: string;
}

export function MetaItem({ icon: Icon, label, value, className }: MetaItemProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13px] text-muted-foreground", className)}>
      {Icon && <Icon className="h-3.5 w-3.5 text-foreground/60" />}
      {value !== undefined ? (
        <>
          <span className="text-foreground font-medium tabular-nums">{value}</span>
          <span>{label}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </span>
  );
}

export function MetaDot() {
  return <span className="text-border" aria-hidden>·</span>;
}
