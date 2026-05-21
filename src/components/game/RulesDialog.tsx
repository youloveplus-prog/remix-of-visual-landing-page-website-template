import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, Coins, Flame, Star } from "lucide-react";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function RulesDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-400" /> How it works</DialogTitle>
          <DialogDescription>Earn rewards as you learn</DialogDescription>
        </DialogHeader>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3"><Star className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span><b>+10 XP</b> for every lesson you complete. Level up every 100 XP.</span></li>
          <li className="flex gap-3"><Coins className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" /><span><b>+5 coins</b> per lesson. Redeem coins for rewards on this page.</span></li>
          <li className="flex gap-3"><Flame className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" /><span>Complete at least one lesson daily to keep your <b>streak</b>. Miss a day and it resets.</span></li>
        </ul>
      </DialogContent>
    </Dialog>
  );
}
