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

/**
 * Three-cell identity stat row (Posts · Followers · Following) plus
 * a separate XP/level progress card. Mobile-first: large numerals,
 * 44px+ tap targets, tabular-nums for stable number transitions.
 */
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
    { key: "Posts", value: formatCount(posts), onClick: onPostsClick, label: `${posts} posts` },
    {
      key: "Followers",
      value: formatCount(followers),
      onClick: onFollowersClick,
      label: `${followers} followers`,
    },
    {
      key: "Following",
      value: formatCount(following),
      onClick: onFollowingClick,
      label: `${following} following`,
    },
  ];

  // Progress within current level (every 100 XP = 1 level)
  const xpInLevel = xp % 100;
  const xpToNext = 100 - xpInLevel;
  const progress = Math.min(100, Math.max(0, xpInLevel));

  return (
    <div className="px-4 pt-4 space-y-3">
      <div
        className="grid grid-cols-3 rounded-xl border border-border bg-card overflow-hidden"
        role="group"
        aria-label="Profile statistics"
      >
        {stats.map((s, i) => (
          <button
            key={s.key}
            onClick={s.onClick}
            aria-label={s.label}
            className={cn(
              "flex flex-col items-center justify-center py-3 min-h-[60px] text-center transition-colors focus-ring",
              "hover:bg-secondary/60",
              i !== 0 && "border-l border-border",
            )}
          >
            <span className="text-[17px] font-semibold tabular-nums text-foreground leading-none">
              {s.value}
            </span>
            <span className="mt-1 text-[10.5px] uppercase tracking-wide text-muted-foreground">
              {s.key}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onXpClick || onLevelClick}
        aria-label={`Level ${level}, ${xpInLevel} of 100 XP toward next level`}
        className="w-full rounded-xl border border-border bg-card p-3 text-left transition-colors hover:bg-secondary/60 focus-ring"
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-[14px] font-semibold tracking-tight">Lv. {level}</span>
            <span className="text-[11.5px] text-muted-foreground tabular-nums truncate">
              {formatCount(xp)} XP total
            </span>
          </div>
          <span className="text-[11.5px] text-muted-foreground tabular-nums shrink-0">
            {xpToNext} to Lv. {level + 1}
          </span>
        </div>
        <div
          className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </button>
    </div>
  );
}
