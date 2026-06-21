import { ShieldCheck, Zap, RefreshCw, Lock } from "lucide-react";

export function TrustIndicators() {
  const indicators = [
    { icon: Zap, label: "Instant Access", color: "text-success" },
    { icon: Lock, label: "Secure Checkout", color: "text-primary" },
    { icon: RefreshCw, label: "7-Day Money-Back", color: "text-primary" },
    { icon: ShieldCheck, label: "Verified Quality", color: "text-success" },
  ];


  return (
    <div className="flex flex-wrap gap-3">
      {indicators.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50"
        >
          <item.icon className={`h-4 w-4 ${item.color}`} />
          <span className="text-xs font-medium text-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
