import { Users, UserPlus, FileText, ShoppingBag, Star, Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface ProfileStatsProps {
  followers: number;
  following: number;
  posts: number;
  purchases: number;
  reviews: number;
  coins: number;
  onStatClick?: (stat: string) => void;
}

export function ProfileStats({
  followers,
  following,
  posts,
  purchases,
  reviews,
  coins,
  onStatClick,
}: ProfileStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const stats: StatItem[] = [
    { label: "Followers", value: formatNumber(followers), icon: <Users className="h-4 w-4" /> },
    { label: "Following", value: formatNumber(following), icon: <UserPlus className="h-4 w-4" /> },
    { label: "Posts", value: formatNumber(posts), icon: <FileText className="h-4 w-4" /> },
    { label: "Purchases", value: formatNumber(purchases), icon: <ShoppingBag className="h-4 w-4" /> },
    { label: "Reviews", value: formatNumber(reviews), icon: <Star className="h-4 w-4" /> },
    { label: "Coins", value: formatNumber(coins), icon: <Coins className="h-4 w-4 text-amber-400" /> },
  ];

  return (
    <div className="px-4 sm:px-6 py-4">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => onStatClick?.(stat.label)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-xl",
              "glass hover:bg-secondary/50 transition-all duration-200",
              "hover:scale-105 active:scale-95"
            )}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">{stat.icon}</span>
              <span className="text-lg font-bold text-foreground">{stat.value}</span>
            </div>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
