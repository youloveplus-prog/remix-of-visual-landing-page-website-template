import { Search, Bell } from "lucide-react";

export function CommunityHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/85 backdrop-blur-md">
      <div>
        <h1 className="font-display text-[17px] font-semibold tracking-tight leading-none">Community</h1>
        <p className="text-[11px] text-muted-foreground mt-1">Learn together. Grow faster.</p>
      </div>
      <div className="flex items-center gap-1">
        <button aria-label="Search" className="p-2 rounded-full hover:bg-secondary/70 transition-colors">
          <Search className="h-5 w-5 text-foreground/70" />
        </button>
        <button aria-label="Notifications" className="relative p-2 rounded-full hover:bg-secondary/70 transition-colors">
          <Bell className="h-5 w-5 text-foreground/70" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
      </div>
    </div>
  );
}
