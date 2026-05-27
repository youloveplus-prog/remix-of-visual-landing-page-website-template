import { PostCard } from "@/components/community/PostCard";
import { VideoCard } from "@/components/community/VideoCard";
import { ReviewCard } from "@/components/community/ReviewCard";
import { LiveCard } from "@/components/community/LiveCard";
import { OfferCard } from "@/components/community/OfferCard";
import { FeedShortsRow } from "./FeedShortsRow";
import type { LoopedFeedItem } from "./feed-types";

interface FeedItemRendererProps {
  item: LoopedFeedItem;
  index: number;
}

/**
 * Renders a single feed item by variant. Pure — keys are computed by the
 * parent list so this component never needs its own state.
 */
export function FeedItemRenderer({ item }: FeedItemRendererProps) {
  switch (item.type) {
    case "post":
      return <PostCard post={item.data} />;
    case "video":
      return <div className="px-4"><VideoCard video={item.data} /></div>;
    case "short":
      return <FeedShortsRow />;
    case "review":
      return <div className="px-4"><ReviewCard review={item.data} /></div>;
    case "live":
      return <div className="px-4"><LiveCard session={item.data} /></div>;
    case "offer":
      return <div className="px-4"><OfferCard offer={item.data} /></div>;
    default: {
      // Exhaustiveness guard — compile error if a new variant is added.
      const _exhaustive: never = item;
      return _exhaustive;
    }
  }
}
