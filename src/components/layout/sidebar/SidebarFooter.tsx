import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  onClose?: () => void;
}

export function SidebarFooter({ onClose }: SidebarFooterProps) {
  const { theme, setTheme } = useTheme();
  const { signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      onClose?.();
      navigate("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <div
      className="mt-auto px-4 pt-3 pb-4 border-t border-black/5 bg-foreground/[0.015]"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)" }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle dark mode"
          className="flex-1 h-12 px-4 rounded-[16px] bg-card border border-black/5 flex items-center gap-3 text-foreground/80 active:scale-[0.98] transition-transform shadow-sm"
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span className="text-sm font-semibold">Dark Mode</span>
          <span
            className={cn(
              "ml-auto relative w-9 h-5 rounded-full transition-colors",
              isDark ? "bg-primary" : "bg-foreground/15"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-4 h-4 bg-background rounded-full shadow-sm transition-all",
                isDark ? "left-[18px]" : "left-0.5"
              )}
            />
          </span>
        </button>
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-12 h-12 rounded-[16px] bg-destructive/10 text-destructive border border-destructive/15 flex items-center justify-center active:scale-[0.95] transition-transform"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
      <p className="mt-3 text-center text-[10px] text-muted-foreground/70 tracking-wide">
        ASIKON · v1.0.0
      </p>
    </div>
  );
}
