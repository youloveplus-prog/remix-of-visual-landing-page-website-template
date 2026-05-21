import { cn, formatCount } from "@/lib/utils";

interface ProfileStatsProps {
  posts: number;
  followers: number;
  following: number;
  xp: number;
  level: number;
  onPostsClick?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  onXpClick?: () => void;
  onLevelClick?: () => void;
}

/** Instagram-style compact stat row (5 cells, tappable). */
export function ProfileStats({
  posts,
  followers,
  following,
  xp,
  level,
  onPostsClick,
  onFollowersClick,
  onFollowingClick,
  onXpClick,
  onLevelClick,
}: ProfileStatsProps) {
  const stats = [
    { key: "Posts", value: formatCount(posts), onClick: onPostsClick },
    { key: "Followers", value: formatCount(followers), onClick: onFollowersClick },
    { key: "Following", value: formatCount(following), onClick: onFollowingClick },
    { key: "XP", value: formatCount(xp), onClick: onXpClick },
    { key: "Level", value: `Lv.${level}`, onClick: onLevelClick },
  ];
  return (
    <div className="px-4 pt-4">
      <div className="grid grid-cols-5 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden">
        {stats.map((s, i) => (
          <button
            key={s.key}
            onClick={s.onClick}
            className={cn(
              "flex flex-col items-center justify-center py-2.5 text-center transition-colors",
              "hover:bg-secondary/40 active:scale-[0.98]",
              i !== 0 && "border-l border-border/40",
            )}
          >
            <span className="text-base font-bold tabular-nums text-foreground">{s.value}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.key}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
