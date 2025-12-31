import { useState } from "react";
import { Search, MoreVertical, BadgeCheck, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  user: {
    name: string;
    username: string;
    avatar: string;
    coverImage?: string;
    bio: string;
    location?: string;
    isVerified: boolean;
    trustScore: number;
  };
  onAvatarClick?: () => void;
}

export function ProfileHeader({ user, onAvatarClick }: ProfileHeaderProps) {
  const [showFullAvatar, setShowFullAvatar] = useState(false);
  
  const getTrustColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    return "text-orange-400";
  };

  const getTrustBg = (score: number) => {
    if (score >= 90) return "stroke-emerald-400";
    if (score >= 70) return "stroke-amber-400";
    return "stroke-orange-400";
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-36 sm:h-44 overflow-hidden relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: user.coverImage 
              ? `url(${user.coverImage})`
              : 'linear-gradient(135deg, hsl(var(--primary)/0.3), hsl(var(--accent)/0.2), hsl(var(--background)))'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
      </div>

      {/* Quick Actions */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button className="p-2 rounded-full glass hover:bg-secondary/50 transition-colors">
          <Search className="h-5 w-5 text-foreground" />
        </button>
        <button className="p-2 rounded-full glass hover:bg-secondary/50 transition-colors">
          <MoreVertical className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Avatar with Trust Ring */}
      <div className="absolute -bottom-16 left-4 sm:left-6">
        <div className="relative" onClick={onAvatarClick}>
          {/* Trust Score Ring */}
          <svg className="absolute -inset-2 w-32 h-32 sm:w-36 sm:h-36 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              className="stroke-muted/30"
              strokeWidth="3"
            />
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              className={cn(getTrustBg(user.trustScore))}
              strokeWidth="3"
              strokeDasharray={`${user.trustScore * 3.02} 302`}
              strokeLinecap="round"
            />
          </svg>
          
          <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background cursor-pointer hover:opacity-90 transition-opacity">
            <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
            <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
          </Avatar>
          
          {/* Trust Score Badge */}
          <div className={cn(
            "absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full glass-strong text-xs font-bold",
            getTrustColor(user.trustScore)
          )}>
            {user.trustScore}%
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-4 sm:px-6 space-y-2">
        {/* Name & Verification */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
          {user.isVerified && (
            <BadgeCheck className="h-5 w-5 text-primary fill-primary/20" />
          )}
        </div>
        
        {/* Username */}
        <p className="text-sm text-muted-foreground">@{user.username}</p>
        
        {/* Bio */}
        <p className="text-sm text-foreground/90 leading-relaxed max-w-md">{user.bio}</p>
        
        {/* Location */}
        {user.location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{user.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}
