import { useEffect, useRef, useState } from "react";
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

/** Animated count-up that respects prefers-reduced-motion. */
function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(target);
  const startRef = useRef(target);
  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || target === startRef.current) {
      setValue(target);
      startRef.current = target;
      return;
    }
    const from = startRef.current;
    const to = target;
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else startRef.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

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
  const postsAnim = useCountUp(posts);
  const followersAnim = useCountUp(followers);
  const followingAnim = useCountUp(following);
  const xpAnim = useCountUp(xp);

  const stats = [
    { key: "Posts", value: formatCount(postsAnim), onClick: onPostsClick, label: `${posts} posts` },
    { key: "Followers", value: formatCount(followersAnim), onClick: onFollowersClick, label: `${followers} followers` },
    { key: "Following", value: formatCount(followingAnim), onClick: onFollowingClick, label: `${following} following` },
  ];

  const xpInLevel = xp % 100;
  const xpToNext = 100 - xpInLevel;
  const progress = Math.min(100, Math.max(0, xpInLevel));
  const nearLevelUp = progress >= 80;

  return (
    <div className="px-4 pt-4 space-y-3">
      <div
        className="grid grid-cols-3 rounded-2xl border border-border liquid-glass overflow-hidden shadow-sm"
        role="group"
        aria-label="Profile statistics"
      >
        {stats.map((s, i) => (
          <button
            key={s.key}
            onClick={s.onClick}
            aria-label={s.label}
            className={cn(
              "flex flex-col items-center justify-center py-3.5 min-h-[64px] text-center transition-colors focus-ring",
              "hover:bg-secondary/60 active:bg-secondary",
              i !== 0 && "border-l border-border",
            )}
          >
            <span className="font-display text-[18px] font-semibold tabular-nums text-foreground leading-none">
              {s.value}
            </span>
            <span className="mt-1.5 text-[10.5px] uppercase tracking-wider text-muted-foreground font-grotesk">
              {s.key}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onXpClick || onLevelClick}
        aria-label={`Level ${level}, ${xpInLevel} of 100 XP toward next level`}
        className="w-full rounded-2xl border border-border liquid-glass p-3.5 text-left transition-colors hover:bg-secondary/60 focus-ring shadow-sm"
      >
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="font-display text-[14px] font-semibold tracking-tight">Lv. {level}</span>
            <span className="text-[11.5px] text-muted-foreground tabular-nums truncate">
              {formatCount(xpAnim)} XP total
            </span>
          </div>
          <span className="text-[11.5px] text-muted-foreground tabular-nums shrink-0">
            {xpToNext} to Lv. {level + 1}
          </span>
        </div>
        <div
          className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className={cn(
              "h-full rounded-full gradient-primary transition-[width] duration-700 ease-out",
              nearLevelUp && "glow-primary",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </button>
    </div>
  );
}
