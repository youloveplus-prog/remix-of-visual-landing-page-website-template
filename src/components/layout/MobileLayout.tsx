import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-dvh bg-background">
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
