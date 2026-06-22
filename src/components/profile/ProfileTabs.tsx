import { useEffect, useLayoutEffect, useRef, useState, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import {
  Newspaper,
  Image as ImageIcon,
  Star,
  GraduationCap,
  Library,
  ShoppingBag,
  Heart,
} from "lucide-react";

export type ProfileTabType =
  | "posts"
  | "media"
  | "reviews"
  | "learning"
  | "library"
  | "orders"
  | "wishlist";

interface ProfileTabsProps {
  activeTab: ProfileTabType;
  onTabChange: (tab: ProfileTabType) => void;
  /** Show owner-only tabs (Library, Orders, Wishlist) when viewing your own profile. */
  showPrivate?: boolean;
  counts?: Partial<Record<ProfileTabType, number>>;
}

type TabDef = { id: ProfileTabType; label: string; icon: React.ReactNode };

const PUBLIC_TABS: TabDef[] = [
  { id: "posts", label: "Posts", icon: <Newspaper className="h-4 w-4" /> },
  { id: "media", label: "Media", icon: <ImageIcon className="h-4 w-4" /> },
  { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" /> },
  { id: "learning", label: "Learning", icon: <GraduationCap className="h-4 w-4" /> },
];

const PRIVATE_TABS: TabDef[] = [
  { id: "library", label: "Library", icon: <Library className="h-4 w-4" /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "wishlist", label: "Wishlist", icon: <Heart className="h-4 w-4" /> },
];

export function ProfileTabs({
  activeTab,
  onTabChange,
  showPrivate = true,
  counts,
}: ProfileTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const tabs = showPrivate ? [...PUBLIC_TABS, ...PRIVATE_TABS] : PUBLIC_TABS;

  useLayoutEffect(() => {
    const el = buttonRefs.current[activeTab];
    const container = containerRef.current;
    if (!el || !container) return;
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setIndicator({ left: eRect.left - cRect.left + container.scrollLeft, width: eRect.width });
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab]);

  useEffect(() => {
    const onResize = () => {
      const el = buttonRefs.current[activeTab];
      const container = containerRef.current;
      if (!el || !container) return;
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      setIndicator({ left: eRect.left - cRect.left + container.scrollLeft, width: eRect.width });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeTab]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = tabs.findIndex((t) => t.id === activeTab);
    if (idx < 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onTabChange(tabs[(idx + 1) % tabs.length].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      onTabChange(tabs[(idx - 1 + tabs.length) % tabs.length].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      onTabChange(tabs[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      onTabChange(tabs[tabs.length - 1].id);
    }
  };

  const renderCount = (id: ProfileTabType, isActive: boolean) => {
    const count = counts?.[id];
    if (count === undefined || count <= 0) return null;
    return (
      <span
        className={cn(
          "px-1.5 py-0.5 rounded-full text-[10px] font-medium transition-colors tabular-nums",
          isActive ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  return (
    <div className="relative border-b border-border">
      {/* Fade edges hint at scrollable content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-6 z-10 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-6 z-10 bg-gradient-to-l from-background to-transparent"
      />

      <div
        ref={containerRef}
        role="tablist"
        aria-label="Profile sections"
        onKeyDown={onKeyDown}
        className="relative flex overflow-x-auto hide-scrollbar"
      >
        <span
          aria-hidden
          className="absolute -bottom-px h-[2px] rounded-full bg-foreground transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
        />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => (buttonRefs.current[tab.id] = el)}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              id={`profile-tab-${tab.id}`}
              aria-controls={`profile-panel-${tab.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-3 text-[13.5px] font-medium whitespace-nowrap transition-colors duration-200 focus-ring",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span aria-hidden>{tab.icon}</span>
              <span>{tab.label}</span>
              {renderCount(tab.id, isActive)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
