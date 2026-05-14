import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingBag, MessagesSquare, Palette, Tags } from "lucide-react";

function useCount(table: string) {
  return useQuery({
    queryKey: ["admin-count", table],
    queryFn: async () => {
      const { count, error } = await supabase
        .from(table as any)
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
}

const stats = [
  { table: "profiles", label: "Users", icon: Users },
  { table: "products", label: "Products", icon: Package },
  { table: "categories", label: "Categories", icon: Tags },
  { table: "orders", label: "Orders", icon: ShoppingBag },
  { table: "posts", label: "Community Posts", icon: MessagesSquare },
  { table: "pod_designs", label: "POD Designs", icon: Palette },
];

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Real-time snapshot of every key area of the platform.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <StatCard key={s.table} {...s} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ table, label, icon: Icon }: { table: string; label: string; icon: any }) {
  const { data, isLoading } = useCount(table);
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs text-muted-foreground font-medium">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? "…" : data?.toLocaleString() ?? 0}
        </div>
      </CardContent>
    </Card>
  );
}
