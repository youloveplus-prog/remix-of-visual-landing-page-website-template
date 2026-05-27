import type { Post, Story } from "@/types";
import type { Video, Short, Review, LiveSession, Offer } from "@/types/community";

/**
 * Discriminated union used by the mixed My Feed renderer.
 * Each variant pins `data` to the matching domain type — no `any`.
 */
export type FeedItem =
  | { id: string; type: "post"; data: Post }
  | { id: string; type: "video"; data: Video }
  | { id: string; type: "short"; data: Short }
  | { id: string; type: "review"; data: Review }
  | { id: string; type: "live"; data: LiveSession }
  | { id: string; type: "offer"; data: Offer };

/** Optional loop key appended by useInfiniteScroll when items repeat. */
export type LoopedFeedItem = FeedItem & { _loopKey?: string };

export type { Post, Story, Video, Short, Review, LiveSession, Offer };
