import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useUserRole";
import { ShieldAlert, Loader2, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isAdmin, isLoading } = useIsAdmin();

  if (loading || isLoading) {
    return (
      <div className="min-h-dvh grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth?redirect=/asikonasik" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-dvh grid place-items-center px-6 py-12 bg-background">
        <div className="relative w-full max-w-md animate-fade-in">
          <div
            className="absolute -inset-4 rounded-[2rem] blur-3xl opacity-70"
            style={{ background: "var(--gradient-primary-soft)" }}
            aria-hidden
          />
          <div className="relative glass-strong rounded-3xl p-8 text-center space-y-5">
            <div className="mx-auto h-16 w-16 rounded-2xl grid place-items-center ring-1 ring-destructive/30 bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Error 403 · Restricted
              </div>
              <h1 className="text-2xl font-bold">
                <span className="text-gradient">asikonasik</span> is admins only
              </h1>
              <p className="text-sm text-muted-foreground">
                The control panel is restricted to verified administrators. If
                you believe this is a mistake, contact the platform owner.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button asChild variant="premium" className="flex-1">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to app
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/auth?redirect=/asikonasik">
                  <LogIn className="h-4 w-4 mr-2" />
                  Switch account
                </Link>
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground pt-2">
              Signed in as <span className="text-foreground">{user.email}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
