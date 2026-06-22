import { useParams, Link, useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, XCircle, MapPin, CreditCard, Sparkles, ShoppingBag, MessageCircle, LifeBuoy } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
import { DetailSection } from "@/components/ui/detail-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CrossLinkChips } from "@/components/connect/CrossLinkChips";
import { RelatedRail } from "@/components/connect/RelatedRail";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useOrder } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { Price } from "@/lib/currency";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "pending", label: "Placed", icon: Clock },
  { id: "processing", label: "Confirmed", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle },
] as const;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: order, isLoading } = useOrder(id || "");

  if (authLoading) return <AppLayout><MobilePage maxWidth="standard"><Skeleton className="h-8 w-40" /></MobilePage></AppLayout>;
  if (!user) { navigate("/auth"); return null; }

  if (isLoading) {
    return (
      <AppLayout>
        <MobilePage maxWidth="standard">
          <Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-2xl" />
        </MobilePage>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <MobilePage maxWidth="standard">
          <div className="py-20 text-center">
            <h1 className="font-display text-xl font-semibold mb-1">Order not found</h1>
            <p className="text-sm text-muted-foreground mb-5">The order you're looking for doesn't exist.</p>
            <Link to="/orders"><Button>View all orders</Button></Link>
          </div>
        </MobilePage>
      </AppLayout>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.id === order.status);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;
  const isCancelled = order.status === "cancelled";

  return (
    <AppLayout>
      <SEO
        title={id ? `Order #${String(id).slice(0, 8)}` : "Order details"}
        description="Track the status, items, and delivery details of your Asikon order."
        noIndex
      />
      <MobilePage maxWidth="standard" spacing="space-y-8">
        <Breadcrumbs
          eyebrow="Order"
          items={[
            { label: "Orders", to: "/orders" },
            { label: `#${order.id.slice(0, 8)}` },
          ]}
        />


        <PageHero
          eyebrow={`Order #${order.id.slice(0, 8)}`}
          title={isCancelled ? "Cancelled" : STEPS[activeIdx].label}
          subtitle={`Placed ${format(new Date(order.created_at || ""), "MMMM dd, yyyy")}`}
        />

        {/* Timeline */}
        <DetailSection divided={false}>
          {isCancelled ? (
            <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="font-semibold text-sm">Order cancelled</p>
                <p className="text-xs text-muted-foreground">This order is no longer being processed.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Horizontal on desktop */}
              <div className="hidden sm:flex items-center">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= activeIdx;
                  return (
                    <div key={step.id} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
                        <div className={cn("h-9 w-9 rounded-full grid place-items-center transition-colors", done ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={cn("text-[11px]", done ? "text-foreground font-medium" : "text-muted-foreground")}>{step.label}</span>
                      </div>
                      {i < STEPS.length - 1 && <div className={cn("h-px flex-1 -mt-6 mx-1", i < activeIdx ? "bg-foreground" : "bg-border")} />}
                    </div>
                  );
                })}
              </div>
              {/* Vertical on mobile */}
              <ol className="sm:hidden relative pl-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= activeIdx;
                  return (
                    <li key={step.id} className="relative pb-4 last:pb-0">
                      <div className={cn("absolute -left-6 top-0 h-6 w-6 rounded-full grid place-items-center", done ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <p className={cn("text-[13px]", done ? "font-medium" : "text-muted-foreground")}>{step.label}</p>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </DetailSection>

        {/* Items */}
        <DetailSection title="Items">
          <ul className="divide-y divide-border/40">
            {order.order_items?.map((item) => (
              <li key={item.id} className="flex gap-3 py-3">
                <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0">
                  <img src={item.products?.image_url || "/placeholder.svg"} alt={item.products?.name || ""} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[14px] line-clamp-1">{item.products?.name || "Product"}</p>
                  <p className="text-[12px] text-muted-foreground">Qty {item.quantity}</p>
                </div>
                <Price amount={item.price} className="font-semibold text-[14px]" />
              </li>
            ))}
          </ul>
          <Separator />
          <div className="space-y-1.5 text-[13px]">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">${(order.total - 10).toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="tabular-nums">$10.00</span></div>
            <div className="flex justify-between font-semibold text-[15px] pt-2"><span>Total</span><span className="tabular-nums">${order.total.toFixed(2)}</span></div>
          </div>
        </DetailSection>

        {/* Shipping */}
        <DetailSection title={<span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-foreground/60" /> Shipping address</span>}>
          {(() => {
            const a = order.shipping_address as Record<string, string> | null;
            if (!a) return <p className="text-sm text-muted-foreground">No address provided</p>;
            return (
              <div className="text-[13px] text-muted-foreground space-y-0.5 leading-relaxed">
                <p className="font-medium text-foreground">{a.fullName}</p>
                <p>{a.phone}</p>
                <p>{a.street}</p>
                <p>{a.city}, {a.state} {a.zipCode}</p>
                <p>{a.country}</p>
              </div>
            );
          })()}
        </DetailSection>

        {/* Payment */}
        <DetailSection title={<span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-foreground/60" /> Payment</span>}>
          <div className="text-[13px]">
            <p className="font-medium text-foreground">
              {order.payment_method === "card" ? "Credit / debit card" : order.payment_method === "bkash" ? "bKash" : order.payment_method === "cod" ? "Cash on delivery (legacy)" : "N/A"}
            </p>
            <p className="text-muted-foreground capitalize mt-0.5">Status: {order.payment_status || "Pending"}</p>
          </div>
        </DetailSection>

        {order.tracking_number && (
          <DetailSection title="Tracking">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Tracking number</p>
            <p className="font-mono text-sm bg-muted/60 px-3 py-2.5 rounded-lg">{order.tracking_number}</p>
          </DetailSection>
        )}
      </MobilePage>
    </AppLayout>
  );
};

export default OrderDetail;
