import { Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * Floating AI tutor entry. Per Asikon spec the AI helper is surfaced as a FAB
 * rather than its own tab so the 5-tab bottom nav stays clean.
 * Shows on Home and Learn; hides on /ai-tutor itself.
 */
export function AiTutorFab() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const allowed = pathname === "/" || pathname.startsWith("/learn");
  if (!allowed) return null;

  return (
    <button
      onClick={() => navigate("/ai-tutor")}
      aria-label="Open AI tutor"
      style={{ bottom: "calc(var(--bottom-nav-h, 64px) + env(safe-area-inset-bottom, 0px) + 16px)" }}
      className={cn(
        "fixed right-4 z-50 md:bottom-8",
        "h-14 px-5 rounded-2xl",
        "gradient-primary glow-primary",
        "flex items-center gap-2",
        "shadow-xl shadow-primary/25",
        "transition-all duration-300",
        "hover:scale-105 hover:shadow-2xl hover:shadow-primary/40",
        "active:scale-95"
      )}
    >
      <Sparkles className="h-5 w-5 text-primary-foreground" aria-hidden />
      <span className="text-sm font-semibold text-primary-foreground">AI tutor</span>
    </button>
  );
}
