import { Heart, MessageCircle, Share2, MoreHorizontal, ShoppingBag, Bookmark } from "lucide-react";
import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SmartImage } from "@/components/ui/smart-image";

interface PostCardProps {
  post: Post;
}

function PostCardImpl({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <article
      className={cn(
        "group/post mx-auto w-full max-w-[640px]",
        "bg-card border-y border-border sm:border sm:rounded-2xl overflow-hidden",
        "transition-shadow duration-200",
        "sm:hover:shadow-[var(--shadow-md)]"
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-medium text-[14px] truncate">
                {post.user.username}
              </span>
              {post.user.isVerified && (
                <span
                  aria-label="Verified"
                  className="inline-grid place-items-center h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold"
                >
                  ✓
                </span>
              )}
            </div>
            <p className="text-[11.5px] text-muted-foreground flex items-center gap-1.5">
              <span>{post.user.name}</span>
              <span aria-hidden className="opacity-50">·</span>
              <span>{post.timestamp}</span>
            </p>
          </div>
        </div>
        <button
          aria-label="More options"
          className="p-2 -mr-2 hover:bg-secondary/60 rounded-full transition-colors"
        >
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      {/* Image */}
      {post.image && (
        <div className="relative px-4">
          <div className="relative overflow-hidden rounded-xl bg-muted">
            <SmartImage
              src={post.image}
              alt="Post content"
              className="w-full aspect-[4/5] sm:aspect-[16/11] object-cover"
            />
            {post.product && (
              <button className="absolute bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-md border border-border text-[12px] font-medium hover:bg-background transition-colors">
                <ShoppingBag className="h-3.5 w-3.5 text-foreground/70" />
                Shop the look
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action strip */}
      <div className="flex items-center justify-between px-3 pt-3">
        <div className="flex items-center gap-1">
          <ActionButton onClick={handleLike} active={isLiked} ariaLabel="Like">
            <Heart
              className={cn(
                "h-[18px] w-[18px] transition-all",
                isLiked && "fill-primary text-primary"
              )}
            />
            <span className="text-[12.5px] font-medium tabular-nums">
              {likes.toLocaleString()}
            </span>
          </ActionButton>
          <ActionButton ariaLabel="Comment">
            <MessageCircle className="h-[18px] w-[18px]" />
            <span className="text-[12.5px] font-medium tabular-nums">{post.comments}</span>
          </ActionButton>
          <ActionButton ariaLabel="Share">
            <Share2 className="h-[18px] w-[18px]" />
          </ActionButton>
        </div>
        <ActionButton
          onClick={() => setSaved((s) => !s)}
          active={saved}
          ariaLabel="Save"
        >
          <Bookmark
            className={cn(
              "h-[18px] w-[18px] transition-all",
              saved && "fill-foreground text-foreground"
            )}
          />
        </ActionButton>
      </div>

      {/* Caption */}
      <div className="px-4 pt-2 pb-4">
        <p className="text-[14px] leading-relaxed">
          <span className="font-medium mr-1.5">{post.user.username}</span>
          <span className="text-foreground/85">{post.content}</span>
        </p>
      </div>
    </article>
  );
}

function ActionButton({
  children,
  onClick,
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200",
        "hover:bg-secondary/60 active:scale-[0.96]",
        active && "bg-primary/10"
      )}
    >
      {children}
    </button>
  );
}

export const PostCard = memo(PostCardImpl);
