import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Reveal } from "@/components/transitions/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ShoppingBag, GraduationCap, Users, ShieldCheck, Coins, MessageCircle } from "lucide-react";

const sections = [
  {
    icon: ShoppingBag,
    title: "Orders & Shipping",
    items: [
      { q: "How do I track my order?", a: "Visit Orders from your profile. Every order shows live status from packed to delivered." },
      { q: "Do you offer Cash on Delivery?", a: "Yes — COD is available across Bangladesh. Choose it at checkout." },
      { q: "What's your delivery time?", a: "Inside Dhaka: 1–3 days. Outside Dhaka: 3–7 days, depending on courier." },
    ],
  },
  {
    icon: GraduationCap,
    title: "Learning & AI Tutor",
    items: [
      { q: "Is the AI tutor free?", a: "Yes. The ASIKON AI tutor is free for every signed-in learner." },
      { q: "How are daily missions chosen?", a: "We pick the next unfinished lesson from your active track and serve it as your daily mission." },
      { q: "Do I earn anything for completing lessons?", a: "Yes — 10 XP plus 5 coins per lesson, with streak bonuses." },
    ],
  },
  {
    icon: Users,
    title: "Community",
    items: [
      { q: "Who can post?", a: "Any signed-in member. Verified buyers get a trust badge on reviews." },
      { q: "How do reviews get verified?", a: "Reviews tied to an order you actually placed are automatically marked verified." },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    items: [
      { q: "Is my data secure?", a: "We use Supabase with row-level security. Your data is never sold." },
      { q: "Can I delete my account?", a: "Yes. Go to Settings → Account → Delete account. We remove personal data within 30 days." },
    ],
  },
  {
    icon: Coins,
    title: "Coins & Rewards",
    items: [
      { q: "How do I earn coins?", a: "You start with 100 coins on signup. Earn more by completing lessons, posting, and inviting friends." },
      { q: "What can I spend coins on?", a: "Visit the Rewards section to redeem coins for perks, discounts, and exclusive content." },
    ],
  },
  {
    icon: MessageCircle,
    title: "1-on-1 Mentorship",
    items: [
      { q: "How does mentorship work?", a: "Parents join the waitlist for a personal tutor matched to their child's age and subject." },
      { q: "When does it open?", a: "We're onboarding mentors in waves. Join the waitlist to be notified first." },
    ],
  },
];

const Help = () => {
  return (
    <AppLayout>
      <SEO
        title="Help & FAQ — ASIKON support"
        description="Answers to common questions about orders, learning, community, mentorship, coins, and trust at ASIKON."
        url="https://asikonpro.lovable.app/help"
      />

      <Reveal as="section" className="pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-20">
        <div className="container-editorial text-center max-w-3xl">
          <p className="eyebrow-bar mb-4 justify-center">Help center</p>
          <h1 className="display-1 mb-6">How can we help?</h1>
          <p className="body-lg text-muted-foreground">
            Quick answers, organized by topic. Can't find what you need?{" "}
            <Link to="/contact" className="text-primary underline-offset-4 hover:underline">Contact us</Link>.
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="pb-24">
        <div className="container-editorial grid lg:grid-cols-2 gap-8">
          {sections.map(({ icon: Icon, title, items }) => (
            <div key={title} className="glass-strong rounded-3xl p-7 sm:p-9">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h2 className="font-display text-2xl font-semibold">{title}</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {items.map((it, i) => (
                  <AccordionItem key={i} value={`${title}-${i}`}>
                    <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </Reveal>
    </AppLayout>
  );
};

export default Help;
