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
    if (score >= 70) return "text-primary";
    return "text-muted-foreground";
  };

  const getLevelColor = (lvl: string) => {
    switch (lvl.toLowerCase()) {
      case "diamond": return "text-primary";
      case "platinum": return "text-slate-300";
      case "gold": return "text-primary";
      case "silver": return "text-slate-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="mx-4 sm:mx-6 mb-4">
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-medium tracking-tight flex items-center gap-2 text-foreground/80">
            <TrendingUp className="h-3.5 w-3.5 text-foreground/60" />
            Trust & Rewards
          </h3>
          <button
            onClick={onViewDetails}
            className="text-[12px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
          >
            Details <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Trust Score */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border">
            <Shield className="h-6 w-6 text-foreground/70" />
            <div className="text-center">
              <p className={cn("text-[17px] font-semibold tabular-nums", getTrustColor(trustScore))}>{trustScore}%</p>
              <p className="text-[10.5px] text-muted-foreground">{getTrustLabel(trustScore)}</p>
            </div>
          </div>

          {/* Coins */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border">
            <Coins className="h-6 w-6 text-foreground/70" />
            <div className="text-center">
              <p className="text-[17px] font-semibold tabular-nums text-foreground">{coins.toLocaleString()}</p>
              <p className="text-[10.5px] text-muted-foreground">Coins</p>
            </div>
          </div>

          {/* Level */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/40 border border-border">
            <Award className={cn("h-6 w-6", getLevelColor(level))} />
            <div className="text-center">
              <p className={cn("text-[17px] font-semibold", getLevelColor(level))}>{level}</p>
              <p className="text-[10.5px] text-muted-foreground">Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
