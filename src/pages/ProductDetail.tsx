import { useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { resolveContentRoute } from "@/lib/contentRouting";
import { useKindMismatchTelemetry } from "@/lib/useKindMismatchTelemetry";
import {
  Heart, Share2, ShoppingCart, Star, ChevronLeft, ChevronRight, Zap, ShieldCheck,
  Play, CheckCircle2, Award, Users, Globe, Infinity as InfinityIcon, ArrowLeft,
  RotateCcw, Sparkles, GraduationCap, BookOpen, Download, Package, Cpu,
  type LucideIcon,
} from "lucide-react";
import { getProductCta, type ProductCtaIcon } from "@/lib/productCta";

const PRODUCT_CTA_ICON: Record<ProductCtaIcon, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  download: Download,
  sparkles: Sparkles,
  package: Package,
  cpu: Cpu,
  users: Users,
  "arrow-up-right": ShoppingCart,
};
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { MobilePage } from "@/components/layout/MobilePage";

import { DetailSection } from "@/components/ui/detail-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";
import { ProductCarousel } from "@/components/carousels";
import { SizeSelector, ColorSelector, QuantitySelector, ProductReviews, ProductFAQ } from "@/components/product";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Price } from "@/lib/currency";
import { cn } from "@/lib/utils";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
const colors = [
  { value: "black", name: "Black", hex: "#1a1a1a" },
  { value: "white", name: "White", hex: "#ffffff" },
  { value: "navy", name: "Navy", hex: "#1e3a5f" },
  { value: "gray", name: "Gray", hex: "#6b7280" },
];

const mockReviews = [
  { id: "1", userName: "Sarah M.", rating: 5, title: "AI tutor is a game changer", content: "Cleared every doubt I had. Felt like a personal mentor was beside me.", isVerifiedPurchase: true, helpfulCount: 124, createdAt: "2 days ago" },
  { id: "2", userName: "Alex T.", rating: 5, title: "Worth every taka", content: "Projects are practical, instructor explains clearly, and lifetime access is amazing.", isVerifiedPurchase: true, helpfulCount: 88, createdAt: "1 week ago" },
];

const courseFaqs = [
  { question: "Do I get lifetime access?", answer: "Yes — once enrolled, you keep lifetime access to all lessons, projects, and future updates." },
  { question: "Is there a certificate?", answer: "Yes, you receive a verified ASIKON certificate of completion you can share on LinkedIn or your CV." },
  { question: "Can I ask questions during the course?", answer: "Absolutely. The ASIKON AI Tutor is available 24/7, and our human mentors reply in the community within hours." },
  { question: "Is this beginner friendly?", answer: "Yes. Every course starts from the fundamentals and builds up to real, project-based learning." },
];

const productFaqs = [
  { question: "Is this product authentic?", answer: "Yes — every product on ASIKON is digital, verified, and delivered instantly from trusted creators." },
  { question: "How do I get access after buying?", answer: "Instantly. The moment your payment is verified, the product unlocks in your library — no waiting, no shipping." },
  { question: "What is your refund policy?", answer: "7-day money-back guarantee. If it's not for you, request a refund from your order page and we'll process it." },
  { question: "Can I use it outside Bangladesh?", answer: "Yes. All products are digital, so they work anywhere with an internet connection." },
];

const courseCurriculum = [
  { module: "Module 1 — Foundations", lessons: 8, duration: "1h 45m" },
  { module: "Module 2 — Core Concepts", lessons: 12, duration: "3h 20m" },
  { module: "Module 3 — Hands-on Projects", lessons: 10, duration: "4h 10m" },
  { module: "Module 4 — Real-World Case Studies", lessons: 6, duration: "2h 30m" },
  { module: "Module 5 — Final Project & Certification", lessons: 4, duration: "2h 00m" },
];

const courseLearnings = [
  "Build real projects from day one",
  "Master fundamentals with simple, visual explanations",
  "Get unstuck instantly with the ASIKON AI Tutor",
  "Earn a verified certificate of completion",
  "Join a community of motivated learners",
  "Lifetime access with future updates included",
];

function NotFoundSuggestions() {
  const { data: featured } = useProducts({ featured: true, limit: 4, excludeKinds: ["course", "service"] });
  if (!featured || featured.length === 0) return null;
  return (
    <div className="pt-6 text-left">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-3 text-center">
        You might like
      </p>
      <div className="grid grid-cols-2 gap-3">
        {featured.slice(0, 4).map((p: any) => (
          <Link
            key={p.id}
            to={`/product/${p.slug}`}
            className="rounded-2xl border border-border/60 bg-card p-3 hover:border-border transition-colors active:opacity-70"
          >
            <div className="aspect-square rounded-xl bg-muted overflow-hidden mb-2">
              <img src={p.image_url || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-[12.5px] font-medium leading-tight line-clamp-2">{p.name}</p>
            <Price amount={p.price} className="text-[13px] font-semibold mt-1 block" />
          </Link>
        ))}
      </div>
    </div>
  );
}

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: relatedProducts } = useProducts({
    limit: 8,
    excludeKinds: ["course", "service"],
  });

  // Guard: /product/:slug is for storefront SKUs only. Course/service slugs
  // that somehow land here are forwarded to their canonical detail route.
  const productRedirect = resolveContentRoute(
    "product",
    (product as any)?.kind,
    slug || "",
  );
  useKindMismatchTelemetry("product", productRedirect, (product as any)?.kind, slug || "");
  if (productRedirect) return <Navigate to={productRedirect} replace />;
  const addToCart = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>("black");
  const [quantity, setQuantity] = useState(1);

  const rawImages: (string | null | undefined)[] = (product as any)?.images?.length
    ? (product as any).images
    : [product?.image_url];
  const filtered = rawImages.filter((src): src is string => !!src);
  const images: string[] = filtered.length > 0 ? filtered : ["/placeholder.svg"];

  const handleAddToCart = () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to add items to cart.", variant: "destructive" });
      return;
    }
    if (!product) return;
    if (!isDigitalOnly && !selectedSize) {
      toast({ title: "Select a size", description: "Please select a size first.", variant: "destructive" });
      return;
    }
    addToCart.mutate({ productId: product.id, quantity }, {
      onSuccess: () => toast({ title: "Added to cart", description: product.name }),
      onError: () => toast({ title: "Error", description: "Failed to add item.", variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <MobilePage maxWidth="wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" /><Skeleton className="h-6 w-1/4" /><Skeleton className="h-24 w-full" />
            </div>
          </div>
        </MobilePage>
      </AppLayout>
    );
  }

  if (!product) {
    return (
      <AppLayout>
        <SEO
          title="Product not found"
          description="We couldn't find the product you were looking for."
          noIndex
          suppressCanonical
        />
        <MobilePage maxWidth="reading">
          <section
            role="alert"
            aria-live="assertive"
            aria-labelledby="product-not-found-title"
            aria-describedby="product-not-found-desc"
            data-testid="product-not-found"
            className="py-16 text-center space-y-5"
          >
            <div
              aria-hidden="true"
              className="mx-auto h-14 w-14 rounded-2xl bg-muted grid place-items-center"
            >
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <h1 id="product-not-found-title" className="font-display text-2xl font-semibold">
                Product not found
              </h1>
              <p id="product-not-found-desc" className="text-sm text-muted-foreground max-w-sm mx-auto">
                This item may have been removed or the link is out of date. Try browsing our shop or featured picks.
              </p>
            </div>
            <nav aria-label="Recovery actions" className="flex items-center justify-center gap-2">
              <Link to="/shop" aria-label="Back to shop">
                <Button variant="outline" className="rounded-full">Back to shop</Button>
              </Link>
              <Link to="/shop?featured=1" aria-label="Browse featured products">
                <Button className="rounded-full">Browse featured</Button>
              </Link>
            </nav>
            <NotFoundSuggestions />
          </section>
        </MobilePage>
      </AppLayout>
    );
  }

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const name = product.name || "";
  const kind = (product as any).kind as string | undefined;
  const isCourse = kind === "course" || /course|masterclass|bootcamp|specialization|class|prep/i.test(name);
  const isBook = kind === "ebook" || /book|hardcover|edition/i.test(name);
  // Digital-only kinds never need size/color selectors.
  const isDigitalOnly = isCourse || isBook || kind === "service" || kind === "bundle";
  const cta = getProductCta({ name, categoryName: (product as any).category ?? undefined });
  const CtaIcon = PRODUCT_CTA_ICON[cta.icon] ?? ShoppingCart;

  const canonical = `https://asikonpro.lovable.app/product/${slug}`;
  const productDesc = (product.description || `Buy ${name} on Asikon.`).slice(0, 155);

  return (
    <AppLayout>
      <SEO
        title={name}
        description={productDesc}
        url={canonical}
        image={product.image_url || undefined}
        type="product"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          description: product.description || name,
          image: images.filter(Boolean),
          sku: product.id,
          offers: {
            "@type": "Offer",
            url: canonical,
            priceCurrency: "BDT",
            price: product.price,
            availability: (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
          ...(product.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.review_count || 1 } } : {}),
        })}</script>
      </SEO>
      <MobilePage maxWidth="wide" spacing="space-y-10" className="pb-sticky-cta lg:pb-10">
        <Link to="/shop" className="hidden lg:inline-flex items-center text-[13px] text-muted-foreground hover:text-foreground gap-1 active:opacity-60">
          <ArrowLeft className="h-3.5 w-3.5" /> Shop
        </Link>

        {/* Mobile hero (reference style) */}
        <div className="lg:hidden space-y-4">
          <div className="rounded-[28px] bg-muted/50 dark:bg-muted/25 px-5 pt-5 pb-6 overflow-hidden">
            <div className="grid grid-cols-3 items-center">
              <Link to="/shop" aria-label="Back" className="h-9 w-9 rounded-full bg-background/85 backdrop-blur grid place-items-center active:opacity-60 shadow-sm justify-self-start">
                <ChevronLeft className="h-4 w-4" />
              </Link>
              <Sparkles className="h-4 w-4 text-foreground/40 justify-self-center" />
              <span className="justify-self-end" />
            </div>

            <div className="relative grid grid-cols-[1fr_3fr_1fr] items-center gap-2 mt-2">
              <img
                src={images[(selectedImage - 1 + images.length) % images.length] || "/placeholder.svg"}
                alt=""
                aria-hidden
                className="aspect-square object-contain opacity-40 -ml-6 pointer-events-none select-none"
              />
              <img
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="aspect-square object-contain drop-shadow-2xl"
              />
              <img
                src={images[(selectedImage + 1) % images.length] || "/placeholder.svg"}
                alt=""
                aria-hidden
                className="aspect-square object-contain opacity-40 -mr-6 pointer-events-none select-none"
              />
            </div>


            {images.length > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setSelectedImage((p) => (p > 0 ? p - 1 : images.length - 1))}
                  aria-label="Previous"
                  className="h-8 w-8 rounded-full bg-background grid place-items-center shadow-sm active:opacity-60"
                ><ChevronLeft className="h-3.5 w-3.5" /></button>
                <span className="text-[12px] tabular-nums text-muted-foreground font-medium min-w-[2.5rem] text-center">{selectedImage + 1}/{images.length}</span>
                <button
                  onClick={() => setSelectedImage((p) => (p < images.length - 1 ? p + 1 : 0))}
                  aria-label="Next"
                  className="h-8 w-8 rounded-full bg-background grid place-items-center shadow-sm active:opacity-60"
                ><ChevronRight className="h-3.5 w-3.5" /></button>
              </div>
            )}

            {images.length > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "h-14 w-14 rounded-full grid place-items-center bg-background shadow-sm shrink-0 transition-all",
                      selectedImage === idx ? "ring-2 ring-foreground scale-105" : "opacity-80"
                    )}
                    aria-label={`Image ${idx + 1}`}
                  >
                    <img src={img || "/placeholder.svg"} alt="" className="h-9 w-9 object-contain rounded-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="bg-background rounded-[28px] px-5 pt-5 pb-5 shadow-sm border border-border/40 space-y-4">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {discountPercentage > 0 ? (<><Sparkles className="h-3 w-3" /> Save {discountPercentage}%</>) : "New Arrival"}
            </span>

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h1 className="font-display text-[26px] leading-[1.05] font-bold tracking-tight">{product.name}</h1>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mt-1.5">ASIKON</p>
              </div>
              <div className="text-right shrink-0">
                <div className="flex justify-end">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-3.5 w-3.5", i < Math.round(product.rating || 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{(product.review_count || 0).toLocaleString()} reviews</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-baseline gap-2 min-w-0">
                <Price amount={product.price} className="text-[28px] font-display font-bold tracking-tight tabular-nums" />
                {product.original_price && (
                  <Price amount={product.original_price} strike className="text-sm text-muted-foreground tabular-nums" />
                )}
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="rounded-full h-12 px-5 bg-foreground text-background hover:bg-foreground/90"
              >
                <CtaIcon className="h-4 w-4 mr-2" />
                {cta.primaryLabel}
              </Button>
            </div>

            <div className="flex items-center gap-1.5 text-[12.5px] text-foreground/80">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span>Instant access — delivered to your library</span>
            </div>
          </div>

          {product.description && (
            <div className="rounded-2xl border border-border/60 liquid-glass p-4">
              <h3 className="font-semibold text-[15px] mb-2">Description</h3>
              <p className="text-[13.5px] text-foreground/80 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          <div className="rounded-2xl border border-border/60 liquid-glass p-4">
            <h3 className="font-semibold text-[15px] mb-3">Product Details</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: Zap, label: "Instant Access", sub: "Unlock now" },
                { icon: ShieldCheck, label: "Secure Checkout", sub: "SSL + bKash" },
                { icon: RotateCcw, label: "7-Day Refund", sub: "No questions" },
                { icon: Award, label: "Verified", sub: "Trusted creator" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5">
                  <span className="h-8 w-8 rounded-full bg-background grid place-items-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold leading-tight truncate">{label}</p>
                    <p className="text-[11px] text-muted-foreground leading-tight truncate">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop main */}
        <div className="hidden lg:block rounded-[2rem] p-8 xl:p-10 bg-gradient-to-br from-amber-50/60 via-background to-background dark:from-amber-950/15 border border-border/40">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-6 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-3 lg:sticky lg:top-[calc(var(--app-header-h)+1.5rem)] lg:self-start">
            <div className="relative aspect-square rounded-2xl lg:rounded-[1.75rem] overflow-hidden bg-muted ring-1 ring-border/40 lg:shadow-xl lg:shadow-amber-900/5">
              <div className="hidden lg:block absolute top-3 left-1/2 -translate-x-1/2 h-1 w-16 rounded-full bg-foreground/20 z-10" />
              <img src={images[selectedImage] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((p) => (p > 0 ? p - 1 : images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/85 backdrop-blur grid place-items-center active:opacity-60"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    aria-label="Previous image"
                  ><ChevronLeft className="h-4 w-4" /></button>
                  <button
                    onClick={() => setSelectedImage((p) => (p < images.length - 1 ? p + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/85 backdrop-blur grid place-items-center active:opacity-60"
                    style={{ WebkitTapHighlightColor: "transparent" }}
                    aria-label="Next image"
                  ><ChevronRight className="h-4 w-4" /></button>
                </>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute top-3 left-3 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 font-semibold shadow-lg shadow-primary/20 px-2.5 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Save {discountPercentage}%
                </Badge>
              )}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                <button className="h-9 w-9 rounded-full bg-background/85 backdrop-blur grid place-items-center active:opacity-60 hover:bg-background transition-colors" aria-label="Save">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 rounded-full bg-background/85 backdrop-blur grid place-items-center active:opacity-60 hover:bg-background transition-colors" aria-label="Share">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
                  {images.map((_, idx) => (
                    <span key={idx} className={cn("h-1 rounded-full transition-all", selectedImage === idx ? "w-5 bg-foreground" : "w-1 bg-foreground/40")} />
                  ))}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="hidden lg:flex gap-2.5 pt-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden ring-2 transition-all",
                      selectedImage === idx ? "ring-primary" : "ring-border/40 hover:ring-border"
                    )}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5 lg:space-y-6">
            <div className="space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">ASIKON</p>
              <h1 className="font-display text-[28px] leading-[1.05] lg:text-[40px] xl:text-[44px] font-bold tracking-tight text-foreground">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-[13.5px]">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating || 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")} />
                  ))}
                </div>
                <span className="font-medium tabular-nums">{(product.rating || 0).toFixed(1)}/5</span>
                <span className="text-muted-foreground">({(product.review_count || 0).toLocaleString()} Reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <Price amount={product.price} className="text-3xl lg:text-[34px] font-display font-bold tracking-tight tabular-nums" />
              {product.original_price && (
                <Price amount={product.original_price} strike className="text-lg text-muted-foreground tabular-nums" />
              )}
              {discountPercentage > 0 && (
                <span className="text-[11px] font-semibold text-success uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/10">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            {isCourse ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px]">
                {[
                  { icon: InfinityIcon, label: "Lifetime access" },
                  { icon: Award, label: "Verified certificate" },
                  { icon: Globe, label: "Bangla + English" },
                  { icon: Users, label: "24/7 AI Tutor" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            ) : isDigitalOnly ? null : (
              <div className="space-y-5">
                <ColorSelector colors={colors} selectedColor={selectedColor} onSelectColor={setSelectedColor} />
                <SizeSelector sizes={sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
              </div>
            )}

            <div className="flex items-center gap-1.5 text-[13px] text-foreground/80">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Instant access — delivered to your library</span>
            </div>

            <div className="hidden lg:flex items-center gap-3 pt-1">
              <div className="flex items-center gap-2 rounded-full border border-border liquid-glass px-2 py-1.5">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 rounded-full grid place-items-center hover:bg-muted transition-colors"
                  aria-label="Decrease"
                >−</button>
                <span className="w-6 text-center font-semibold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-8 w-8 rounded-full grid place-items-center hover:bg-muted transition-colors"
                  aria-label="Increase"
                >+</button>
              </div>
              <Button className="flex-1 rounded-full" size="lg" onClick={handleAddToCart} disabled={addToCart.isPending}>
                <CtaIcon className="h-4 w-4 mr-2" />
                {addToCart.isPending ? "Adding..." : cta.primaryLabel}
              </Button>
              <Button variant="outline" size="lg" className="rounded-full h-12 w-12 p-0" aria-label="Save"><Heart className="h-4 w-4" /></Button>
            </div>

            {product.description && (
              <div className="rounded-2xl border border-border/60 liquid-glass p-4 lg:p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[15px]">Description</h3>
                  <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
                </div>
                <p className="text-[13.5px] text-foreground/80 leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            <div className="rounded-2xl border border-border/60 liquid-glass p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[15px]">Product Details</h3>
                <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: Zap, label: "Instant Access", sub: "Unlock now" },
                  { icon: ShieldCheck, label: "Secure Checkout", sub: "SSL + bKash" },
                  { icon: RotateCcw, label: "7-Day Refund", sub: "No questions" },
                  { icon: Award, label: "Verified", sub: "Trusted creator" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5">
                    <span className="h-8 w-8 rounded-full bg-background grid place-items-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold leading-tight truncate">{label}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight truncate">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Course-specific */}
        {isCourse && (
          <>
            <DetailSection title="What you will learn">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {courseLearnings.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-[13.5px]">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-success flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </DetailSection>

            <DetailSection
              title="Curriculum"
              action={<span className="text-[12px] text-muted-foreground">{courseCurriculum.reduce((s, m) => s + m.lessons, 0)} lessons · ~14h</span>}
            >
              <ol className="divide-y divide-border/40">
                {courseCurriculum.map((m, i) => (
                  <li key={m.module} className="flex items-center gap-3 py-3">
                    <span className="grid place-items-center h-8 w-8 rounded-full bg-muted/60 text-[12px] font-semibold tabular-nums shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium truncate">{m.module}</p>
                      <p className="text-[12px] text-muted-foreground">{m.lessons} lessons · {m.duration}</p>
                    </div>
                    <Play className="h-4 w-4 text-foreground/50" />
                  </li>
                ))}
              </ol>
            </DetailSection>

            <DetailSection title="Your instructor">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80"
                  alt="Instructor"
                  className="w-14 h-14 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px]">ASIKON Mentor Team</p>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed">Engineers, educators, and AI researchers helping students learn smarter.</p>
                </div>
              </div>
            </DetailSection>
          </>
        )}

        <DetailSection title="Reviews">
          <ProductReviews
            reviews={mockReviews}
            averageRating={product.rating || 4.5}
            totalReviews={product.review_count || 36}
            ratingDistribution={[
              { stars: 5, count: 24 }, { stars: 4, count: 8 }, { stars: 3, count: 3 }, { stars: 2, count: 1 }, { stars: 1, count: 0 },
            ]}
          />
        </DetailSection>

        <DetailSection title="FAQ">
          <ProductFAQ faqs={isCourse ? courseFaqs : productFaqs} />
        </DetailSection>

        {relatedProducts && relatedProducts.length > 0 && (
          <DetailSection title={isCourse ? "Continue learning" : "You may also like"}>
            <ProductCarousel
              title=""
              products={relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 8)
                .map((p) => ({
                  id: p.id, name: p.name, brand: "ASIKON",
                  price: p.price, originalPrice: p.original_price || undefined,
                  image: p.image_url || "/placeholder.svg",
                  rating: p.rating || 0, reviews: p.review_count || 0,
                  isTrending: p.is_featured || false,
                }))}
            />
          </DetailSection>
        )}
      </MobilePage>

      {/* Mobile sticky CTA */}
      <StickyActionBar>
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <Price amount={product.price} className="text-lg font-semibold" />
            {product.original_price && (
              <Price amount={product.original_price} strike className="text-[12px] text-muted-foreground ml-2" />
            )}
          </div>
          <Button size="lg" className="px-6" onClick={handleAddToCart} disabled={addToCart.isPending}>
            <CtaIcon className="h-4 w-4 mr-2" />{cta.primaryShortLabel}
          </Button>
        </div>
      </StickyActionBar>
    </AppLayout>
  );
};

export default ProductDetail;
