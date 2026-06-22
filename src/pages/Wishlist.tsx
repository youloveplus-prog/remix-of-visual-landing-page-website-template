import { Link, Navigate } from "react-router-dom";
import { Heart, X, ShoppingCart } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Price } from "@/lib/currency";

const Wishlist = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { data: wishlistItems, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

  const handleRemove = (id: string) =>
    removeFromWishlist.mutate(id, {
      onSuccess: () => toast({ title: "Removed from wishlist" }),
    });

  const handleAddToCart = (productId: string, productName: string) =>
    addToCart.mutate({ productId, quantity: 1 }, {
      onSuccess: () => toast({ title: "Added to cart", description: productName }),
    });

  const handleMoveAll = () => {
    wishlistItems?.forEach((it) => {
      if (it.products?.id) addToCart.mutate({ productId: it.products.id, quantity: 1 });
    });
    toast({ title: "Moving items to cart…" });
  };

  if (authLoading) return <AppLayout><MobilePage maxWidth="standard"><Skeleton className="h-8 w-40" /></MobilePage></AppLayout>;
  if (!user) return <Navigate to="/auth" replace />;

  const count = wishlistItems?.length || 0;

  return (
    <AppLayout>
      <MobilePage maxWidth="wide" spacing="space-y-6">
        <PageHero
          eyebrow="Saved for later"
          title="Wishlist"
          subtitle={count === 0 ? "Save items you love to find them faster." : `${count} item${count === 1 ? "" : "s"}`}
          actions={count > 0 ? (
            <Button variant="outline" size="sm" onClick={handleMoveAll}>
              <ShoppingCart className="h-4 w-4 mr-1.5" /> Move all to cart
            </Button>
          ) : undefined}
        />

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}
          </div>
        ) : count === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-display text-lg font-semibold mb-1">Your wishlist is empty</h2>
            <p className="text-sm text-muted-foreground mb-5">Tap the heart on any product to save it here.</p>
            <Link to="/shop"><Button>Start shopping</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {wishlistItems!.map((item) => (
              <div key={item.id} className="group relative">
                <Link to={`/product/${item.products?.slug}`} className="block">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
                    <img
                      src={item.products?.image_url || "/placeholder.svg"}
                      alt={item.products?.name || ""}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  aria-label="Remove from wishlist"
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/85 backdrop-blur grid place-items-center text-foreground/70 hover:text-foreground active:opacity-60 transition-colors"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="pt-2.5 pb-1">
                  <Link to={`/product/${item.products?.slug}`}>
                    <h3 className="font-medium text-[13px] lg:text-[14px] line-clamp-2 hover:opacity-70 transition-opacity min-h-[2.25rem]">
                      {item.products?.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-1.5">
                    <Price amount={item.products?.price ?? 0} className="font-semibold text-[14px]" />
                    <button
                      onClick={() => handleAddToCart(item.products?.id || "", item.products?.name || "")}
                      disabled={addToCart.isPending}
                      aria-label="Add to cart"
                      className="h-7 w-7 grid place-items-center rounded-full text-foreground/70 hover:text-foreground active:opacity-60 transition-colors"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </MobilePage>
    </AppLayout>
  );
};

export default Wishlist;
