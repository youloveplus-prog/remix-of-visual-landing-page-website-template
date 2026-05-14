import { Card } from "@/components/ui/card";
import { useIsAdmin } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";

export default function AdminSettings() {
  const { user } = useAuth();
  const { roles, isSuperAdmin } = useIsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Platform-wide controls.</p>
      </div>

      <Card className="p-4 space-y-2">
        <div className="font-medium">Your access</div>
        <div className="text-sm text-muted-foreground">Signed in as <span className="font-mono">{user?.email}</span></div>
        <div className="text-sm">Roles: {roles.join(", ") || "—"}</div>
        {isSuperAdmin && (
          <div className="text-xs text-primary">Super Admin — full platform privileges.</div>
        )}
      </Card>

      <Card className="p-4 space-y-2">
        <div className="font-medium">Notes</div>
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          <li>Role assignment is locked to <span className="font-mono">emysan.ceo@gmail.com</span> as Super Admin and is granted automatically on signup.</li>
          <li>To grant <span className="font-mono">admin</span> to another user, insert a row in <span className="font-mono">user_roles</span> via the SQL editor.</li>
          <li>All destructive actions in this panel respect Supabase RLS — non-admin sessions cannot reach this page.</li>
        </ul>
      </Card>
    </div>
  );
}
