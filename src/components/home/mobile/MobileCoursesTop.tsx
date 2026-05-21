import { Link } from "react-router-dom";
import { Search, Palette, Wallet, Briefcase, Gamepad2, Smartphone, Code2, Star, ArrowUpRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";

const categories = [
  { icon: Palette, label: "Design", href: "/shop?category=design" },
  { icon: Wallet, label: "Finance", href: "/shop?category=finance" },
  { icon: Briefcase, label: "Business", href: "/shop?category=business" },
  { icon: Gamepad2, label: "Games", href: "/shop?category=games" },
  { icon: Smartphone, label: "Apps", href: "/shop?category=apps" },
  { icon: Code2, label: "Dev", href: "/shop?category=dev" },
];

const instructors = [
  { name: "Michael", color: "from-red-500/40 to-red-700/40" },
  { name: "Oliver", color: "from-amber-500/40 to-orange-700/40" },
  { name: "Henny", color: "from-emerald-500/40 to-teal-700/40" },
  { name: "George", color: "from-indigo-500/40 to-purple-700/40" },
  { name: "Aria", color: "from-pink-500/40 to-rose-700/40" },
];

const fallbackCourses = [
  { id: "f1", name: "Advanced UX Design Course for Senior Designers", image_url: courseAiMl, rating: 4.8, review_count: 87, slug: "advanced-ux" },
  { id: "f2", name: "Basic UX Design Course – The Beginner Designer", image_url: coursePython, rating: 4.7, review_count: 55, slug: "basic-ux" },
  { id: "f3", name: "Prompt Engineering Masterclass", image_url: promptLibrary, rating: 4.9, review_count: 132, slug: "prompts" },
];

export const MobileCoursesTop = () => {
  const { data: products } = useProducts({ limit: 6 });
  const courses = (products && products.length >= 2 ? products.slice(0, 4) : fallbackCourses) as any[];

  return (
    <div className="md:hidden space-y-4 section-x">
      {/* Search */}
      <Link
        to="/shop"
        className="flex items-center gap-2 h-11 px-4 rounded-2xl glass border border-border/60 focus-ring pressable"
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground flex-1 truncate">Search any course</span>
        <span className="text-xs text-primary font-medium">See all</span>
      </Link>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-base">Categories</h2>
          <Link to="/shop" className="text-xs text-primary font-medium">See all</Link>
        </div>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {categories.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              to={href}
              className="shrink-0 flex flex-col items-center gap-1.5 pressable focus-ring"
            >
              <div className="w-14 h-14 rounded-2xl glass border border-border/60 flex items-center justify-center bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.18)]">
                <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-medium text-foreground/80">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Courses */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-base">Popular Courses</h2>
          <Link to="/shop?type=courses" className="text-xs text-primary font-medium">See all</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1 snap-x snap-mandatory">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/product/${c.slug ?? c.id}`}
              className="snap-start shrink-0 w-[72%] rounded-2xl overflow-hidden glass border border-border/60 pressable focus-ring"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={c.image_url || courseAiMl}
                  alt={c.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-background/80 backdrop-blur text-foreground">
                  Best Seller
                </span>
              </div>
              <div className="p-3 space-y-1.5">
                <p className="text-sm font-semibold leading-tight line-clamp-2">{c.name}</p>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{c.rating ?? 4.8}</span>
                  <span>({c.review_count ?? 80} Reviews)</span>
                </div>
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

      {/* Popular Instructors */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-base">Popular Instructors</h2>
          <Link to="/mentorship" className="text-xs text-primary font-medium">See all</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {instructors.map((p) => (
            <Link
              key={p.name}
              to="/mentorship"
              className="shrink-0 flex flex-col items-center gap-1.5 pressable focus-ring"
            >
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${p.color} border border-border/60 flex items-center justify-center text-base font-bold text-foreground/90 shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.2)]`}>
                {p.name[0]}
              </div>
              <span className="text-[11px] font-medium text-foreground/80">{p.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
