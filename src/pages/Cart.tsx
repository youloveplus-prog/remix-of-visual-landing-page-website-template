import { Minus, Plus, Trash2, ShieldCheck, Truck, Tag, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";
import { useCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Price } from "@/lib/currency";

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: cartItems, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const handleUpdateQuantity = (id: string, currentQuantity: number, delta: number) => {
    const newQuantity = Math.max(1, currentQuantity + delta);
    updateCartItem.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart.mutate(id, {
      onSuccess: () => toast({ title: "Item removed", description: "Item has been removed from your cart." }),
    });
  };

  const subtotal = cartItems?.reduce((sum, item) => sum + (item.products?.price || 0) * (item.quantity || 1), 0) || 0;
  const shipping = cartItems && cartItems.length > 0 ? 10 : 0;
  const total = subtotal + shipping;
  const count = cartItems?.length || 0;

  if (authLoading || isLoading) {
    return (
      <AppLayout showBottomNav={false}>
        <MobilePage maxWidth="standard" spacing="space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        </MobilePage>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout showBottomNav={false}>
        <MobilePage maxWidth="reading">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="font-display text-xl font-semibold mb-1">Please sign in to view your cart</h1>
            <p className="text-sm text-muted-foreground mb-6">Sign in to add items to your cart</p>
            <Link to="/auth"><Button size="lg">Sign in</Button></Link>
          </div>
        </MobilePage>
      </AppLayout>
    );
  }

  return (
    <AppLayout showBottomNav={false}>
      <SEO
        title="Your Cart"
        description="Review the items in your Asikon cart and check out securely."
        noIndex
      />
      <MobilePage maxWidth="standard" spacing="space-y-8" className="pb-sticky-cta lg:pb-6">
        <PageHero
          eyebrow="Your bag"
          title="Shopping cart"
          subtitle={count === 0 ? "Your cart is currently empty." : `${count} item${count === 1 ? "" : "s"}`}
        />

        {count === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Nothing here yet</p>
            <Link to="/shop"><Button>Start shopping</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
            {/* Items list — flat with hairlines */}
            <ul className="divide-y divide-border/40 -mt-2">
              {cartItems!.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <Link to={`/product/${item.products?.slug}`} className="shrink-0 active:opacity-70 transition-opacity">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name || "Product"}
                      className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl object-cover bg-muted"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <Link to={`/product/${item.products?.slug}`} className="min-w-0">
                        <h3 className="font-medium text-[14px] lg:text-[15px] line-clamp-2 hover:opacity-70 transition-opacity">
                          {item.products?.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-destructive active:opacity-60 transition-colors -mt-1"
                        disabled={removeFromCart.isPending}
                        aria-label="Remove item"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Price amount={(item.products?.price || 0) * (item.quantity || 1)} className="font-semibold text-[15px]" />
                      <div className="inline-flex items-center gap-1 rounded-full bg-muted/60">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity || 1, -1)}
                          className="h-8 w-8 grid place-items-center text-foreground/70 hover:text-foreground active:opacity-60"
                          disabled={updateCartItem.isPending}
                          aria-label="Decrease"
                          style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-[13px] font-medium tabular-nums">{item.quantity || 1}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity || 1, 1)}
                          className="h-8 w-8 grid place-items-center text-foreground/70 hover:text-foreground active:opacity-60"
                          disabled={updateCartItem.isPending}
                          aria-label="Increase"
                          style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <aside className="lg:sticky lg:top-[calc(var(--app-header-h)+1rem)] lg:self-start space-y-5">
              <div className="hidden lg:block space-y-4 rounded-2xl border border-border/40 p-6">
                <h2 className="font-display text-lg font-semibold">Order summary</h2>
                <div className="space-y-2 text-[14px]">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><Price amount={subtotal} /></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><Price amount={shipping} /></div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-[15px]"><span>Total</span><Price amount={total} /></div>
                </div>
                <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>Proceed to checkout</Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 text-[12px] text-muted-foreground">
                {[
                  { icon: ShieldCheck, text: "Verified sellers" },
                  { icon: Truck, text: "Fast delivery in Bangladesh" },
                  { icon: Tag, text: "Apply coupons at checkout" },
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-2 py-1">
                    <t.icon className="h-3.5 w-3.5 text-foreground/60 shrink-0" />
                    <span>{t.text}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}
      </MobilePage>

      {count > 0 && (
        <StickyActionBar mobileOnly aboveBottomNav={false}>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Total</p>
              <Price amount={total} className="font-semibold text-lg" />
            </div>
            <Button size="lg" onClick={() => navigate("/checkout")} className="px-6">Checkout</Button>
          </div>
        </StickyActionBar>
      )}
    </AppLayout>
  );
};

export default Cart;
