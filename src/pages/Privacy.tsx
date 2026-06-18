import { SITE_URL } from "@/config/site";
import { LegalShell } from "@/components/legal/LegalShell";
import { LegalSection } from "@/components/legal/LegalSection";

const toc = [
  { index: 1, title: "What we collect" },
  { index: 2, title: "Why we collect it" },
  { index: 3, title: "We never sell your data" },
  { index: 4, title: "Your rights" },
  { index: 5, title: "Cookies" },
  { index: 6, title: "Security" },
  { index: 7, title: "Children" },
  { index: 8, title: "Contact" },
];

const Privacy = () => (
  <LegalShell analyticsSlug="privacy"
    eyebrow="Legal"
    title="Privacy Policy."
    updated="May 2026"
    intro="What we collect, why, and the choices you have. We keep it short on purpose."
    canonical=`${SITE_URL}/privacy`
    metaTitle="Privacy Policy — ASIKON"
    metaDescription="How ASIKON collects, uses, and protects your personal data across learning, shopping, and community features."
    toc={toc}
  >
    <LegalSection index={1} title="What we collect">
      <ul>
        <li><strong>Account:</strong> name, email, profile photo, role.</li>
        <li><strong>Learning:</strong> lessons completed, XP, streaks, AI tutor chats.</li>
        <li><strong>Commerce:</strong> orders, addresses, payment status (not card numbers).</li>
        <li><strong>Community:</strong> posts, comments, likes, follows.</li>
        <li><strong>Device:</strong> basic analytics like browser and route for performance.</li>
      </ul>
    </LegalSection>

    <LegalSection index={2} title="Why we collect it">
      <p>To deliver the service, personalize your missions, fulfill orders, keep the community safe, and improve performance. Nothing more.</p>
    </LegalSection>

    <LegalSection index={3} title="We never sell your data">
      <p>We don't sell personal information. We share it only with processors needed to run the service (hosting, payments, email delivery) under strict contracts.</p>
    </LegalSection>

    <LegalSection index={4} title="Your rights">
      <p>You can view, export, or delete your data anytime from Settings. To make a formal request, email <a href="mailto:privacy@asikon.app">privacy@asikon.app</a>.</p>
    </LegalSection>

    <LegalSection index={5} title="Cookies">
      <p>We use essential cookies for auth and a small set of analytics cookies. No third-party ad tracking.</p>
    </LegalSection>

    <LegalSection index={6} title="Security">
      <p>Data is stored on Supabase with row-level security policies. Sensitive fields (coins, trust score, roles) are protected by server-side triggers.</p>
    </LegalSection>

    <LegalSection index={7} title="Children">
      <p>Under-13 mentorship is booked by a parent who consents to the collection of the child's first name, age, and learning goal.</p>
    </LegalSection>

    <LegalSection index={8} title="Contact">
      <p>For privacy questions: <a href="mailto:privacy@asikon.app">privacy@asikon.app</a>.</p>
    </LegalSection>
  </LegalShell>
);

export default Privacy;
