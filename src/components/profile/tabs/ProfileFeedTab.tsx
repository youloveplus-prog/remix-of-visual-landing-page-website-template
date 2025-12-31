import { Heart, MessageCircle, Share2, MoreHorizontal, ShoppingBag, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FeedPost {
  id: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  isLiked?: boolean;
}

interface ProfileFeedTabProps {
  posts: FeedPost[];
  user: {
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
}

export function ProfileFeedTab({ posts, user }: ProfileFeedTabProps) {
  return (
    <div className="divide-y divide-border">
      {posts.map((post) => (
        <FeedPostCard key={post.id} post={post} user={user} />
      ))}
      
      {posts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      )}
    </div>
  );
}

function FeedPostCard({ post, user }: { post: FeedPost; user: ProfileFeedTabProps["user"] }) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="p-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">{user.name}</span>
              {user.isVerified && (
                <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>
        <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <p className="text-sm mb-3 whitespace-pre-wrap">{post.content}</p>

      {/* Image/Video */}
      {post.image && (
        <div className="relative rounded-xl overflow-hidden mb-3">
          <img 
            src={post.image} 
            alt="" 
            className="w-full aspect-[4/3] object-cover"
          />
          
          {/* Product Tag */}
          {post.product && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass-strong">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium line-clamp-1">{post.product.name}</p>
                  <p className="text-xs text-primary font-bold">${post.product.price}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike}
            className="flex items-center gap-1.5 text-sm transition-colors"
          >
            <Heart className={cn(
              "h-5 w-5 transition-colors",
              liked ? "fill-primary text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(liked && "text-primary")}>{formatNumber(likeCount)}</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span>{formatNumber(post.comments)}</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="h-5 w-5" />
            <span>{formatNumber(post.shares)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
