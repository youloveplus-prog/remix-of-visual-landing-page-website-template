import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { MobilePage } from "@/components/layout/MobilePage";
import { SEO } from "@/components/SEO";
import { SITE_URL } from "@/config/site";
import { Sparkles, Users, MessageCircle, ShoppingBag } from "lucide-react";
import { RESOURCES, getResourceBySlug } from "@/data/resources";
import { ResourceCarousel } from "@/components/resources/ResourceCarousel";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CrossLinkChips } from "@/components/connect/CrossLinkChips";
import { RelatedRail } from "@/components/connect/RelatedRail";
import { useRecommendations } from "@/hooks/useRecommendations";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function ResourceDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const resource = getResourceBySlug(slug);

  const related = useMemo(() => {
    if (!resource) return [];
    return RESOURCES.filter(
      (r) => r.category === resource.category && r.slug !== resource.slug,
    ).slice(0, 6);
  }, [resource]);

  if (!resource) {
    return <Navigate to="/resources" replace />;
  }

  const paragraphs = resource.body.split(/\n\n+/);

  return (
    <AppLayout>
      <SEO
        title={`${resource.title} — Asikon Resources`}
        description={resource.excerpt}
        url={`${SITE_URL}/resources/${resource.slug}`}
        image={resource.cover}
      />
      <MobilePage maxWidth="reading" spacing="space-y-8">
        <Breadcrumbs
          eyebrow="Resource"
          items={[
            { label: "Home", to: "/" },
            { label: "Resources", to: "/resources" },
            { label: resource.title },
          ]}
        />

        <header className="space-y-4">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {resource.category}
          </span>
          <h1 className="font-display font-bold text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-foreground">
            {resource.title}
          </h1>
          <p className="font-dot text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Published {formatDate(resource.publishedAt)}
          </p>
        </header>

        <div className="relative overflow-hidden rounded-[28px] aspect-[16/10] bg-muted border border-border/60">
          <img
            src={resource.cover}
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>

        <article className="space-y-5 text-[16px] leading-[1.7] text-foreground/90">
          <p className="text-lg text-foreground/80 font-display italic">
            {resource.excerpt}
          </p>
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        {resource.ctaUrl && (
          <a
            href={resource.ctaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            Open resource
          </a>
        )}

        <CrossLinkChips
          eyebrow="Keep exploring"
          links={[
            { label: "Ask AI Tutor about this", to: `/ai-tutor?topic=${encodeURIComponent(resource.title)}`, icon: Sparkles },
            { label: "Find a course", to: "/courses", icon: ShoppingBag },
            { label: "Book a mentor", to: "/mentors", icon: Users },
            { label: "Discuss in Community", to: "/community", icon: MessageCircle },
          ]}
        />
      </MobilePage>

      {related.length > 0 && (
        <MobilePage maxWidth="wide" spacing="space-y-6" className="!pt-2">
          <ResourceCarousel title="Related resources." resources={related} />
        </MobilePage>
      )}

      <MobilePage maxWidth="wide" spacing="space-y-6" className="!pt-2">
        <RelatedRailFromHook title="Continue your journey" />
      </MobilePage>
    </AppLayout>
  );
}

function RelatedRailFromHook({ title }: { title: string }) {
  const { items, isLoading } = useRecommendations({ kind: "resource" });
  return (
    <RelatedRail
      eyebrow="You may also like"
      title={title}
      items={items}
      isLoading={isLoading}
      viewAllHref="/shop"
      viewAllLabel="Browse the shop"
    />
  );
}
