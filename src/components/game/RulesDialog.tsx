import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

const RULES = [
  "Complete a lesson → earn 10 XP + 5 coins",
  "Daily streak → bonus XP multiplier",
  "Level up every 100 XP",
  "Use coins to redeem rewards",
  "Maintain your streak — it resets if you miss a day",
];

export function RulesDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How It Works</DialogTitle>
        </DialogHeader>
        <ul className="space-y-2.5 text-sm">
          {RULES.map((r) => (
            <li key={r} className="flex gap-2.5 rounded-xl bg-secondary/40 border border-border px-3 py-2.5">
              <span className="text-foreground font-semibold shrink-0">✦</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

