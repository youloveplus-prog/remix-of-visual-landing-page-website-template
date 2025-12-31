import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  Newspaper, ShoppingBag, Star, Image, Palette, Activity 
} from "lucide-react";

export type ProfileTabType = "feed" | "shop" | "reviews" | "media" | "designs" | "activity";

interface ProfileTabsProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
  counts?: {
    feed?: number;
    shop?: number;
    reviews?: number;
    media?: number;
    designs?: number;
    activity?: number;
  };
}

const tabs: { id: ProfileTabType; label: string; icon: React.ReactNode }[] = [
  { id: "feed", label: "Feed", icon: <Newspaper className="h-4 w-4" /> },
  { id: "shop", label: "Shop", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" /> },
  { id: "media", label: "Media", icon: <Image className="h-4 w-4" /> },
  { id: "designs", label: "Designs", icon: <Palette className="h-4 w-4" /> },
  { id: "activity", label: "Activity", icon: <Activity className="h-4 w-4" /> },
];

export function ProfileTabs({ activeTab, onTabChange, counts }: ProfileTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto hide-scrollbar px-2"
      >
        {tabs.map((tab) => {
          const count = counts?.[tab.id];
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all",
                "border-b-2 -mb-px",
                isActive 
                  ? "text-foreground border-primary" 
                  : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
              )}
            >
              <span className={cn(isActive && "text-primary")}>{tab.icon}</span>
              <span>{tab.label}</span>
              {count !== undefined && count > 0 && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs",
                  isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
