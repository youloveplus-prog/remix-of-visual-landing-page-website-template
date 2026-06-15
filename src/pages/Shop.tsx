import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { AppLayout } from "@/components/layout/AppLayout";
import { CategoryCarousel } from "@/components/carousels";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { DesktopFilterRail } from "@/components/shop/DesktopFilterRail";
import { ProductCard } from "@/components/shop/ProductCard";
import { CourseVideoCard } from "@/components/shop/CourseVideoCard";
import { Reveal } from "@/components/transitions/Reveal";
import { useProducts, SortOption } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_PRICE = 500;

type ProductType = "all" | "courses" | "ebooks" | "services" | "bundles";

function detectProductType(name: string): ProductType {
  const n = name.toLowerCase();
  if (/\bbundle|kit|pack|collection|set\b/.test(n)) return "bundles";
  if (/\bmentorship|coaching|consultation|service|1[:-]1|one[- ]on[- ]one\b/.test(n)) return "services";
  if (/\bbook|ebook|hardcover|paperback|pdf|guide|novel\b/.test(n)) return "ebooks";
  if (/\bcourse|masterclass|bootcamp|training|class|tutorial|workshop\b/.test(n)) return "courses";
  return "courses";
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") ?? "All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [productType, setProductType] = useState<ProductType>("all");
  const [minRating, setMinRating] = useState(0);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Sync URL → state (q, type, filter, category)
  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
    const type = searchParams.get("type") as ProductType | null;
    if (type && ["all", "courses", "ebooks", "services", "bundles"].includes(type)) {
      setProductType(type);
    }
    const cat = searchParams.get("category");
    setActiveCategory(cat ?? "All");
    const filter = searchParams.get("filter");
    if (filter === "trending" || filter === "popular") setSortBy("popular");
    else if (filter === "new") setSortBy("newest");
    else if (filter === "deals") {
      setSortBy("price-asc");
      setOnSaleOnly(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const handleTypeChange = (t: ProductType) => {
    setProductType(t);
    const next = new URLSearchParams(searchParams);
    if (t === "all") next.delete("type");
    else next.set("type", t);
    setSearchParams(next, { replace: true });
  };

  const handleCategoryChange = (name: string) => {
    setActiveCategory(name);
    const next = new URLSearchParams(searchParams);
    if (name === "All") next.delete("category");
    else next.set("category", name);
    setSearchParams(next, { replace: true });
  };


  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Get active category ID
  const activeCategoryId = useMemo(() => {
    if (activeCategory === "All") return undefined;
    const category = categories?.find((c) => c.name === activeCategory);
    return category?.id;
  }, [activeCategory, categories]);

  // Fetch products with all filters
  const { data: products, isLoading: productsLoading } = useProducts({
    limit: 50,
    categoryId: activeCategoryId,
    search: searchQuery || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < MAX_PRICE ? priceRange[1] : undefined,
    sortBy,
  });

  // Apply remaining filters client-side
  const filteredProducts = useMemo(() => {
    if (!products) return products;
    return products.filter((p) => {
      if (productType !== "all" && detectProductType(p.name) !== productType) return false;
      if (minRating > 0 && (p.rating ?? 0) < minRating) return false;
      if (onSaleOnly && !(p.original_price && p.original_price > p.price)) return false;
      if (featuredOnly && !p.is_featured) return false;
      return true;
    });
  }, [products, productType, minRating, onSaleOnly, featuredOnly]);

  // Filter category pills by current query so categories matching the search bubble up
  const q = searchQuery.trim().toLowerCase();
  const matchedCategories = useMemo(() => {
    const all = categories ?? [];
    if (!q) return all;
    const matches = all.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q),
    );
    return matches.length > 0 ? matches : all;
  }, [categories, q]);

  const categoryItems = [
    { id: "all", name: "All", slug: "all", icon: "📚" },
    ...matchedCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "📦",
    })),
  ];


  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (priceRange[0] > 0 || priceRange[1] < MAX_PRICE) count++;
    if (productType !== "all") count++;
    if (minRating > 0) count++;
    if (onSaleOnly) count++;
    if (featuredOnly) count++;
    return count;
  }, [priceRange, productType, minRating, onSaleOnly, featuredOnly]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, MAX_PRICE]);
    setSortBy("newest");
    setActiveCategory("All");
    setProductType("all");
    setMinRating(0);
    setOnSaleOnly(false);
    setFeaturedOnly(false);
    setSearchParams(new URLSearchParams(), { replace: true });
  };


  return (
    <AppLayout>
      <SEO
        title="Explore — Courses, Books & Kits"
        description="Browse curated courses, books, study kits, and prompt libraries — every item vetted by ASIKON mentors."
        url="https://asikonpro.lovable.app/shop"
      />
      <div className="container-editorial pb-8 lg:pb-16">

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">
          {/* Desktop sticky filter rail */}
          <div className="lg:sticky lg:top-[calc(var(--app-header-h)+1rem)] lg:self-start">
            <DesktopFilterRail
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              maxPriceLimit={MAX_PRICE}
              productType={productType}
              onProductTypeChange={handleTypeChange}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              onSaleOnly={onSaleOnly}
              onOnSaleChange={setOnSaleOnly}
              featuredOnly={featuredOnly}
              onFeaturedChange={setFeaturedOnly}
              activeFiltersCount={activeFiltersCount}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="min-w-0 space-y-4 lg:space-y-6">
            {/* Search & Filters (mobile sheet) */}
            <div className="lg:[&>div>div>button:last-child]:hidden">
              <ShopFilters
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                sortBy={sortBy}
                onSortChange={setSortBy}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                maxPriceLimit={MAX_PRICE}
                activeFiltersCount={activeFiltersCount}
                onClearFilters={handleClearFilters}
                productType={productType}
                onProductTypeChange={handleTypeChange}
                minRating={minRating}
                onMinRatingChange={setMinRating}
                onSaleOnly={onSaleOnly}
                onOnSaleChange={setOnSaleOnly}
                featuredOnly={featuredOnly}
                onFeaturedChange={setFeaturedOnly}
              />
            </div>

            {/* Categories Carousel */}
            {categoriesLoading ? (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            ) : (
              <CategoryCarousel
                categories={categoryItems}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              {productsLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <span>
                  {filteredProducts?.length || 0} learning resources found
                  {searchQuery.trim() && (
                    <> for <span className="text-foreground font-medium">"{searchQuery}"</span></>
                  )}
                </span>
              )}
              {searchQuery.trim() && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="text-primary hover:underline text-xs font-medium shrink-0"
                >
                  Clear search
                </button>
              )}
            </div>


            {/* Products Grid */}
            <div>
              {productsLoading ? (
                <div className={activeCategory === "Courses" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6" : "grid-products"}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[4/5] rounded-2xl" />
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts && filteredProducts.length > 0 ? (
                <div className={activeCategory === "Courses" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6" : "grid-products"}>
                  {filteredProducts.map((product, idx) => (
                    <Reveal
                      key={product.id}
                      variant="fade-up"
                      staggerIndex={Math.min(idx, 8)}
                      className="h-full"
                    >
                      <Link
                        to={`/product/${product.slug}`}
                        className="block h-full focus-ring rounded-2xl"
                      >
                        {activeCategory === "Courses" ? (
                          <CourseVideoCard
                            product={{
                              id: product.id,
                              name: product.name,
                              brand: "Asikon Academy",
                              price: product.price,
                              originalPrice: product.original_price || undefined,
                              image: product.image_url || "/placeholder.svg",
                              rating: product.rating || 0,
                              reviews: product.review_count || 0,
                              isNew: false,
                              isTrending: product.is_featured || false,
                            }}
                          />
                        ) : (
                          <ProductCard
                            product={{
                              id: product.id,
                              name: product.name,
                              brand: "Asikon Academy",
                              price: product.price,
                              originalPrice: product.original_price || undefined,
                              image: product.image_url || "/placeholder.svg",
                              rating: product.rating || 0,
                              reviews: product.review_count || 0,
                              isNew: false,
                              isTrending: product.is_featured || false,
                            }}
                          />
                        )}
                      </Link>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-border bg-card">
                  <p className="text-muted-foreground mb-4">No products match your filters.</p>
                  {(searchQuery || activeFiltersCount > 0) && (
                    <button
                      onClick={handleClearFilters}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Shop;
