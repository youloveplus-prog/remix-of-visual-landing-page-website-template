import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Heart,
  ShieldCheck,
  Star,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { usePublicDesigns } from "@/hooks/usePodDesigns";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { id: "all", label: "All", icon: "🎨" },
  { id: "quotes", label: "Quotes", icon: "💬" },
  { id: "anime", label: "Anime", icon: "🎌" },
  { id: "minimal", label: "Minimal", icon: "⬜" },
  { id: "street", label: "Street", icon: "🛹" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "abstract", label: "Abstract", icon: "🎨" },
  { id: "gaming", label: "Gaming", icon: "🎮" },
];

const sortOptions = [
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "newest", label: "Newest", icon: Clock },
  { id: "popular", label: "Popular", icon: Star },
];

const PodDesigns = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  
  const { data: designs, isLoading } = usePublicDesigns(selectedCategory);

  const filteredDesigns = designs?.filter(design => 
    design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="px-4 lg:px-0">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/pod" className="p-2 rounded-full hover:bg-secondary transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Design Gallery</h1>
              <p className="text-muted-foreground text-sm">Browse community designs</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 ${selectedCategory === cat.id ? "gradient-primary border-0" : ""}`}
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 px-4 lg:px-0">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  sortBy === option.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <option.icon className="h-3 w-3" />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Designs Grid */}
        <div className="px-4 lg:px-0">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredDesigns && filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDesigns.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No designs found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Try adjusting your search or browse a different category
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

function DesignCard({ design }: { design: any }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={`/pod/upload?design=${design.id}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50 border border-border/50 group-hover:border-primary/50 transition-all">
        {/* Design Image */}
        <img
          src={design.image_url}
          alt={design.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <Button size="sm" className="w-full gradient-primary border-0">
              Customize & Buy
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          {design.sales_count > 10 && (
            <Badge className="text-xs gradient-primary border-0">
              <TrendingUp className="h-3 w-3 mr-1" />
              Popular
            </Badge>
          )}
          <button 
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Toggle favorite
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-2">
        <h3 className="font-medium text-sm line-clamp-1">{design.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>by {design.profiles?.username || "Designer"}</span>
            {design.profiles?.is_verified && (
              <ShieldCheck className="h-3 w-3 text-primary" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 text-amber-400" />
            <span>{design.sales_count} sold</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PodDesigns;
