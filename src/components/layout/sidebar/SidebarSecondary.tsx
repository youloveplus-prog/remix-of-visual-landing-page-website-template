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
        "relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all active:scale-[0.98]",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
      )}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-primary"
        />
      )}
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

function GroupHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="px-3 pt-3 pb-1.5">
      <h4 className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-[0.12em] flex items-center gap-2">
        {icon}
        {label}
      </h4>
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
    <div className="space-y-0.5 px-2">
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
    <div className="py-2 border-t border-border/60 mt-2">
      <GroupHeader icon={<Activity className="w-3.5 h-3.5" />} label="Activity" />
      {renderGroup(activity)}
      <GroupHeader icon={<LifeBuoy className="w-3.5 h-3.5" />} label="Support" />
      {renderGroup(support)}
      <GroupHeader icon={<Scale className="w-3.5 h-3.5" />} label="Legal" />
      {renderGroup(legal)}
    </div>
  );
}
