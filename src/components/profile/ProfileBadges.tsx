import { ShoppingBag, Palette, Star, Shield, Award, Sparkles, GraduationCap, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Badge {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  hint: string;
}

interface ProfileBadgesProps {
  badges: string[];
  learnerSessions?: number;
  learnerQuizzes?: number;
}

const ALL_BADGES: Badge[] = [
  { id: "buyer", name: "Learner", icon: <ShoppingBag className="h-3.5 w-3.5" />, color: "text-blue-400 bg-blue-400/10 border-blue-400/20", hint: "Complete your first lesson" },
  { id: "creator", name: "Creator", icon: <Sparkles className="h-3.5 w-3.5" />, color: "text-purple-400 bg-purple-400/10 border-purple-400/20", hint: "Publish 5 community posts" },
  { id: "designer", name: "Note Maker", icon: <Palette className="h-3.5 w-3.5" />, color: "text-pink-400 bg-pink-400/10 border-pink-400/20", hint: "Create 3 notes" },
  { id: "reviewer", name: "Top Reviewer", icon: <Star className="h-3.5 w-3.5" />, color: "text-amber-400 bg-amber-400/10 border-amber-400/20", hint: "Write 3 product reviews" },
  { id: "trusted", name: "Verified Student", icon: <Shield className="h-3.5 w-3.5" />, color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", hint: "Get verified by Asikon" },
  { id: "elite", name: "Scholar", icon: <Award className="h-3.5 w-3.5" />, color: "text-primary bg-primary/10 border-primary/20", hint: "Reach Level 10" },
];

export function ProfileBadges({ badges, learnerSessions = 0, learnerQuizzes = 0 }: ProfileBadgesProps) {
  const totalLearn = learnerSessions + learnerQuizzes;
  const hasLearner = totalLearn > 0;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="px-4 sm:px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {hasLearner && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                "text-primary bg-primary/10 border-primary/20"
              )}
              title={`${learnerSessions} tutor session${learnerSessions === 1 ? "" : "s"} • ${learnerQuizzes} quiz${learnerQuizzes === 1 ? "" : "zes"}`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>AI Learner · {totalLearn}</span>
            </div>
          )}
          {ALL_BADGES.map((badge) => {
            const earned = badges.includes(badge.id);
            if (earned) {
              return (
                <div
                  key={badge.id}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                    badge.color
                  )}
                >
                  {badge.icon}
                  <span>{badge.name}</span>
                </div>
              );
            }
            return (
              <Tooltip key={badge.id}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-border opacity-40 cursor-help",
                      "text-muted-foreground bg-muted/30"
                    )}
                    style={{ filter: "grayscale(1)" }}
                  >
                    {badge.icon}
                    <span>{badge.name}</span>
                    <Lock className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">{badge.hint}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
