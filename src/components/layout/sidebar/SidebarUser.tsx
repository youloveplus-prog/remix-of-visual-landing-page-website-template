import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface SidebarUserProps {
  onClose?: () => void;
}

export function SidebarUser({ onClose }: SidebarUserProps) {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="p-4 border-b border-border">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Welcome!</h3>
            <p className="text-sm text-muted-foreground">Sign in to access all features</p>
          </div>
          <div className="flex gap-2">
            <Link to="/auth" onClick={onClose} className="flex-1">
              <Button className="w-full" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/auth" onClick={onClose} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={onClose}>
            Continue as Guest
          </Button>
        </div>
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12 border-2 border-primary">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-foreground truncate">{displayName}</h3>
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          <Badge variant="secondary" className="mt-1 text-xs">
            Verified Buyer
          </Badge>
        </div>
      </div>
      <Link to="/profile" onClick={onClose}>
        <Button variant="outline" size="sm" className="w-full mt-3">
          View Profile
        </Button>
      </Link>
    </div>
  );
}
