import { useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarUser } from "./sidebar/SidebarUser";
import { SidebarNav } from "./sidebar/SidebarNav";

import { SidebarFooter } from "./sidebar/SidebarFooter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { haptic } from "@/lib/haptics";

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
      haptic("light");
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
        className="w-[88vw] max-w-[340px] p-0 border-r border-black/5 h-[100dvh] overflow-hidden overscroll-contain bg-background shadow-[12px_0_40px_-12px_hsl(0_0%_0%/0.12)] ring-1 ring-black/5 data-[state=open]:duration-[260ms] data-[state=closed]:duration-200 data-[state=open]:ease-[cubic-bezier(0.32,0.72,0,1)]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        <div className="relative flex flex-col h-full font-sans">
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
