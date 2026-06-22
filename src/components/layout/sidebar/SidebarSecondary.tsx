import {
  Package,
  Heart,
  Trophy,
  Bell,
  HelpCircle,
  Info,
  Mail,
  FileText,
  ShieldCheck,
  Activity,
  LifeBuoy,
  Scale,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Item {
  icon: React.ReactNode;
  label: string;
  href: string;
}

function NavItem({
  icon,
  label,
  href,
  isActive,
  onClick,
}: Item & { isActive?: boolean; onClick?: () => void }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 h-12 px-3 rounded-[14px] transition-colors active:scale-[0.99]",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground"
      )}
    >
      <span className={cn("flex-shrink-0", isActive ? "text-primary" : "text-foreground/60")}>
        {icon}
      </span>
      <span className={cn("text-sm truncate", isActive ? "font-semibold" : "font-medium")}>{label}</span>
    </Link>
  );
}

function GroupHeader({ label }: { icon?: React.ReactNode; label: string }) {
  return (
    <div className="px-3 pt-4 pb-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

interface SidebarSecondaryProps {
  onClose?: () => void;
}

export function SidebarSecondary({ onClose }: SidebarSecondaryProps) {
  const location = useLocation();

  const activity: Item[] = [
    { icon: <Package className="w-4 h-4" />, label: "My Orders", href: "/orders" },
    { icon: <Heart className="w-4 h-4" />, label: "Wishlist", href: "/wishlist" },
    { icon: <Bell className="w-4 h-4" />, label: "Notifications", href: "/notifications" },
    { icon: <Trophy className="w-4 h-4" />, label: "Leaderboard", href: "/leaderboard" },
  ];

  const support: Item[] = [
    { icon: <HelpCircle className="w-4 h-4" />, label: "Help & FAQ", href: "/help" },
    { icon: <Mail className="w-4 h-4" />, label: "Contact", href: "/contact" },
    { icon: <Info className="w-4 h-4" />, label: "About ASIKON", href: "/about" },
  ];

  const legal: Item[] = [
    { icon: <FileText className="w-4 h-4" />, label: "Terms", href: "/terms" },
    { icon: <ShieldCheck className="w-4 h-4" />, label: "Privacy", href: "/privacy" },
  ];

  const renderGroup = (items: Item[]) => (
    <div className="space-y-1 px-4">
      {items.map((item) => (
        <NavItem
          key={item.href}
          {...item}
          isActive={location.pathname === item.href}
          onClick={onClose}
        />
      ))}
    </div>
  );

  return (
    <div className="pt-2 pb-4 mt-2 border-t border-black/5">
      <GroupHeader label="Activity" />
      {renderGroup(activity)}
      <GroupHeader label="Support" />
      {renderGroup(support)}
      <GroupHeader label="Legal" />
      {renderGroup(legal)}
    </div>
  );
}
