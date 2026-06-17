import { Plus } from "lucide-react";
import { StoryCircle } from "@/components/home/StoryCircle";
import { mockStories } from "@/lib/mock-data";

/**
 * Horizontal stories rail shown at the top of My Feed.
 *
 * Stories are not yet backed by a real data source. In dev we render
 * mock stories so designers can iterate on the UI; in production we
 * render an empty rail with only the "Add Story" affordance until a
 * real `stories` table + hook exist.
 */
export function FeedStoriesRail() {
  const stories = import.meta.env.DEV ? mockStories.slice(1) : [];

  return (
    <div className="px-4 pt-3">
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
        <button
          type="button"
          aria-label="Add story"
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div className="relative w-16 h-16 rounded-full border border-dashed border-border bg-background flex items-center justify-center">
            <Plus className="h-5 w-5 text-muted-foreground" aria-hidden />
          </div>
          <span className="text-[10.5px] tracking-[0.04em] text-muted-foreground truncate max-w-[64px]">
            Add Story
          </span>
        </button>
        {stories.map((story, index) => (
          <StoryCircle key={story.id} story={story} isFirst={index === 0} />
        ))}
      </div>
    </div>
  );
}
