import { Palette, Heart, ShoppingCart, Plus, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Design {
  id: string;
  title: string;
  image: string;
  salesCount: number;
  likes: number;
  earnings?: number;
}

interface ProfileDesignsTabProps {
  designs: Design[];
  isOwnProfile?: boolean;
  onCreateDesign?: () => void;
}

export function ProfileDesignsTab({ designs, isOwnProfile, onCreateDesign }: ProfileDesignsTabProps) {
  // Calculate totals
  const totalSales = designs.reduce((acc, d) => acc + d.salesCount, 0);
  const totalLikes = designs.reduce((acc, d) => acc + d.likes, 0);
  const totalEarnings = designs.reduce((acc, d) => acc + (d.earnings || 0), 0);

  return (
    <div>
      {/* Stats & CTA */}
      {designs.length > 0 && (
        <div className="p-4 glass border-b border-border">
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-xl font-bold">{designs.length}</p>
              <p className="text-[10px] text-muted-foreground">Designs</p>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">{totalSales}</p>
              <p className="text-[10px] text-muted-foreground">Total Sales</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{totalLikes}</p>
              <p className="text-[10px] text-muted-foreground">Total Likes</p>
            </div>
          </div>
          
          {isOwnProfile && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Earnings</p>
                  <p className="text-lg font-bold text-emerald-400">${totalEarnings.toFixed(2)}</p>
                </div>
              </div>
              <Button size="sm" onClick={onCreateDesign} className="gradient-primary border-0">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Designs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
        {designs.map((design) => (
          <DesignCard key={design.id} design={design} />
        ))}
      </div>

      {designs.length === 0 && (
        <div className="py-16 text-center px-4">
          <Palette className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground mb-4">No designs yet</p>
          {isOwnProfile && (
            <Button onClick={onCreateDesign} className="gradient-primary border-0">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Design
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function DesignCard({ design }: { design: Design }) {
  return (
    <div className="rounded-xl overflow-hidden glass border border-border/50 hover-lift cursor-pointer group">
      <div className="relative aspect-square">
        <img 
          src={design.image} 
          alt={design.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <div className="flex items-center gap-3 text-white text-sm">
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {design.likes}
            </span>
            <span className="flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              {design.salesCount}
            </span>
          </div>
        </div>
        
        {/* Sales Badge */}
        {design.salesCount > 0 && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/90 text-white flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {design.salesCount} sold
          </div>
        )}
      </div>
      
      <div className="p-2.5">
        <p className="text-xs font-medium line-clamp-2">{design.title}</p>
      </div>
    </div>
  );
}
