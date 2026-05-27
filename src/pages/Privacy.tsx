import { LegalShell } from "@/components/legal/LegalShell";

const Privacy = () => (
  <LegalShell
    eyebrow="Legal"
    title="Privacy Policy."
    updated="May 2026"
    intro="What we collect, why, and the choices you have. We keep it short on purpose."
    canonical="https://asikonpro.lovable.app/privacy"
    metaTitle="Privacy Policy — ASIKON"
    metaDescription="How ASIKON collects, uses, and protects your personal data across learning, shopping, and community features."
  >
    <h2>1. What we collect</h2>
    <ul>
      <li><strong>Account:</strong> name, email, profile photo, role.</li>
      <li><strong>Learning:</strong> lessons completed, XP, streaks, AI tutor chats.</li>
      <li><strong>Commerce:</strong> orders, addresses, payment status (not card numbers).</li>
      <li><strong>Community:</strong> posts, comments, likes, follows.</li>
      <li><strong>Device:</strong> basic analytics like browser and route for performance.</li>
    </ul>

    <h2>2. Why we collect it</h2>
    <p>To deliver the service, personalize your missions, fulfill orders, keep the community safe, and improve performance. Nothing more.</p>

    <h2>3. We never sell your data</h2>
    <p>We don't sell personal information. We share it only with processors needed to run the service (hosting, payments, email delivery) under strict contracts.</p>

    <h2>4. Your rights</h2>
    <p>You can view, export, or delete your data anytime from Settings. To make a formal request, email <a href="mailto:privacy@asikon.app">privacy@asikon.app</a>.</p>

    <h2>5. Cookies</h2>
    <p>We use essential cookies for auth and a small set of analytics cookies. No third-party ad tracking.</p>

    <h2>6. Security</h2>
    <p>Data is stored on Supabase with row-level security policies. Sensitive fields (coins, trust score, roles) are protected by server-side triggers.</p>

    <h2>7. Children</h2>
    <p>Under-13 mentorship is booked by a parent who consents to the collection of the child's first name, age, and learning goal.</p>

    <h2>8. Contact</h2>
    <p>For privacy questions: <a href="mailto:privacy@asikon.app">privacy@asikon.app</a>.</p>
  </LegalShell>
);

export default Privacy;
