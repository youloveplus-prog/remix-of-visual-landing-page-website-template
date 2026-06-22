import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, User, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface SidebarUserProps {
  onClose?: () => void;
}

export function SidebarUser({ onClose }: SidebarUserProps) {
  const { user, isLoggedIn, loading } = useAuth();


  if (loading) {
    return (
      <div className="p-4 border-b border-border/60">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="relative p-4 border-b border-border/60">
        <div className="rounded-3xl border border-border/60 bg-background/70 p-4 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center ring-1 ring-primary/20">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Welcome to ASIKON</h3>
            <p className="text-xs text-muted-foreground">Sign in to unlock everything</p>
          </div>
          <div className="flex gap-2">
            <Link to="/auth" onClick={onClose} className="flex-1">
              <Button className="w-full" size="sm">Login</Button>
            </Link>
            <Link to="/auth" onClick={onClose} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const cartCount = cart?.length ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  return (
    <div className="relative px-4 pt-5 pb-3">
      <Link
        to="/profile"
        onClick={onClose}
        className="flex items-center gap-3 active:opacity-80 transition-opacity"
      >
        <div className="relative flex-shrink-0">
          <Avatar className="w-11 h-11 ring-1 ring-black/5">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-base">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-[15px] leading-tight text-foreground truncate flex items-center gap-1">
            <span className="truncate">{displayName}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          </h3>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
        </div>
        <Link
          to="/leaderboard"
          onClick={(e) => { e.stopPropagation(); onClose?.(); }}
          className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 hover:bg-primary/15 transition-colors"
          aria-label="1,240 coins"
        >
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-[11px] font-bold text-primary tabular-nums leading-none">1,240</span>
        </Link>
      </Link>

      {/* "View your profile" link, FB-style */}
      <Link
        to="/profile"
        onClick={onClose}
        className="mt-3 flex items-center justify-center h-9 rounded-[12px] bg-foreground/[0.04] hover:bg-foreground/[0.07] transition-colors text-[12px] font-semibold text-foreground/75"
      >
        View your profile
      </Link>
    </div>
  );
}
