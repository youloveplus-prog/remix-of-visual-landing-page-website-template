import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ShoppingBag } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { Price } from "@/lib/currency";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, dot: "bg-amber-500" },
  processing: { label: "Processing", icon: Package, dot: "bg-blue-500" },
  shipped: { label: "Shipped", icon: Truck, dot: "bg-violet-500" },
  delivered: { label: "Delivered", icon: CheckCircle, dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", icon: XCircle, dot: "bg-rose-500" },
} as const;

const FILTERS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const;

const Orders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading } = useOrders();
  const [filter, setFilter] = useState<typeof FILTERS[number]>("all");

  const visible = useMemo(
    () => (filter === "all" ? orders : orders?.filter((o) => o.status === filter)) || [],
    [orders, filter],
  );

  if (authLoading) {
    return <AppLayout><MobilePage maxWidth="standard"><Skeleton className="h-8 w-40" /></MobilePage></AppLayout>;
  }
  if (!user) { navigate("/auth"); return null; }

  return (
    <AppLayout>
      <MobilePage maxWidth="standard" spacing="space-y-6">
        <PageHero eyebrow="History" title="Your orders" subtitle="Track and review past purchases." />

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 capitalize rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                filter === f ? "bg-foreground text-background" : "bg-muted/60 text-muted-foreground hover:text-foreground",
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {f === "all" ? "All" : statusConfig[f].label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-display text-lg font-semibold mb-1">No orders {filter !== "all" ? `in ${statusConfig[filter as keyof typeof statusConfig].label.toLowerCase()}` : "yet"}</h2>
            <p className="text-sm text-muted-foreground mb-5">Start shopping to see your orders here.</p>
            <Link to="/shop"><Button>Start shopping</Button></Link>
          </div>
        ) : (
          <ul className="divide-y divide-border/40 -mt-2">
            {visible.map((order) => {
              const cfg = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
              const items = order.order_items || [];
              return (
                <li key={order.id}>
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-4 py-4 active:opacity-60 transition-opacity"
                  >
                    {/* Stacked thumbs */}
                    <div className="flex -space-x-3 shrink-0">
                      {items.slice(0, 3).map((it, i) => (
                        <div key={it.id} className="w-12 h-12 rounded-xl overflow-hidden bg-muted ring-2 ring-background" style={{ zIndex: 3 - i }}>
                          <img src={it.products?.image_url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {items.length === 0 && (
                        <div className="w-12 h-12 rounded-xl bg-muted grid place-items-center"><Package className="h-5 w-5 text-muted-foreground" /></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                        <span className="text-[12px] font-medium text-foreground/80">{cfg.label}</span>
                        <span className="text-border">·</span>
                        <span className="text-[12px] text-muted-foreground tabular-nums">#{order.id.slice(0, 8)}</span>
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        {format(new Date(order.created_at || ""), "MMM dd, yyyy")} · {items.length} item{items.length === 1 ? "" : "s"}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <Price amount={order.total} className="font-semibold text-[15px]" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </MobilePage>
    </AppLayout>
  );
};

export default Orders;
