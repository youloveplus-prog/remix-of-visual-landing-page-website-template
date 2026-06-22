import { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Star, GraduationCap, Languages, ShieldCheck, Sparkles, BookOpen, MessageCircle, Users } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { MobilePage } from "@/components/layout/MobilePage";
import { PageHero } from "@/components/ui/page-hero";
import { DetailSection } from "@/components/ui/detail-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CrossLinkChips } from "@/components/connect/CrossLinkChips";
import { RelatedRail } from "@/components/connect/RelatedRail";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useMentors, type Mentor } from "@/hooks/useMentors";
import { useMentorVerificationsMap } from "@/hooks/useTrust";
import { VerifiedTutorBadge } from "@/components/mentorship/VerifiedTutorBadge";
import { MentorWaitlistSheet } from "@/components/mentorship/MentorWaitlistSheet";
import { SITE_URL } from "@/config/site";

const FAQ = [
  {
    q: "How are mentors vetted?",
    a: "Every mentor passes a background check, a teaching trial, and a parent-feedback review before being listed.",
  },
  {
    q: "How long is each session?",
    a: "Weekly 1-on-1 sessions are 45 minutes online, with a short parent recap afterwards.",
  },
  {
    q: "Can I switch mentors?",
    a: "Yes — if the match isn't right, we'll rematch your child at no charge.",
  },
  {
    q: "When does mentorship launch?",
    a: "We're onboarding cohorts from the waitlist now. Reserve a slot to be invited first.",
  },
];

export default function MentorDetail() {
  const { slug } = useParams();
  const { data: mentors, isLoading } = useMentors();
  const { data: verifications } = useMentorVerificationsMap();
  const [openSheet, setOpenSheet] = useState(false);

  const mentor = useMemo<Mentor | undefined>(
    () => mentors?.find((m) => m.slug === slug),
    [mentors, slug],
  );

  if (isLoading) {
    return (
      <AppLayout>
        <MobilePage maxWidth="reading" spacing="space-y-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </MobilePage>
      </AppLayout>
    );
  }

  if (!mentor) return <Navigate to="/mentors" replace />;

  const verification = verifications?.[mentor.id];

  return (
    <AppLayout>
      <SEO
        title={`${mentor.name} — 1-on-1 Mentor`}
        description={mentor.bio ?? `Book ${mentor.name} for personal 1-on-1 mentorship on Asikon.`}
        url={`${SITE_URL}/mentors/${mentor.slug}`}
        type="article"
      />
      <MobilePage maxWidth="reading" spacing="space-y-7" className="pb-sticky-cta lg:pb-6">
        <Breadcrumbs
          eyebrow="Mentor"
          items={[
            { label: "Mentors", to: "/mentors" },
            { label: mentor.name },
          ]}
        />

        <PageHero
          title={mentor.name}
          meta={
            <span className="inline-flex items-center gap-3 text-[12.5px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {mentor.rating.toFixed(1)}
              </span>
              <span>·</span>
              <span>{mentor.experience_years}+ yrs</span>
              <VerifiedTutorBadge verification={verification} compact />
            </span>
          }
        />

        {mentor.bio && (
          <DetailSection divided={false}>
            <p className="text-[14.5px] leading-relaxed text-foreground/85">{mentor.bio}</p>
          </DetailSection>
        )}

        <DetailSection title="Subjects">
          <div className="flex flex-wrap gap-1.5">
            {mentor.subjects.map((s) => (
              <Badge key={s} variant="outline" className="text-[11.5px] font-normal">{s}</Badge>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="At a glance">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            <li className="flex items-center gap-2"><Languages className="h-4 w-4 text-foreground/60" /> {mentor.languages.join(" · ")}</li>
            <li className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-foreground/60" /> Ages {mentor.for_age_min}–{mentor.for_age_max}</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-foreground/60" /> Background-checked tutor</li>
            <li className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-foreground/60" /> Weekly 45-min 1-on-1 sessions</li>
          </ul>
        </DetailSection>

        <DetailSection title="FAQ">
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-[14px]">{item.q}</AccordionTrigger>
                <AccordionContent className="text-[13.5px] text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DetailSection>

        <CrossLinkChips
          eyebrow="Explore more"
          links={[
            { label: "Ask AI Tutor", to: `/ai-tutor?topic=${encodeURIComponent(mentor.subjects[0] ?? mentor.name)}`, icon: Sparkles },
            { label: "All mentors", to: "/mentors", icon: Users },
            { label: "Discuss in community", to: "/community", icon: MessageCircle },
            { label: "Browse courses", to: "/courses", icon: BookOpen },
          ]}
        />

        <MentorRelatedRail slug={mentor.slug} />

        <div className="hidden lg:flex items-center gap-3 pt-2">
          <Button size="lg" onClick={() => setOpenSheet(true)}>Reserve a slot</Button>
          <Link to="/mentors" className="text-[13px] text-muted-foreground hover:text-foreground underline">View all mentors</Link>
        </div>
      </MobilePage>

      <StickyActionBar>
        <Button size="lg" className="w-full" onClick={() => setOpenSheet(true)}>Reserve a slot</Button>
      </StickyActionBar>

      <MentorWaitlistSheet open={openSheet} onOpenChange={setOpenSheet} mentor={mentor} />
    </AppLayout>
  );
}

function MentorRelatedRail({ slug }: { slug: string }) {
  const { items, isLoading } = useRecommendations({ kind: "mentor", id: slug });
  return (
    <RelatedRail
      title="Continue your journey"
      eyebrow="Related"
      items={items}
      isLoading={isLoading}
      emptyHint="More mentors coming soon."
      viewAllHref="/mentors"
    />
  );
}
