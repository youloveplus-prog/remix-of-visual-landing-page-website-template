import { Zap, ShieldCheck, RotateCcw, BadgeCheck } from "lucide-react";

const ITEMS = [
  { icon: Zap, label: "Instant access", sub: "Digital delivery, no waiting" },
  { icon: ShieldCheck, label: "Secure checkout", sub: "Card & bKash, encrypted" },
  { icon: RotateCcw, label: "7-day money back", sub: "On every paid course" },
  { icon: BadgeCheck, label: "Verified buyers only", sub: "Reviews from real learners" },
];

export function TrustStrip() {
  return (
    <section className="mt-10 border-y border-white/10">
      <div className="grid grid-cols-2 divide-x divide-white/10 sm:grid-cols-4">
        {ITEMS.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-start gap-3 px-4 py-5 sm:px-6">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[hsl(var(--hf-accent))]" />
            <div>
              <div className="text-[13px] font-semibold text-white">{label}</div>
              <div className="text-[11px] text-white/45">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
