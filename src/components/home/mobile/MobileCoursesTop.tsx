import { Link } from "react-router-dom";
import { Star, ArrowUpRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";

const fallbackCourses = [
  { id: "f1", name: "Advanced UX Design Course for Senior Designers", image_url: courseAiMl, rating: 4.8, review_count: 87, slug: "advanced-ux" },
  { id: "f2", name: "Basic UX Design Course – The Beginner Designer", image_url: coursePython, rating: 4.7, review_count: 55, slug: "basic-ux" },
  { id: "f3", name: "Prompt Engineering Masterclass", image_url: promptLibrary, rating: 4.9, review_count: 132, slug: "prompts" },
];

export const MobileCoursesTop = () => {
  const { data: products } = useProducts({ limit: 6 });
  const courses = (products && products.length >= 2 ? products.slice(0, 4) : fallbackCourses) as any[];

  return (
    <section className="md:hidden section-x">
      <div className="flex flex-col items-center text-center gap-1 mb-4">
        <h2 className="font-display font-bold leading-[0.95] tracking-[-0.035em] text-[26px] sm:text-[34px] text-brand-gradient">Popular Courses</h2>
        <Link to="/shop?type=courses" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">See all</Link>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 snap-x snap-mandatory">
        {courses.map((c) => (
          <Link
            key={c.id}
            to={`/product/${c.slug ?? c.id}`}
            className="snap-start shrink-0 w-[72%] rounded-2xl overflow-hidden glass border border-border/60 pressable focus-ring"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={c.image_url || courseAiMl} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-background/80 backdrop-blur text-foreground">
                Best Seller
              </span>
            </div>
            <div className="p-3 space-y-1.5">
              <p className="text-sm font-semibold leading-tight line-clamp-2">{c.name}</p>
              {typeof c.rating === "number" && c.rating > 0 ? (
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{c.rating.toFixed(1)}</span>
                  {typeof c.review_count === "number" && c.review_count > 0 && (
                    <span>({c.review_count} {c.review_count === 1 ? "Review" : "Reviews"})</span>
                  )}
                </div>
              ) : null}
              <div className="flex items-center justify-between pt-1.5">
                <span className="text-xs font-semibold text-primary">Visit Course</span>
                <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center">
                  <ArrowUpRight className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
