import { useState } from "react";
import { Link } from "react-router-dom";
import { usePublicDesigns } from "@/hooks/usePodDesigns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, ShieldCheck, Star, Search, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  { id: "all", label: "All" },
  { id: "quotes", label: "Quotes" },
  { id: "anime", label: "Anime" },
  { id: "minimal", label: "Minimal" },
  { id: "street", label: "Street" },
  { id: "nature", label: "Nature" },
];

export function GalleryTab() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: designs, isLoading, error } = usePublicDesigns(selectedCategory);

  const filteredDesigns = designs?.filter(design => 
    design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search designs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex-shrink-0 rounded-lg ${selectedCategory === cat.id ? "gradient-primary border-0" : ""}`}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Designs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ImageOff className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="font-semibold mb-2">Failed to load designs</h3>
          <p className="text-muted-foreground text-sm">Please try again later</p>
        </div>
      ) : filteredDesigns && filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredDesigns.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No designs found</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {designs?.length === 0 
              ? "Be the first to upload a design!" 
              : "Try adjusting your search or browse a different category"
            }
          </p>
          <Link to="/pod/upload">
            <Button className="gradient-primary border-0">
              Upload Design
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function DesignCard({ design }: { design: any }) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link
      to={`/pod/upload?design=${design.id}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50 border border-border/50 group-hover:border-primary/50 transition-all">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <ImageOff className="h-8 w-8 text-muted-foreground" />
          </div>
        ) : (
          <img
            src={design.image_url}
            alt={design.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <Button size="sm" className="w-full gradient-primary border-0">
              Customize
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
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors ml-auto"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Heart className="h-4 w-4 text-white" />
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
            <span>{design.sales_count || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}