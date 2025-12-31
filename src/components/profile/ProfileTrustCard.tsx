import { Shield, Coins, Award, TrendingUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileTrustCardProps {
  trustScore: number;
  coins: number;
  level: string;
  onViewDetails?: () => void;
}

export function ProfileTrustCard({ trustScore, coins, level, onViewDetails }: ProfileTrustCardProps) {
  const getTrustLabel = (score: number) => {
    if (score >= 95) return "Excellent";
    if (score >= 85) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Building";
  };

  const getTrustColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    return "text-orange-400";
  };

  const getLevelColor = (lvl: string) => {
    switch (lvl.toLowerCase()) {
      case "diamond": return "text-cyan-400";
      case "platinum": return "text-slate-300";
      case "gold": return "text-amber-400";
      case "silver": return "text-slate-400";
      default: return "text-orange-600";
    }
  };

  return (
    <div className="mx-4 sm:mx-6 mb-4">
      <div className="p-4 rounded-2xl glass border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trust & Rewards
          </h3>
          <button 
            onClick={onViewDetails}
            className="text-xs text-primary flex items-center gap-0.5 hover:underline"
          >
            Details <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {/* Trust Score */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/30">
            <div className="relative">
              <Shield className="h-8 w-8 text-emerald-400/20" />
              <Shield className={cn("h-8 w-8 absolute inset-0", getTrustColor(trustScore))} 
                style={{ clipPath: `inset(${100 - trustScore}% 0 0 0)` }} />
            </div>
            <div className="text-center">
              <p className={cn("text-xl font-bold", getTrustColor(trustScore))}>{trustScore}%</p>
              <p className="text-[10px] text-muted-foreground">{getTrustLabel(trustScore)}</p>
            </div>
          </div>

          {/* Coins */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/30">
            <Coins className="h-8 w-8 text-amber-400" />
            <div className="text-center">
              <p className="text-xl font-bold text-amber-400">{coins.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Coins</p>
            </div>
          </div>

          {/* Level */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary/30">
            <Award className={cn("h-8 w-8", getLevelColor(level))} />
            <div className="text-center">
              <p className={cn("text-xl font-bold", getLevelColor(level))}>{level}</p>
              <p className="text-[10px] text-muted-foreground">Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
