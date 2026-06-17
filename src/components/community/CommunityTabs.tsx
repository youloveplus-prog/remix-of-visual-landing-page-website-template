import { cn } from "@/lib/utils";
import { CommunityTab } from "@/types/community";
import { useEffect, useRef } from "react";

interface CommunityTabsProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}

// "live" tab hidden until real content exists.
const tabs: { id: CommunityTab; label: string }[] = [
  { id: "my-feed", label: "My Feed" },
  { id: "posts", label: "Posts" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "reviews", label: "Reviews" },
  { id: "offers", label: "Offers" },
];

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const didMountRef = useRef(false);

  // Keep the active tab visible when it changes.
  // Skip the initial mount so the whole page doesn't auto-scroll on first paint,
  // and constrain scrolling to the tab strip (not the window).
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const container = containerRef.current;
    const btn = activeRef.current;
    if (!container || !btn) return;
    const target =
      btn.offsetLeft - container.clientWidth / 2 + btn.clientWidth / 2;
    container.scrollTo({ left: target, behavior: "smooth" });
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-5 sm:gap-6 overflow-x-auto hide-scrollbar border-b border-border bg-background snap-x snap-mandatory"
      role="tablist"
      aria-label="Community sections"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={isActive ? activeRef : undefined}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative shrink-0 snap-center py-2.5 text-[13px] font-medium whitespace-nowrap",
              "transition-colors duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-sm",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span
              aria-hidden
              className={cn(
                "absolute left-1/2 -translate-x-1/2 -bottom-[1.5px] h-[2px] w-6 rounded-full bg-foreground z-10 transition-opacity",
                isActive ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
