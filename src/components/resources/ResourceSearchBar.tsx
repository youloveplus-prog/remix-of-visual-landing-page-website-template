import { Search, X } from "lucide-react";

interface ResourceSearchBarProps {
  value: string;
  onChange: (v: string) => void;
}

export function ResourceSearchBar({ value, onChange }: ResourceSearchBarProps) {
  return (
    <div className="relative">
      <Search
        aria-hidden
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search resources…"
        aria-label="Search resources"
        className="w-full h-12 rounded-full border border-border/70 bg-card pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 transition-shadow shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
