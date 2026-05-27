import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart, Share2, ShoppingCart, Star, ChevronLeft, ChevronRight, Truck, ShieldCheck,
  Play, CheckCircle2, Award, Users, Globe, Infinity as InfinityIcon, ArrowLeft,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
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
  { question: "Is this product authentic?", answer: "Yes, every product on ASIKON is verified and shipped from trusted sellers." },
  { question: "How long does delivery take?", answer: "Standard delivery takes 3-5 business days inside Bangladesh. Cash on delivery available." },
  { question: "What is your return policy?", answer: "7-day easy returns. Items must be unused and in original packaging." },
  { question: "Do you ship outside Bangladesh?", answer: "International shipping is rolling out soon — stay tuned!" },
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

const ProductDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: product, isLoading } = useProduct(slug || "");
  const { data: relatedProducts } = useProducts({ limit: 8 });
  const addToCart = useAddToCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>("black");
  const [quantity, setQuantity] = useState(1);

  const images = product?.images?.length ? product.images : [product?.image_url];

  const handleAddToCart = () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to be logged in to add items to cart.", variant: "destructive" });
      return;
    }
    if (!product) return;
    if (!isCourse && !isBook && !selectedSize) {
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
        <MobilePage maxWidth="reading">
          <div className="py-20 text-center">
            <h1 className="font-display text-xl font-semibold mb-2">Product not found</h1>
            <Link to="/shop"><Button>Back to shop</Button></Link>
          </div>
        </MobilePage>
      </AppLayout>
    );
  }

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const name = product.name || "";
  const isCourse = /course|masterclass|bootcamp|specialization|class|prep/i.test(name);
  const isBook = /book|hardcover|edition/i.test(name);

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
        <Link to="/shop" className="inline-flex items-center text-[13px] text-muted-foreground hover:text-foreground gap-1 active:opacity-60">
          <ArrowLeft className="h-3.5 w-3.5" /> Shop
        </Link>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-3 lg:sticky lg:top-[calc(var(--app-header-h)+1.5rem)] lg:self-start">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
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
                <Badge className="absolute top-3 left-3 bg-foreground text-background border-0 font-semibold">
                  -{discountPercentage}%
                </Badge>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <span key={idx} className={cn("h-1 rounded-full transition-all", selectedImage === idx ? "w-5 bg-foreground" : "w-1 bg-foreground/40")} />
                  ))}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="hidden lg:flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn("flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-1 transition-all", selectedImage === idx ? "ring-foreground" : "ring-border/40 hover:ring-border")}
                    style={{ WebkitTapHighlightColor: "transparent" }}
                  >
                    <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <PageHero
              eyebrow="ASIKON"
              title={product.name}
              meta={
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-foreground font-medium">{product.rating || 0}</span>
                  <span>· {product.review_count || 0} reviews</span>
                </span>
              }
            />

            <div className="flex items-baseline gap-3 flex-wrap">
              <Price amount={product.price} className="text-3xl lg:text-4xl font-semibold tracking-tight" />
              {product.original_price && (
                <Price amount={product.original_price} strike className="text-base text-muted-foreground" />
              )}
              {discountPercentage > 0 && (
                <span className="text-[12px] font-semibold text-success uppercase tracking-wider">Save {discountPercentage}%</span>
              )}
            </div>

            {/* Trust strip — flat */}
            <div className="flex items-center gap-5 text-[12.5px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-foreground/60" /> Free shipping</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-foreground/60" /> Verified</span>
              <span className="inline-flex items-center gap-1.5"><InfinityIcon className="h-3.5 w-3.5 text-foreground/60" /> COD available</span>
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
            ) : isBook ? (
              <QuantitySelector quantity={quantity} onIncrease={() => setQuantity((q) => q + 1)} onDecrease={() => setQuantity((q) => Math.max(1, q - 1))} />
            ) : (
              <div className="space-y-5">
                <ColorSelector colors={colors} selectedColor={selectedColor} onSelectColor={setSelectedColor} />
                <SizeSelector sizes={sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
                <QuantitySelector quantity={quantity} onIncrease={() => setQuantity((q) => q + 1)} onDecrease={() => setQuantity((q) => Math.max(1, q - 1))} />
              </div>
            )}

            <div className="hidden lg:flex gap-2 pt-1">
              <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={addToCart.isPending}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                {addToCart.isPending ? "Adding..." : isCourse ? "Enroll now" : "Add to cart"}
              </Button>
              <Button variant="outline" size="lg" aria-label="Save"><Heart className="h-4 w-4" /></Button>
              <Button variant="outline" size="lg" aria-label="Share"><Share2 className="h-4 w-4" /></Button>
            </div>

            {product.description && (
              <DetailSection title={isCourse ? "About this course" : isBook ? "About this book" : "About this product"}>
                <p className="text-[14px] text-foreground/85 leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </DetailSection>
            )}
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
            <ShoppingCart className="h-4 w-4 mr-2" />{isCourse ? "Enroll" : "Add to cart"}
          </Button>
        </div>
      </StickyActionBar>
    </AppLayout>
  );
};

export default ProductDetail;
