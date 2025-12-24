import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Upload, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Truck,
  Star,
  ChevronRight,
  Coins
} from "lucide-react";
import { useFeaturedDesigns } from "@/hooks/usePodDesigns";
import { Skeleton } from "@/components/ui/skeleton";

const Pod = () => {
  const { data: featuredDesigns, isLoading } = useFeaturedDesigns(6);

  return (
    <AppLayout>
      <div className="space-y-8 pb-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl mx-4 lg:mx-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 px-6 py-12 lg:py-20 text-center">
            <Badge className="mb-4 gradient-primary border-0">
              <Sparkles className="h-3 w-3 mr-1" />
              Print-on-Demand
            </Badge>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-gradient">
              Design Your Own T-Shirt
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Create custom apparel with your unique designs. Upload artwork, 
              choose your style, and we'll print & ship it directly to you.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" />
                <span>5-7 Days Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 text-amber-400" />
                <span>4.8/5 Reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* Choose Your Path */}
        <section className="px-4 lg:px-0">
          <h2 className="text-xl font-bold mb-4 text-center">Choose Your Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Browse Designs */}
            <Link 
              to="/pod/designs"
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <Palette className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg mb-2">Choose a Design</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Browse our gallery of community designs. Find something you love and order instantly.
                </p>
                <div className="flex items-center text-primary text-sm font-medium">
                  Browse Gallery <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>

            {/* Upload Design */}
            <Link 
              to="/pod/upload"
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-accent/50 transition-all duration-300 p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-accent to-accent/70 flex items-center justify-center mb-4">
                  <Upload className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-lg mb-2">Upload Your Design</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Have your own artwork? Upload it and create a custom product just for you or sell it publicly.
                </p>
                <div className="flex items-center text-accent text-sm font-medium">
                  Start Creating <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Designs */}
        <section className="px-4 lg:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Featured Designs</h2>
            <Link to="/pod/designs" className="text-sm text-primary flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredDesigns && featuredDesigns.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredDesigns.map((design) => (
                <Link
                  key={design.id}
                  to={`/pod/designs?id=${design.id}`}
                  className="group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50 border border-border/50 group-hover:border-primary/50 transition-all">
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {design.sales_count > 10 && (
                      <Badge className="absolute top-2 left-2 text-xs gradient-primary border-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium text-sm mt-2 line-clamp-1">{design.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>by {design.profiles?.username || "Designer"}</span>
                    {design.profiles?.is_verified && (
                      <ShieldCheck className="h-3 w-3 text-primary" />
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No designs yet. Be the first to upload!</p>
              <Button asChild className="mt-4">
                <Link to="/pod/upload">Upload Design</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Creator Benefits */}
        <section className="px-4 lg:px-0">
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-secondary/20 p-6 lg:p-8">
            <h2 className="text-xl font-bold mb-6 text-center">Why Create with Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3">
                  <Coins className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Earn Coins</h3>
                <p className="text-sm text-muted-foreground">
                  Get rewarded for every design you upload and sell. Climb the creator leaderboard!
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent to-accent/70 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Build Your Brand</h3>
                <p className="text-sm text-muted-foreground">
                  Showcase your designs, gain followers, and build your creative reputation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-success to-success/70 flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">We Handle Everything</h3>
                <p className="text-sm text-muted-foreground">
                  Printing, shipping, and customer service - we take care of it all for you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Pod;
