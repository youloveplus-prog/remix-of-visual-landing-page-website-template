import { memo } from "react";
import { Play, Eye } from "lucide-react";
import { Video } from "@/types/community";
import { CreatorCard } from "./CreatorCard";
import { VerifiedBuyerBadge } from "./VerifiedBuyerBadge";
import { ProductTag } from "./ProductTag";

interface VideoCardProps {
  video: Video;
}

function VideoCardImpl({ video }: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <article className="bg-card rounded-2xl overflow-hidden border border-border">
      {/* Thumbnail */}
      <div className="relative aspect-video group">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/10">
          <div className="w-11 h-11 rounded-full bg-background/70 backdrop-blur-md ring-1 ring-border flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Play className="h-5 w-5 fill-foreground ml-0.5" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-background/80 backdrop-blur-sm rounded text-[10px] font-semibold tabular-nums">
          {formatDuration(video.duration)}
        </div>

        {/* Verified buyer badge */}
        {video.isVerifiedBuyer && (
          <div className="absolute top-2 right-2">
            <VerifiedBuyerBadge showText={false} className="bg-background/85 backdrop-blur ring-1 ring-border text-foreground/80" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3.5">
        <div>
          <h3 className="font-semibold text-[14.5px] leading-snug line-clamp-2">{video.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 text-[11.5px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(video.views)} views
            </span>
            <span aria-hidden className="inline-block w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>{video.timestamp}</span>
          </div>
        </div>

        <CreatorCard user={video.user} variant="compact" />

        {/* Product tag */}
        {video.products && video.products.length > 0 && (
          <ProductTag product={video.products[0]} variant="inline" />
        )}
      </div>
    </article>
  );
}

export const VideoCard = memo(VideoCardImpl);
