import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SidebarFooterProps {
  onClose?: () => void;
}

export function SidebarFooter({ onClose }: SidebarFooterProps) {
  const { signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();

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

  if (!isLoggedIn) {
    return (
      <div
        className="mt-auto px-4 pt-2 pb-4 border-t border-border/60"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)" }}
      >
        <p className="text-center text-[10px] text-muted-foreground/70 tracking-wide">
          ASIKON · v1.0.0
        </p>
      </div>
    );
  }

  return (
    <div
      className="mt-auto px-4 pt-3 pb-4 border-t border-border/60 bg-foreground/[0.015]"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 1rem)" }}
    >
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Log out"
        className="w-full h-12 rounded-[14px] bg-foreground/[0.06] hover:bg-foreground/[0.09] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-foreground/90"
      >
        <LogOut className="w-[18px] h-[18px]" />
        <span className="text-[15px] font-bold">Log Out</span>
      </button>
      <p className="mt-3 text-center text-[10px] text-muted-foreground/70 tracking-wide">
        ASIKON · v1.0.0
      </p>
    </div>
  );
}
