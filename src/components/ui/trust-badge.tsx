import { cn } from "@/lib/utils";
import { Shield, CheckCircle } from "lucide-react";

interface TrustBadgeProps {
  type: "authentic" | "verified" | "trusted";
  className?: string;
  size?: "sm" | "md";
}

export function TrustBadge({ type, className, size = "sm" }: TrustBadgeProps) {
  const config = {
    authentic: {
      icon: Shield,
      label: "Authentic",
      colors: "bg-primary/10 text-primary border-primary/30",
    },
    verified: {
      icon: CheckCircle,
      label: "Verified",
      colors: "bg-primary/10 text-primary border-primary/30",
    },
    trusted: {
      icon: Shield,
      label: "Trusted",
      colors: "bg-primary/20 text-primary border-primary/30",
    },
  };

  const { icon: Icon, label, colors } = config[type];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        colors,
        className
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      <span className="font-medium">{label}</span>
    </div>
  );
}
