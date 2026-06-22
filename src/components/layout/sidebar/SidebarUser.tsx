import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, User, Loader2, ShoppingBag, Heart, Package, Settings, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

interface SidebarUserProps {
  onClose?: () => void;
}

function QuickAction({
  to,
  icon,
  label,
  count,
  onClose,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  onClose?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="group relative flex flex-col items-center justify-center gap-1 rounded-2xl bg-background/60 hover:bg-primary/10 active:scale-[0.97] border border-border/50 hover:border-primary/30 px-2 py-2.5 transition-all"
    >
      <div className="relative text-foreground/80 group-hover:text-primary transition-colors">
        {icon}
        {count !== undefined && count > 0 && (
          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
        {label}
      </span>
    </Link>
  );
}

export function SidebarUser({ onClose }: SidebarUserProps) {
  const { user, isLoggedIn, loading } = useAuth();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

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

      {/* Quick row: Cart · Saved (the only two with live counts) */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <Link
          to="/cart"
          onClick={onClose}
          className="flex items-center justify-between h-10 px-3 rounded-[12px] bg-foreground/[0.04] hover:bg-foreground/[0.07] transition-colors"
        >
          <span className="flex items-center gap-2 text-[13px] font-medium text-foreground/80">
            <ShoppingBag className="w-4 h-4" /> Cart
          </span>
          {cartCount > 0 && (
            <span className="text-[10px] font-bold text-primary-foreground bg-primary rounded-full min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center tabular-nums">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>
        <Link
          to="/wishlist"
          onClick={onClose}
          className="flex items-center justify-between h-10 px-3 rounded-[12px] bg-foreground/[0.04] hover:bg-foreground/[0.07] transition-colors"
        >
          <span className="flex items-center gap-2 text-[13px] font-medium text-foreground/80">
            <Heart className="w-4 h-4" /> Saved
          </span>
          {wishlistCount > 0 && (
            <span className="text-[10px] font-bold text-foreground/80 bg-foreground/10 rounded-full min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center tabular-nums">
              {wishlistCount > 99 ? "99+" : wishlistCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
