import { ShoppingBag, Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  isPurchased?: boolean;
  isReviewed?: boolean;
  isSold?: boolean;
}

interface ProfileShopTabProps {
  products: ShopProduct[];
  isPodCreator?: boolean;
}

export function ProfileShopTab({ products, isPodCreator }: ProfileShopTabProps) {
  const purchasedProducts = products.filter(p => p.isPurchased);
  const reviewedProducts = products.filter(p => p.isReviewed);
  const soldProducts = products.filter(p => p.isSold);

  return (
    <div className="p-4 space-y-6">
      {/* Purchased Section */}
      {purchasedProducts.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-blue-400" />
            Products Bought ({purchasedProducts.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {purchasedProducts.map((product) => (
              <ProductCard key={product.id} product={product} type="purchased" />
            ))}
          </div>
        </section>
      )}

      {/* Reviewed Section */}
      {reviewedProducts.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            Products Reviewed ({reviewedProducts.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {reviewedProducts.map((product) => (
              <ProductCard key={product.id} product={product} type="reviewed" />
            ))}
          </div>
        </section>
      )}

      {/* Sold Section (for POD creators) */}
      {isPodCreator && soldProducts.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Designs Sold ({soldProducts.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {soldProducts.map((product) => (
              <ProductCard key={product.id} product={product} type="sold" />
            ))}
          </div>
        </section>
      )}

      {products.length === 0 && (
        <div className="py-16 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No shop activity yet</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ 
  product, 
  type 
}: { 
  product: ShopProduct; 
  type: "purchased" | "reviewed" | "sold" 
}) {
  const badgeConfig = {
    purchased: { label: "Purchased", color: "bg-blue-500/20 text-blue-400" },
    reviewed: { label: "Reviewed", color: "bg-amber-500/20 text-amber-400" },
    sold: { label: "Sold", color: "bg-emerald-500/20 text-emerald-400" },
  };

  const badge = badgeConfig[type];

  return (
    <div className="rounded-xl overflow-hidden glass border border-border/50 hover-lift cursor-pointer">
      <div className="relative aspect-square">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className={cn(
          "absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-medium",
          badge.color
        )}>
          {badge.label}
        </div>
      </div>
      
      <div className="p-2.5">
        <p className="text-xs font-medium line-clamp-2 mb-1">{product.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary">${product.price}</span>
          <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
