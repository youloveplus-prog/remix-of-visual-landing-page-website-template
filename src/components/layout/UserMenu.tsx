import { 
  User, 
  Package, 
  FileText, 
  Heart, 
  LogOut,
  ChevronDown,
  Loader2,
  Settings,
  Crown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { user, isLoggedIn, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link 
        to="/auth"
        className="flex items-center gap-2 px-4 py-2 rounded-full gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg glow-primary"
      >
        Login
      </Link>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-full hover:bg-secondary/50 transition-all outline-none group">
        <div className="relative">
          <Avatar className="w-9 h-9 border-2 border-primary/30 group-hover:border-primary/60 transition-colors">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-background" />
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block group-hover:text-foreground transition-colors" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 bg-popover/95 backdrop-blur-xl border-border/50">
        {/* User Info Header */}
        <div className="px-3 py-3 mb-2 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/30">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <Crown className="w-3 h-3 text-gold" />
                <span className="text-[10px] font-medium text-gold">Premium Member</span>
              </div>
            </div>
          </div>
        </div>
        
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
            <Heart className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Wishlist</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem 
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
