import { ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { Price } from "@/lib/currency";

interface ProductTagProps {
  product: Product;
  variant?: "overlay" | "inline";
}

export function ProductTag({ product, variant = "overlay" }: ProductTagProps) {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-3 p-2.5 bg-card border border-border rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-10 h-10 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold truncate">{product.name}</p>
          <Price amount={product.price} className="text-[12.5px] text-foreground/80 font-semibold" />
        </div>
        <button className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity">
          <ShoppingBag className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-background/90 backdrop-blur-sm rounded-full border border-border hover:bg-background transition-colors">
      <ShoppingBag className="h-4 w-4" />
      <span className="text-sm font-medium">Shop the look</span>
    </button>
  );
}
