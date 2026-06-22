import { cn } from "@/lib/utils";
import { Story } from "@/types";

interface StoryCircleProps {
  story: Story;
  isFirst?: boolean;
}

export function StoryCircle({ story, isFirst }: StoryCircleProps) {
  return (
    <button className="flex flex-col items-center gap-1.5 flex-shrink-0">
      <div
        className={cn(
          "relative w-16 h-16 rounded-full p-0.5",
          "bg-gradient-to-br from-primary via-accent to-primary"
        )}
      >
        <div className="w-full h-full rounded-full bg-background p-0.5">
          <img
            src={story.thumbnail}
            alt={story.user.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        {isFirst && (
          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[8px] font-bold rounded-full gradient-primary">
            NEW
          </div>
        )}
      </div>
      <span className="text-xs text-muted-foreground truncate w-16 text-center">
        {story.user.name.split(" ")[0]}
      </span>
    </button>
  );
}
