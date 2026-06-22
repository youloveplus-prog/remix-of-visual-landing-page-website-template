import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ShieldCheck, User, Loader2, ShoppingBag, Heart, Package, Settings } from "lucide-react";
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
    <div className="relative px-5 pt-6 pb-4">
      <Link
        to="/profile"
        onClick={onClose}
        className="block rounded-[20px] bg-card p-4 shadow-sm border border-black/5 active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <Avatar className="w-12 h-12 ring-2 ring-background shadow-sm">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-[17px] leading-tight text-foreground truncate flex items-center gap-1.5">
              <span className="truncate">{displayName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
          </div>
        </div>
      </Link>

      {/* Coin pill */}
      <div className="mt-3 flex">
        <Link
          to="/leaderboard"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-3 py-1.5 hover:bg-primary/10 transition-colors"
        >
          <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-primary-foreground" />
          </span>
          <span className="text-xs font-semibold text-primary tabular-nums">1,240 Coins</span>
        </Link>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-1.5 mt-3">
        <QuickAction to="/cart" icon={<ShoppingBag className="w-4 h-4" />} label="Cart" count={cartCount} onClose={onClose} />
        <QuickAction to="/wishlist" icon={<Heart className="w-4 h-4" />} label="Saved" count={wishlistCount} onClose={onClose} />
        <QuickAction to="/orders" icon={<Package className="w-4 h-4" />} label="Orders" onClose={onClose} />
        <QuickAction to="/settings" icon={<Settings className="w-4 h-4" />} label="Settings" onClose={onClose} />
      </div>
    </div>
  );
}
