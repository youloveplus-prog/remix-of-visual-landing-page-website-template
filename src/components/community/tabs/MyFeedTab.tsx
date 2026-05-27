import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { mockPosts } from "@/lib/mock-data";
import {
  mockVideos,
  mockShorts,
  mockReviews,
  mockLiveSessions,
  mockOffers,
} from "@/lib/community-mock-data";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { FeedStoriesRail } from "../feed/FeedStoriesRail";
import { FeedItemRenderer } from "../feed/FeedItemRenderer";
import type { FeedItem } from "../feed/feed-types";

/**
 * Build a mixed, deterministic feed from all mock sources. Memoized at module
 * scope so it runs exactly once across the app lifetime — never causes
 * re-renders in MyFeedTab.
 */
const buildMixedFeed = (): FeedItem[] => {
  const items: FeedItem[] = [];
  const maxLength = Math.max(
    mockPosts.length,
    mockVideos.length,
    mockShorts.length,
    mockReviews.length,
    mockLiveSessions.length,
    mockOffers.length,
  );

  for (let i = 0; i < maxLength; i++) {
    const post = mockPosts[i];
    if (post) items.push({ type: "post", data: post, id: `post-${post.id}` });

    const video = mockVideos[i];
    if (video) items.push({ type: "video", data: video, id: `video-${video.id}` });

    const short = mockShorts[i];
    if (short && i % 3 === 0) {
      items.push({ type: "short", data: short, id: `short-${short.id}` });
    }

    const review = mockReviews[i];
    if (review) items.push({ type: "review", data: review, id: `review-${review.id}` });

    const live = mockLiveSessions[i];
    if (live && live.isLive) {
      items.push({ type: "live", data: live, id: `live-${live.id}` });
    }

    const offer = mockOffers[i];
    if (offer) items.push({ type: "offer", data: offer, id: `offer-${offer.id}` });
  }

  return items;
};

export function MyFeedTab() {
  // Stable reference — `useMemo([])` returns the same array on every render.
  const allContent = useMemo<FeedItem[]>(buildMixedFeed, []);

  const { displayedItems, isLoading, loaderRef } = useInfiniteScroll<FeedItem>({
    items: allContent,
    itemsPerPage: 4,
  });

  return (
    <div className="space-y-5">
      <FeedStoriesRail />

      <div className="space-y-5">
        {displayedItems.map((item, index) => (
          <FeedItemRenderer
            key={item._loopKey ?? `${item.id}-${index}`}
            item={item}
            index={index}
          />
        ))}

        <div ref={loaderRef} className="flex justify-center py-4">
          {isLoading && (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
