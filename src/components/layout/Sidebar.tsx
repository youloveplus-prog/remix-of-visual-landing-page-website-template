import { useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarUser } from "./sidebar/SidebarUser";
import { SidebarNav } from "./sidebar/SidebarNav";
import { SidebarSecondary } from "./sidebar/SidebarSecondary";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { haptics } from "@/lib/haptics";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const handleClose = () => onOpenChange(false);

  // Swipe-to-close (drag left to dismiss)
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const dragging = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dragging.current = true;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current || startX.current === null || startY.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    // horizontal-dominant swipe left
    if (dx < -60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      dragging.current = false;
      haptics.light();
      handleClose();
    }
  };
  const onTouchEnd = () => {
    dragging.current = false;
    startX.current = null;
    startY.current = null;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="w-[88vw] max-w-[340px] p-0 border-r border-border/40 h-[100dvh] overflow-hidden overscroll-contain bg-gradient-to-b from-[hsl(var(--sidebar-background,var(--background)))] via-background to-background backdrop-blur-2xl shadow-[28px_0_80px_-28px_hsl(var(--primary)/0.25)]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        {/* Decorative accent glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(720px 280px at -10% -10%, hsl(var(--primary) / 0.16), transparent 60%), radial-gradient(420px 220px at 110% 110%, hsl(var(--accent) / 0.10), transparent 65%)",
          }}
        />
        {/* Right edge hairline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
        />
        {/* Swipe affordance */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-12 w-[3px] rounded-full bg-foreground/15"
        />

        <div className="relative flex flex-col h-full">
          <SidebarUser onClose={handleClose} />

          <ScrollArea className="flex-1 overscroll-contain [&>[data-radix-scroll-area-viewport]]:overscroll-contain [&>[data-radix-scroll-area-viewport]]:touch-pan-y">
            <SidebarNav onClose={handleClose} />
            <SidebarSecondary onClose={handleClose} />
          </ScrollArea>

          <SidebarFooter onClose={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
