import { cn } from "@/lib/utils";
import { CommunityTab } from "@/types/community";
import { useEffect, useRef } from "react";

interface CommunityTabsProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}

// "live" and "offers" tabs hidden until real content exists.
const tabs: { id: CommunityTab; label: string }[] = [
  { id: "my-feed", label: "My Feed" },
  { id: "posts", label: "Posts" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "reviews", label: "Reviews" },
];

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Keep the active tab visible when it changes
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-6 px-4 overflow-x-auto hide-scrollbar border-b border-border bg-background/85 backdrop-blur-md"
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
              "relative shrink-0 py-3 text-[13.5px] font-medium whitespace-nowrap",
              "transition-colors duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-sm",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            <span
              aria-hidden
              className={cn(
                "absolute left-0 right-0 -bottom-px h-[2px] rounded-full transition-opacity",
                isActive ? "bg-foreground opacity-100" : "opacity-0"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
