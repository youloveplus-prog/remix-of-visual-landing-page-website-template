import { 
  ShoppingBag, Star, Coins, Trophy, TrendingUp, 
  Package, Award, MessageCircle, Heart 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "purchase" | "review" | "coins" | "achievement" | "levelup" | "order" | "like" | "comment";
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    amount?: number;
    productName?: string;
    productImage?: string;
    level?: string;
    badge?: string;
  };
}

interface ProfileActivityTabProps {
  activities: ActivityItem[];
}

const activityConfig = {
  purchase: { icon: ShoppingBag, color: "text-blue-400 bg-blue-400/10" },
  review: { icon: Star, color: "text-amber-400 bg-amber-400/10" },
  coins: { icon: Coins, color: "text-yellow-400 bg-yellow-400/10" },
  achievement: { icon: Trophy, color: "text-purple-400 bg-purple-400/10" },
  levelup: { icon: TrendingUp, color: "text-emerald-400 bg-emerald-400/10" },
  order: { icon: Package, color: "text-cyan-400 bg-cyan-400/10" },
  like: { icon: Heart, color: "text-pink-400 bg-pink-400/10" },
  comment: { icon: MessageCircle, color: "text-indigo-400 bg-indigo-400/10" },
};

export function ProfileActivityTab({ activities }: ProfileActivityTabProps) {
  return (
    <div className="p-4">
      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
        
        {/* Activity Items */}
        <div className="space-y-4">
          {activities.map((activity) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;
            
            return (
              <div key={activity.id} className="relative flex gap-4">
                {/* Icon */}
                <div className={cn(
                  "relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                  config.color
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {activity.timestamp}
                    </span>
                  </div>
                  
                  {/* Metadata Card */}
                  {activity.metadata?.productImage && (
                    <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-secondary/30 max-w-xs">
                      <img 
                        src={activity.metadata.productImage} 
                        alt=""
                        className="w-10 h-10 rounded object-cover"
                      />
                      <p className="text-xs line-clamp-2">{activity.metadata.productName}</p>
                    </div>
                  )}
                  
                  {/* Coins/Amount */}
                  {activity.type === "coins" && activity.metadata?.amount && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-medium">
                      <Coins className="h-3 w-3" />
                      +{activity.metadata.amount} coins
                    </div>
                  )}
                  
                  {/* Level Up */}
                  {activity.type === "levelup" && activity.metadata?.level && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-medium">
                      <Award className="h-3 w-3" />
                      {activity.metadata.level}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activities.length === 0 && (
        <div className="py-16 text-center">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No activity yet</p>
        </div>
      )}
    </div>
  );
}
