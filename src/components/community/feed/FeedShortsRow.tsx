import { ShortCard } from "@/components/community/ShortCard";
import { mockShorts } from "@/lib/community-mock-data";

/**
 * Embedded "Trending Shorts" row that appears inline in the mixed feed.
 */
export function FeedShortsRow() {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="font-semibold text-[14px]">Trending Shorts</h3>
        <button
          type="button"
          className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
        >
          See all
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar px-4">
        {mockShorts.slice(0, 4).map((short) => (
          <div key={short.id} className="w-36 flex-shrink-0">
            <ShortCard short={short} />
          </div>
        ))}
      </div>
    </div>
  );
}
