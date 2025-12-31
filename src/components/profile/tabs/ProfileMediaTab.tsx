import { Play, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MediaItem {
  id: string;
  type: "image" | "video" | "short" | "live";
  thumbnail: string;
  url: string;
  duration?: number;
  viewCount?: number;
}

interface ProfileMediaTabProps {
  media: MediaItem[];
}

export function ProfileMediaTab({ media }: ProfileMediaTabProps) {
  const [filter, setFilter] = useState<"all" | "photos" | "videos" | "shorts">("all");
  
  const filteredMedia = media.filter(item => {
    if (filter === "all") return true;
    if (filter === "photos") return item.type === "image";
    if (filter === "videos") return item.type === "video";
    if (filter === "shorts") return item.type === "short";
    return true;
  });

  const filters = [
    { id: "all", label: "All" },
    { id: "photos", label: "Photos" },
    { id: "videos", label: "Videos" },
    { id: "shorts", label: "Shorts" },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div>
      {/* Filter Pills */}
      <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              filter === f.id
                ? "gradient-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {filteredMedia.map((item) => (
          <div 
            key={item.id}
            className="relative aspect-square overflow-hidden cursor-pointer group"
          >
            <img 
              src={item.thumbnail} 
              alt=""
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay for video/shorts */}
            {(item.type === "video" || item.type === "short") && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">
                  <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                </div>
              </div>
            )}
            
            {/* Duration/Views Badge */}
            {item.duration && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white">
                {formatDuration(item.duration)}
              </div>
            )}
            
            {item.type === "short" && item.viewCount && (
              <div className="absolute bottom-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white">
                <Play className="h-2.5 w-2.5 fill-white" />
                {formatViews(item.viewCount)}
              </div>
            )}

            {/* Live Badge */}
            {item.type === "live" && (
              <div className="absolute top-1 left-1 px-2 py-0.5 rounded text-[10px] font-bold bg-destructive text-white">
                LIVE
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="py-16 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No media yet</p>
        </div>
      )}
    </div>
  );
}
