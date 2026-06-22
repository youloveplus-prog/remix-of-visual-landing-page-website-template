import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  GraduationCap,
  BookOpen,
  Backpack,
  Wand2,
  Bot,
  Laptop,
  Package,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string;
  href?: string;
}

interface CategoryCarouselProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (categoryName: string) => void;
  className?: string;
}

const ICON_BY_SLUG: Record<string, LucideIcon> = {
  all: LayoutGrid,
  courses: GraduationCap,
  books: BookOpen,
  kits: Backpack,
  prompts: Wand2,
  "ai-tutor": Bot,
  gadgets: Laptop,
};

function getIcon(category: Category): LucideIcon {
  if (category.slug && ICON_BY_SLUG[category.slug]) return ICON_BY_SLUG[category.slug];
  const key = category.name.toLowerCase();
  if (key.includes("course")) return GraduationCap;
  if (key.includes("book")) return BookOpen;
  if (key.includes("kit")) return Backpack;
  if (key.includes("prompt")) return Wand2;
  if (key.includes("tutor") || key.includes("ai")) return Bot;
  if (key.includes("gadget") || key.includes("tech")) return Laptop;
  if (key === "all") return LayoutGrid;
  return Package;
}

export function CategoryCarousel({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  className 
}: CategoryCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 3,
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={cn("relative", className)}>
      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/90 border border-border shadow-sm hover:bg-secondary transition-colors hidden md:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-background/90 border border-border shadow-sm hover:bg-secondary transition-colors hidden md:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden mx-4 md:mx-6">
        <div className="flex gap-2">
          {categories.map((category) => {
            const isActive = activeCategory === category.name;
            const Icon = getIcon(category);
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange?.(category.name)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all flex-shrink-0",
                  isActive
                    ? "gradient-primary text-primary-foreground border-transparent shadow-md glow-primary"
                    : "bg-card text-foreground border-border hover:border-primary/40"
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
