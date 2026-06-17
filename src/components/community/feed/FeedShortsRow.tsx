import { ShortCard } from "@/components/community/ShortCard";
import { mockShorts } from "@/lib/community-mock-data";

/**
 * Embedded "Trending Shorts" row that appears inline in the mixed feed.
 *
 * Shorts are not yet backed by a real data source. In dev we show mock
 * shorts so designers can iterate on the UI; in production we render
 * an empty-state hint until a real `shorts` table + hook exist, so
 * users never see fake content.
 */
export function FeedShortsRow() {
  const shorts = import.meta.env.DEV ? mockShorts.slice(0, 4) : [];

  if (shorts.length === 0) return null;

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
        {shorts.map((short) => (
          <div key={short.id} className="w-36 flex-shrink-0">
            <ShortCard short={short} />
          </div>
        ))}
      </div>
    </div>
  );
}
