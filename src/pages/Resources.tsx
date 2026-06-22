import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { SEO } from "@/components/SEO";
import { SITE_URL } from "@/config/site";
import { RESOURCES, RESOURCE_TAGS } from "@/data/resources";
import { FeaturedEventCard } from "@/components/resources/FeaturedEventCard";
import { ResourceSearchBar } from "@/components/resources/ResourceSearchBar";
import { ResourceTagBar } from "@/components/resources/ResourceTagBar";
import { ResourceCarousel } from "@/components/resources/ResourceCarousel";
import { ResourceGrid } from "@/components/resources/ResourceGrid";

// Editable in one place — the featured event banner.
const FEATURED_EVENT = {
  title: "The Asikon Live Summit",
  date: "Coming up July 9th",
  target: "2026-07-09T15:00:00Z",
  description:
    "A free 90-minute session on building your own AI tutor — from first prompt to a working study plan for any subject.",
  ctaHref: "/auth?intent=event",
  ctaLabel: "Secure your free seat",
};

export default function Resources() {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const trending = useMemo(
    () => RESOURCES.filter((r) => r.trending),
    [],
  );

  const recent = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      if (q) {
        const hay = `${r.title} ${r.excerpt} ${r.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (tags.length > 0 && !tags.some((t) => r.tags.includes(t))) return false;
      return true;
    }).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  }, [query, tags]);

  const toggleTag = (t: string) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <AppLayout>
      <SEO
        title="Resources — Asikon"
        description="Free guides, prompts, and tutorials from Asikon. Learn AI, study smarter, and ship work you're proud of."
        url={`${SITE_URL}/resources`}
      />
      <MobilePage maxWidth="wide" spacing="space-y-10 sm:space-y-14">
        <header className="text-center pt-2">
          <p className="font-dot text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            By: Asikon Academy
          </p>
          <h1 className="sr-only">Asikon Resources</h1>
        </header>

        <FeaturedEventCard {...FEATURED_EVENT} />

        <div className="space-y-4">
          <ResourceSearchBar value={query} onChange={setQuery} />
          <ResourceTagBar
            tags={RESOURCE_TAGS}
            selected={tags}
            onToggle={toggleTag}
            onClear={() => setTags([])}
          />
        </div>

        <ResourceCarousel title="Trending tools." resources={trending} />

        <ResourceGrid
          title="Most recent updates."
          resources={recent}
          emptyAction={
            (query || tags.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setTags([]);
                }}
                className="text-sm font-medium text-primary underline underline-offset-4"
              >
                Clear filters
              </button>
            )
          }
        />
      </MobilePage>
    </AppLayout>
  );
}
