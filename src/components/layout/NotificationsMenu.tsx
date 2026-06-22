import { Bell, Heart, MessageCircle, Package, Radio, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'order' | 'live';
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'like', message: 'Sarah liked your post', time: '2m ago', read: false },
  { id: '2', type: 'comment', message: 'Alex commented on your review', time: '15m ago', read: false },
  { id: '3', type: 'order', message: 'Your order #1234 has shipped', time: '1h ago', read: true },
  { id: '4', type: 'live', message: 'StyleMaster is now live!', time: '2h ago', read: true },
];

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  order: Package,
  live: Radio,
};

const bgColorMap = {
  like: 'bg-pink-500/10',
  comment: 'bg-blue-500/10',
  order: 'bg-green-500/10',
  live: 'bg-primary/10',
};

const iconColorMap = {
  like: 'text-pink-500',
  comment: 'text-blue-500',
  order: 'text-green-500',
  live: 'text-primary',
};

export function NotificationsMenu() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} new</span>
          )}
        </div>
        <ScrollArea className="h-[320px]">
          <div className="p-2 space-y-1">
            {mockNotifications.map((notification) => {
              const Icon = iconMap[notification.type];
              return (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer rounded-lg transition-colors",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full shrink-0",
                    bgColorMap[notification.type]
                  )}>
                    <Icon className={cn("w-4 h-4", iconColorMap[notification.type])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm leading-snug",
                      !notification.read ? "font-medium text-foreground" : "text-muted-foreground"
                    )}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-primary hover:bg-primary/10">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
