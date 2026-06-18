import { SITE_URL } from "@/config/site";
import { useState } from "react";
import { SEO } from "@/components/SEO";
import { AppLayout } from "@/components/layout/AppLayout";
import { useMentors, type Mentor } from "@/hooks/useMentors";
import { MentorWaitlistSheet } from "@/components/mentorship/MentorWaitlistSheet";
import { VerifiedTutorBadge } from "@/components/mentorship/VerifiedTutorBadge";
import { useMentorVerificationsMap } from "@/hooks/useTrust";
import { MobileScroller } from "@/components/ui/mobile-scroller";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";
import { Star, GraduationCap, Languages, Sparkles, ShieldCheck, MessageSquare } from "lucide-react";

const Mentors = () => {
  const { data: mentors, isLoading } = useMentors();
  const { data: verifications } = useMentorVerificationsMap();
  const [openSheet, setOpenSheet] = useState(false);
  const [selected, setSelected] = useState<Mentor | null>(null);

  const open = (m?: Mentor) => {
    setSelected(m ?? null);
    setOpenSheet(true);
  };

  return (
    <AppLayout>
      <SEO
        title="1-on-1 Mentorship for Kids"
        description="Book personal Bangla & English tutors for your child on Asikon. Hand-picked mentors, waitlist now open."
        url=`${SITE_URL}/mentors`
      />
      <div className="container-editorial space-y-10 pb-32 pt-2 lg:pt-4">
        {/* Hero */}
        <section className="section-x">
          <div className="relative overflow-hidden rounded-2xl border border-border liquid-glass p-6 lg:p-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary border border-border text-foreground/70 text-[10.5px] font-medium uppercase tracking-[0.16em] px-2.5 py-1 mb-3">
              New · Coming soon
            </span>
            <h1 className="font-display font-semibold text-[26px] lg:text-[40px] leading-[1.1] tracking-tight max-w-2xl mx-auto">
              A personal teacher, just for your child
            </h1>
            <p className="text-[14px] lg:text-[15px] text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
              Book 1-on-1 mentorship with hand-picked tutors in Bangla & English. Reserve your child's slot before public launch.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <Button size="lg" onClick={() => open()}>
                Join the waitlist
              </Button>
            </div>
          </div>
        </section>

        {/* Mentors */}
        <section>
          <div className="section-x">
            <SectionHeader
              title="Meet your mentors"
              subtitle="Verified tutors covering academics, coding, Quran & creative subjects"
            />
          </div>
          {isLoading ? (
            <div className="section-x grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-56 rounded-2xl" />
              ))}
            </div>
          ) : (
            <MobileScroller itemWidthMobile="72%" gridCols="md:grid md:grid-cols-3 lg:grid-cols-4" gap="gap-3">
              {(mentors ?? []).map((m) => (
                <article
                  key={m.id}
                  className="h-full rounded-2xl border border-border liquid-glass p-4 flex flex-col transition-colors hover:bg-secondary/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground font-semibold text-lg shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-[14px] truncate">{m.name}</p>
                        <VerifiedTutorBadge verification={verifications?.[m.id]} compact />
                      </div>
                      <p className="text-[11.5px] text-muted-foreground flex items-center gap-1 tabular-nums">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {m.rating.toFixed(1)} · {m.experience_years}+ yrs
                      </p>
                    </div>
                  </div>
                  {m.bio && (
                    <p className="text-[12.5px] text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{m.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {m.subjects.slice(0, 3).map((s) => (
                      <Badge key={s} variant="outline" className="text-[10.5px] font-normal">{s}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-[11.5px] text-muted-foreground">
                    <Languages className="h-3 w-3" />
                    {m.languages.join(" · ")}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-muted-foreground">
                    <GraduationCap className="h-3 w-3" />
                    Ages {m.for_age_min}–{m.for_age_max}
                  </div>
                  <Button size="sm" variant="outline" className="mt-4" onClick={() => open(m)}>
                    Reserve a slot
                  </Button>
                </article>
              ))}
            </MobileScroller>
          )}
        </section>

        {/* How it works */}
        <section className="section-x">
          <SectionHeader title="How it works" subtitle="Simple, transparent, parent-first" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Sparkles, title: "1. Tell us about your child", text: "Share age, subject and goal — takes a minute." },
              { icon: ShieldCheck, title: "2. We match a vetted mentor", text: "Background-checked, parent-reviewed tutors." },
              { icon: MessageSquare, title: "3. Weekly 1-on-1 sessions", text: "Online classes + monthly progress updates to parents." },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="rounded-2xl liquid-glass border border-border p-4">
                  <div className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center mb-3">
                    <Icon className="h-4 w-4 text-foreground/70" />
                  </div>
                  <p className="font-medium text-[14px]">{s.title}</p>
                  <p className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">{s.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Sticky CTA on mobile */}
      <div className="md:hidden fixed inset-x-0 bottom-[84px] z-30 px-4 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl bg-background/90 backdrop-blur-md border border-border p-3 flex items-center gap-2">
          <p className="text-[13.5px] font-medium flex-1">Reserve before public launch</p>
          <Button size="sm" onClick={() => open()}>Join waitlist</Button>
        </div>
      </div>

      <MentorWaitlistSheet open={openSheet} onOpenChange={setOpenSheet} mentor={selected} />
    </AppLayout>
  );
};

export default Mentors;
