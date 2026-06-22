import { cn } from "@/lib/utils";

interface ResourceTagBarProps {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear?: () => void;
}

function prettyTag(t: string) {
  return t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ResourceTagBar({ tags, selected, onToggle, onClear }: ResourceTagBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => {
        const isOn = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            aria-pressed={isOn}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-medium border transition-colors",
              isOn
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground/85 border-border/70 hover:border-primary/60 hover:text-primary",
            )}
          >
            {prettyTag(tag)}
          </button>
        );
      })}
      {selected.length > 0 && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          Clear
        </button>
      )}
    </div>
  );
}
