import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What is Asikon?",
    a: "Asikon is an AI-powered learning platform with courses, books, a 24/7 AI tutor, and 1-on-1 mentorship.",
  },
  {
    q: "How do I pay?",
    a: "We accept card and bKash. All products are digital with instant access — no shipping required.",
  },
  {
    q: "Do I get a certificate?",
    a: "Yes, every Asikon course includes a verified completion certificate you can share on LinkedIn or your CV.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — 7-day money back on every paid course. If it's not for you, we'll refund you, no questions asked.",
  },
  {
    q: "Can my child join the mentorship program?",
    a: "Yes. The 1-on-1 mentorship program is designed for children and runs on a waitlist while we match the right teacher.",
  },
  {
    q: "How does the AI Tutor work?",
    a: "Ask anything in text or voice. The tutor tunes to your level, quizzes you, and builds a revision deck after every session.",
  },
];

export function FaqAccordion() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-white">
          Frequently asked
        </h2>
        <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          {FAQS.length} questions
        </span>
      </div>
      <div className="overflow-hidden rounded-[10px] border border-white/10 bg-neutral-950">
        <Accordion type="single" collapsible className="divide-y divide-white/10">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-0 px-5">
              <AccordionTrigger className="py-4 text-left text-[14px] font-semibold text-white hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[13px] text-white/60">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })}
      </script>
    </section>
  );
}
