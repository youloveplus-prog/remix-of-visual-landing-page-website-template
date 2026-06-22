import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLeaderboard } from "@/hooks/useGameData";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface Props { open: boolean; onOpenChange: (v: boolean) => void }

const XP_PER_LEVEL = 100;

export function LeaderboardSheet({ open, onOpenChange }: Props) {
  const { data = [], isLoading } = useLeaderboard();
  const { user } = useAuth();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl pb-8 max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>🏆 Leaderboard</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-secondary/40 border border-border/40"
                aria-hidden
              >
                <Skeleton className="h-4 w-5" />
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 min-w-0 space-y-1.5">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-2.5 w-1/4" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-3.5 w-10 ml-auto" />
                  <Skeleton className="h-2 w-6 ml-auto" />
                </div>
              </div>
            ))

          ) : data.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No learners yet. Be the first!</p>
          ) : (
            data.map((u, i) => {
              const name = u.full_name || u.username || "Anonymous";
              const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
              const isMe = user?.id === u.user_id;
              const level = Math.floor((u.xp ?? 0) / XP_PER_LEVEL) + 1;
              return (
                <div
                  key={u.user_id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
                    isMe
                      ? "bg-primary/10 border-2 border-primary/60"
                      : "bg-secondary/40 border border-border/40",
                  )}
                >
                  <span className="text-sm font-bold w-7 text-center text-muted-foreground">#{i + 1}</span>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={u.avatar_url ?? undefined} alt={name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{name}{isMe && <span className="ml-2 text-[10px] text-primary">You</span>}</p>
                    <p className="text-[11px] text-muted-foreground">Level {level}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-sm">{u.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">XP</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

