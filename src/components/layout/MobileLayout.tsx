import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      <main style={{ paddingBottom: "var(--bottom-nav-h)" }}>{children}</main>
      <BottomNav />
    </div>
  );
}
