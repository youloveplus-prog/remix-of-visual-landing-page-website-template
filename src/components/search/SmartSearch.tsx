import { Search, X, TrendingUp, Clock, ArrowRight, GraduationCap, Package, Wrench, ShoppingBag, Users, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  useGlobalSearch,
  getRecentSearches,
  pushRecentSearch,
  clearRecentSearches,
  TRENDING_TERMS,
} from "@/hooks/useGlobalSearch";
import { track } from "@/lib/analytics";

interface SmartSearchProps {
  className?: string;
}

export function SmartSearch({ className }: SmartSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data, isFetching } = useGlobalSearch(query);

  useEffect(() => {
    if (isFocused) setRecent(getRecentSearches());
  }, [isFocused]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setIsFocused(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (to: string, term?: string) => {
    if (term) pushRecentSearch(term);
    setIsFocused(false);
    setQuery("");
    navigate(to);
  };

  const submit = (term: string) => {
    if (!term.trim()) return;
    pushRecentSearch(term);
    void track("search_performed", { q: term, surface: "desktop" });
    setIsFocused(false);
    setQuery("");
    navigate(`/shop?q=${encodeURIComponent(term)}`);
  };

  const showEmpty = isFocused && query.trim().length < 2;
  const showResults = isFocused && query.trim().length >= 2;
  const totalResults =
    (data?.products.length ?? 0) +
    (data?.courses.length ?? 0) +
    (data?.digital.length ?? 0) +
    (data?.services.length ?? 0) +
    (data?.mentors.length ?? 0) +
    (data?.posts.length ?? 0);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search courses, products, mentors, services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit(query);
            if (e.key === "Escape") setIsFocused(false);
          }}
          className="pl-10 pr-10 h-10 bg-secondary border-border focus:border-primary"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7"
            onClick={() => setQuery("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showEmpty && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {recent.length > 0 && (
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Recent
                </h4>
                <button
                  className="text-[10px] text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    clearRecentSearches();
                    setRecent([]);
                  }}
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recent.map((s, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm hover:bg-secondary rounded"
                    onClick={() => submit(s)}
                  >
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="p-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Trending
            </h4>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TERMS.map((s) => (
                <button
                  key={s}
                  className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full flex items-center gap-1"
                  onClick={() => submit(s)}
                >
                  {s}
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden max-h-[70vh] overflow-y-auto">
          {isFetching && totalResults === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Searching…</p>
          ) : totalResults === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">No results for "{query}".</p>
          ) : (
            <div className="py-1">
              <Group icon={<GraduationCap className="w-3 h-3" />} title="Courses" items={data?.courses ?? []} onPick={(i) => go(`/content/${i.slug}`, query)} />
              <Group icon={<Package className="w-3 h-3" />} title="Digital" items={data?.digital ?? []} onPick={(i) => go(`/content/${i.slug}`, query)} />
              <Group icon={<Wrench className="w-3 h-3" />} title="Services" items={data?.services ?? []} onPick={(i) => go(`/content/${i.slug}`, query)} />
              <Group
                icon={<ShoppingBag className="w-3 h-3" />}
                title="Products"
                items={(data?.products ?? []).map((p) => ({ id: p.id, title: p.name, slug: p.slug }))}
                onPick={(i) => go(`/product/${i.slug}`, query)}
              />
              <Group
                icon={<Users className="w-3 h-3" />}
                title="Mentors"
                items={(data?.mentors ?? []).map((m) => ({ id: m.id, title: m.name, slug: m.slug }))}
                onPick={() => go(`/mentors`, query)}
              />
              <Group
                icon={<MessageSquare className="w-3 h-3" />}
                title="Community"
                items={(data?.posts ?? []).map((p) => ({ id: p.id, title: (p.content ?? "").slice(0, 70) || "Post", slug: p.user_id }))}
                onPick={(i) => go(`/profile/${i.slug}`, query)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Group({
  icon,
  title,
  items,
  onPick,
}: {
  icon: React.ReactNode;
  title: string;
  items: Array<{ id: string; title: string; slug: string }>;
  onPick: (i: { id: string; title: string; slug: string }) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="px-2 py-1.5">
      <div className="px-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
        {icon}
        {title}
      </div>
      {items.map((i) => (
        <button
          key={i.id}
          onClick={() => onPick(i)}
          className="w-full text-left px-2 py-1.5 text-sm hover:bg-secondary rounded line-clamp-1"
        >
          {i.title}
        </button>
      ))}
    </div>
  );
}
