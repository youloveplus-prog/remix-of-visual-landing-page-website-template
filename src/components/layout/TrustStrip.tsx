import { Zap, ShieldCheck, RefreshCw } from "lucide-react";

interface TrustStripProps {
  show?: boolean;
}

export function TrustStrip({ show = true }: TrustStripProps) {
  if (!show) return null;

  const trustItems = [
    { icon: <Zap className="w-3.5 h-3.5" />, text: "Instant Digital Access" },
    { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: "Secure Checkout" },
    { icon: <RefreshCw className="w-3.5 h-3.5" />, text: "7-Day Money-Back Guarantee" },
  ];

  return (
    <div className="hidden md:flex items-center justify-center gap-6 py-1.5 px-4 bg-secondary/50 border-b border-border text-xs">
      {trustItems.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 text-muted-foreground">
          {item.icon}
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}
