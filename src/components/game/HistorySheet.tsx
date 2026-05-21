import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { History, CheckCircle2 } from "lucide-react";
import { useLessonHistory } from "@/hooks/useGameData";
import { formatDistanceToNow } from "date-fns";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

export function HistorySheet({ open, onOpenChange }: Props) {
  const { data = [], isLoading } = useLessonHistory();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Recent History
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
          ) : data.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No lessons completed yet.</p>
          ) : (
            data.map((h) => (
              <div key={h.id} className="flex items-center gap-3 rounded-xl bg-secondary/40 border border-border/40 px-3 py-2.5">
                <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{h.lesson_title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {(() => { try { return formatDistanceToNow(new Date(h.completed_at), { addSuffix: true }); } catch { return ""; } })()}
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary">+{h.xp_awarded} XP</span>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
