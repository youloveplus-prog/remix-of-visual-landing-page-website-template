import { Heart, MessageCircle, Share2, MoreHorizontal, ShoppingBag, Bookmark, BadgeCheck } from "lucide-react";
import { memo, useMemo, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Post } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SmartImage } from "@/components/ui/smart-image";

interface PostCardProps {
  post: Post;
  /** When provided, the whole card becomes a link. Inner actions stay interactive. */
  href?: string;
}

function PostCardImpl({ post, href }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(false);

  const stop = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleLike = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleSave = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSaved((s) => !s);
  };

  // Normalize to a single images array; supports legacy `image` field
  const images = useMemo(() => {
    if (post.images && post.images.length > 0) return post.images;
    if (post.image) return [post.image];
    return [];
  }, [post.images, post.image]);

  const articleClass = cn(
    "group/post mx-auto w-full max-w-[640px]",
    "bg-card border-y border-border sm:border sm:rounded-2xl overflow-hidden",
    "transition-shadow duration-200",
    "sm:hover:shadow-[var(--shadow-md)]",
    href && "focus-within:ring-2 focus-within:ring-ring",
  );

  const body = (
    <>
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
                <BadgeCheck aria-label="Verified" className="h-3.5 w-3.5 text-foreground/60" />
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
          onClick={stop}
          aria-label="More options"
          className="p-2 -mr-2 hover:bg-secondary/60 rounded-full transition-colors"
        >
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      {/* Caption (above images, Facebook-style) */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-[14px] leading-[1.55] text-foreground/90 whitespace-pre-wrap line-clamp-2 sm:line-clamp-3">
            {post.content}
          </p>
        </div>
      )}

      {/* Images */}
      {images.length > 0 && (
        <div className="relative px-4 pb-1">
          <ImageCollage images={images} hasShopTag={!!post.product} />
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
          <ActionButton ariaLabel="Comment" onClick={stop}>
            <MessageCircle className="h-[18px] w-[18px]" />
            <span className="text-[12.5px] font-medium tabular-nums">{post.comments}</span>
          </ActionButton>
          <ActionButton ariaLabel="Share" onClick={stop}>
            <Share2 className="h-[18px] w-[18px]" />
          </ActionButton>
        </div>
        <ActionButton onClick={handleSave} active={saved} ariaLabel="Save">
          <Bookmark
            className={cn(
              "h-[18px] w-[18px] transition-all",
              saved && "fill-foreground text-foreground"
            )}
          />
        </ActionButton>
      </div>

      {/* Spacer for clean rhythm */}
      <div className="pb-3" />
    </>
  );

  if (href) {
    return (
      <Link
        to={href}
        aria-label={`Open post by ${post.user.name}`}
        className="block focus:outline-none"
      >
        <article className={articleClass}>{body}</article>
      </Link>
    );
  }

  return <article className={articleClass}>{body}</article>;
}

/**
 * Facebook-style multi-image collage.
 * 1: single tall image
 * 2: side-by-side
 * 3: one large + two stacked
 * 4: 2x2 grid
 * 5+: 2 on top, 3 on bottom with "+N" overlay on the last tile
 */
function ImageCollage({ images, hasShopTag }: { images: string[]; hasShopTag: boolean }) {
  const count = images.length;
  const shopTag = hasShopTag ? (
    <button className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md border border-border text-[11.5px] font-medium hover:bg-background transition-colors z-10">
      <ShoppingBag className="h-3.5 w-3.5" />
      Shop the look
    </button>
  ) : null;

  if (count === 1) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-muted">
        <SmartImage
          src={images[0]}
          alt="Post image"
          className="w-full aspect-[4/3] sm:aspect-[16/11] object-cover"
        />
        {shopTag}
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="relative grid grid-cols-2 gap-1 rounded-xl overflow-hidden bg-muted">
        {images.slice(0, 2).map((src, i) => (
          <SmartImage key={i} src={src} alt={`Post image ${i + 1}`} className="w-full aspect-square object-cover" />
        ))}
        {shopTag}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="relative grid grid-cols-2 gap-1 rounded-xl overflow-hidden bg-muted aspect-[4/3]">
        <SmartImage src={images[0]} alt="Post image 1" className="row-span-2 w-full h-full object-cover" />
        <SmartImage src={images[1]} alt="Post image 2" className="w-full h-full object-cover" />
        <SmartImage src={images[2]} alt="Post image 3" className="w-full h-full object-cover" />
        {shopTag}
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="relative grid grid-cols-2 gap-1 rounded-xl overflow-hidden bg-muted">
        {images.slice(0, 4).map((src, i) => (
          <SmartImage key={i} src={src} alt={`Post image ${i + 1}`} className="w-full aspect-square object-cover" />
        ))}
        {shopTag}
      </div>
    );
  }

  // 5 or more
  const extra = count - 5;
  return (
    <div className="relative grid grid-cols-6 gap-1 rounded-xl overflow-hidden bg-muted">
      {images.slice(0, 2).map((src, i) => (
        <SmartImage
          key={`top-${i}`}
          src={src}
          alt={`Post image ${i + 1}`}
          className="col-span-3 w-full aspect-[4/3] object-cover"
        />
      ))}
      {images.slice(2, 5).map((src, i) => {
        const isLast = i === 2 && extra > 0;
        return (
          <div key={`bot-${i}`} className="relative col-span-2">
            <SmartImage
              src={src}
              alt={`Post image ${i + 3}`}
              className="w-full aspect-square object-cover"
            />
            {isLast && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                <span className="text-foreground text-xl font-semibold">+{extra}</span>
              </div>
            )}
          </div>
        );
      })}
      {shopTag}
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: (e: MouseEvent) => void;
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
        active && "bg-secondary"
      )}
    >
      {children}
    </button>
  );
}

export const PostCard = memo(PostCardImpl);
