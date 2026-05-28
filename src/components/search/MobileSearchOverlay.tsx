import { Search, X, TrendingUp, Clock, ArrowRight, GraduationCap, Package, Wrench, Users, MessageSquare, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGlobalSearch,
  getRecentSearches,
  pushRecentSearch,
  clearRecentSearches,
  TRENDING_TERMS,
} from "@/hooks/useGlobalSearch";
import { track } from "@/lib/analytics";

interface MobileSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const quickAccess = [
  { icon: <GraduationCap className="w-4 h-4" />, label: "Courses", href: "/courses" },
  { icon: <Package className="w-4 h-4" />, label: "Digital", href: "/digital" },
  { icon: <Wrench className="w-4 h-4" />, label: "Services", href: "/services" },
  { icon: <Users className="w-4 h-4" />, label: "Mentors", href: "/mentors" },
  { icon: <MessageSquare className="w-4 h-4" />, label: "Community", href: "/community" },
];

export function MobileSearchOverlay({ open, onClose }: MobileSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data, isFetching } = useGlobalSearch(query);

  useEffect(() => {
    if (open) {
      setRecent(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const go = (to: string, term?: string) => {
    if (term) pushRecentSearch(term);
    onClose();
    setQuery("");
    navigate(to);
  };

  const submit = (term: string) => {
    if (!term.trim()) return;
    pushRecentSearch(term);
    void track("search_performed", { q: term, surface: "mobile" });
    onClose();
    setQuery("");
    navigate(`/shop?q=${encodeURIComponent(term)}`);
  };

  const showResults = query.trim().length >= 2;
  const totalResults =
    (data?.products.length ?? 0) +
    (data?.courses.length ?? 0) +
    (data?.digital.length ?? 0) +
    (data?.services.length ?? 0) +
    (data?.mentors.length ?? 0) +
    (data?.posts.length ?? 0);

  return (
    <div className="fixed inset-0 z-50 bg-background animate-fade-in">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search courses, mentors, products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit(query)}
            className="pl-10 pr-10 h-10 bg-secondary border-border"
          />
          {query && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7" onClick={() => setQuery("")}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
        {showResults ? (
          isFetching && totalResults === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Searching…</p>
          ) : totalResults === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No results for "{query}".</p>
          ) : (
            <div className="space-y-5">
              <Group icon={<GraduationCap className="w-3.5 h-3.5" />} title="Courses" items={data?.courses ?? []} onPick={(i) => go(`/content/${i.slug}`, query)} seeAll={() => go(`/courses`)} />
              <Group icon={<Package className="w-3.5 h-3.5" />} title="Digital" items={data?.digital ?? []} onPick={(i) => go(`/content/${i.slug}`, query)} seeAll={() => go(`/digital`)} />
              <Group icon={<Wrench className="w-3.5 h-3.5" />} title="Services" items={data?.services ?? []} onPick={(i) => go(`/content/${i.slug}`, query)} seeAll={() => go(`/services`)} />
              <Group
                icon={<ShoppingBag className="w-3.5 h-3.5" />}
                title="Products"
                items={(data?.products ?? []).map((p) => ({ id: p.id, title: p.name, slug: p.slug }))}
                onPick={(i) => go(`/product/${i.slug}`, query)}
                seeAll={() => go(`/shop?q=${encodeURIComponent(query)}`)}
              />
              <Group
                icon={<Users className="w-3.5 h-3.5" />}
                title="Mentors"
                items={(data?.mentors ?? []).map((m) => ({ id: m.id, title: m.name, slug: m.slug }))}
                onPick={() => go(`/mentors`, query)}
                seeAll={() => go(`/mentors`)}
              />
              <Group
                icon={<MessageSquare className="w-3.5 h-3.5" />}
                title="Community"
                items={(data?.posts ?? []).map((p) => ({ id: p.id, title: (p.content ?? "").slice(0, 70) || "Post", slug: p.user_id }))}
                onPick={(i) => go(`/profile/${i.slug}`, query)}
                seeAll={() => go(`/community`)}
              />
            </div>
          )
        ) : (
          <>
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Quick Access</h4>
              <div className="flex gap-2 flex-wrap">
                {quickAccess.map((c) => (
                  <button
                    key={c.label}
                    className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-lg hover:bg-secondary/80"
                    onClick={() => go(c.href)}
                  >
                    {c.icon}
                    <span className="text-sm font-medium">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {recent.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    Recent
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground h-auto p-0"
                    onClick={() => {
                      clearRecentSearches();
                      setRecent([]);
                    }}
                  >
                    Clear all
                  </Button>
                </div>
                <div className="space-y-1">
                  {recent.map((s, i) => (
                    <button
                      key={i}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-secondary rounded-lg"
                      onClick={() => submit(s)}
                    >
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                Trending
              </h4>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TERMS.map((s) => (
                  <button
                    key={s}
                    className="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-full flex items-center gap-1.5"
                    onClick={() => submit(s)}
                  >
                    {s}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Group({
  icon,
  title,
  items,
  onPick,
  seeAll,
}: {
  icon: React.ReactNode;
  title: string;
  items: Array<{ id: string; title: string; slug: string }>;
  onPick: (i: { id: string; title: string; slug: string }) => void;
  seeAll: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
          {icon}
          {title}
        </h4>
        <button className="text-xs text-primary" onClick={seeAll}>See all</button>
      </div>
      <div className="space-y-1">
        {items.map((i) => (
          <button
            key={i.id}
            onClick={() => onPick(i)}
            className="w-full text-left px-3 py-2.5 text-sm hover:bg-secondary rounded-lg line-clamp-1"
          >
            {i.title}
          </button>
        ))}
      </div>
    </div>
  );
}
