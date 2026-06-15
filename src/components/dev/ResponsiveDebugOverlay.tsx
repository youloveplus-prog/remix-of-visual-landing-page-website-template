import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebarState } from "@/components/layout/AppLayout";

/**
 * Dev-only overlay that shows the current breakpoint and active layout
 * branch as you resize the viewport. Stripped out of production builds.
 */
export function ResponsiveDebugOverlay() {
  const [width, setWidth] = useState<number>(() =>
    typeof window === "undefined" ? 0 : window.innerWidth
  );
  const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarState();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!import.meta.env.DEV) return null;

  const breakpoint =
    width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop";

  const isHome = pathname === "/";
  let branch: "mobile-header" | "home-megamenu" | "slim-header+sidebar";
  if (isMobile) branch = "mobile-header";
  else if (isHome) branch = "home-megamenu";
  else branch = "slim-header+sidebar";

  const branchColor =
    branch === "mobile-header"
      ? "rgba(75,85,99,0.92)"
      : branch === "home-megamenu"
      ? "rgba(59,130,246,0.92)"
      : "rgba(245,158,11,0.92)";

  const sidebarLabel = branch === "slim-header+sidebar"
    ? (isCollapsed ? "collapsed" : "expanded")
    : "n/a";

  return (
    <div
      className="fixed top-2 right-2 z-[9999] rounded-lg px-2.5 py-1.5 text-[10px] font-mono leading-tight shadow-lg backdrop-blur-md pointer-events-none text-white space-y-0.5"
      style={{ background: branchColor }}
    >
      <div>{width}px · <b>{breakpoint}</b></div>
      <div>branch: {branch}</div>
      <div>sidebar: {sidebarLabel}</div>
    </div>
  );
}
