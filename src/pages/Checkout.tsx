import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Wallet, Check } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
import { DetailSection } from "@/components/ui/detail-section";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Price } from "@/lib/currency";

const PAYMENT_OPTIONS = [
  { id: "card", label: "Credit / debit card", desc: "Pay securely with your card", icon: CreditCard },
  { id: "bkash", label: "bKash", desc: "Pay with bKash mobile wallet", icon: Wallet },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: cartItems, isLoading } = useCart();
  const createOrder = useCreateOrder();

  const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = cartItems?.reduce((s, i) => s + (i.products?.price || 0) * (i.quantity || 1), 0) || 0;
  const total = subtotal;

  const handlePlaceOrder = () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in.", variant: "destructive" });
      navigate("/auth");
      return;
    }
    createOrder.mutate(
      { paymentMethod, shippingAddress: {}, items: cartItems || [] },
      {
        onSuccess: (order) => {
          toast({ title: "Order placed", description: "Your digital items are ready in your library." });
          navigate(`/orders/${order.id}`);
        },
        onError: () => toast({ title: "Error", description: "Failed to place order.", variant: "destructive" }),
      },
    );
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (isLoading) {
    return (
      <AppLayout showBottomNav={false}>
        <MobilePage maxWidth="standard"><Skeleton className="h-8 w-40" /><Skeleton className="h-96 w-full rounded-2xl" /></MobilePage>
      </AppLayout>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <AppLayout showBottomNav={false}>
        <MobilePage maxWidth="reading">
          <div className="py-20 text-center">
            <h1 className="font-display text-xl font-semibold mb-1">Your cart is empty</h1>
            <p className="text-sm text-muted-foreground mb-6">Add some items to checkout.</p>
            <Button onClick={() => navigate("/shop")}>Continue shopping</Button>
          </div>
        </MobilePage>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false}>
      <MobilePage maxWidth="standard" spacing="space-y-8" className="pb-sticky-cta lg:pb-6">
        <PageHero eyebrow="Final step" title="Checkout" subtitle="All products are digital — instant access after payment." />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          <div className="space-y-8 min-w-0">
            <DetailSection title={<span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-foreground/60" /> Payment method</span>}>
              <div className="space-y-2">
                {PAYMENT_OPTIONS.map((opt) => {
                  const active = paymentMethod === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={cn(
                        "w-full text-left flex items-center gap-3 rounded-xl border p-4 transition-colors",
                        active ? "border-foreground bg-secondary/60" : "border-border hover:border-foreground/40",
                      )}
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <Icon className="h-5 w-5 text-foreground/70 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[14px]">{opt.label}</p>
                        <p className="text-[12px] text-muted-foreground">{opt.desc}</p>
                      </div>
                      <span className={cn("h-5 w-5 rounded-full border grid place-items-center shrink-0", active ? "border-foreground bg-foreground text-background" : "border-border")}>
                        {active && <Check className="h-3 w-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </DetailSection>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-[calc(var(--app-header-h)+1rem)] lg:self-start">
            <div className="rounded-2xl border border-border/40 p-6 space-y-4">
              <h2 className="font-display text-lg font-semibold">Order summary</h2>
              <div className="space-y-2.5 text-[13px]">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground line-clamp-1 min-w-0">{item.products?.name} × {item.quantity}</span>
                    <Price amount={(item.products?.price || 0) * (item.quantity || 1)} className="shrink-0" />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-1.5 text-[13px]">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><Price amount={subtotal} /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="text-foreground">Instant · digital</span></div>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-[15px]"><span>Total</span><Price amount={total} /></div>
              <Button className="hidden lg:flex w-full" size="lg" onClick={handlePlaceOrder} disabled={createOrder.isPending}>
                {createOrder.isPending ? "Placing order..." : "Place order"}
              </Button>
            </div>
          </aside>
        </div>
      </MobilePage>

      <StickyActionBar mobileOnly aboveBottomNav={false}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Total</p>
            <Price amount={total} className="font-semibold text-lg" />
          </div>
          <Button size="lg" onClick={handlePlaceOrder} disabled={createOrder.isPending} className="px-6">
            {createOrder.isPending ? "Placing..." : "Place order"}
          </Button>
        </div>
      </StickyActionBar>
    </AppLayout>
  );
};

export default Checkout;
