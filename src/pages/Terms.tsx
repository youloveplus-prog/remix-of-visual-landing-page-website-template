import { LegalShell } from "@/components/legal/LegalShell";

const Terms = () => (
  <LegalShell
    eyebrow="Legal"
    title="Terms of Service."
    updated="May 2026"
    intro="The simple rules for using ASIKON — written in plain language."
    canonical="https://asikonpro.lovable.app/terms"
    metaTitle="Terms of Service — ASIKON"
    metaDescription="The terms governing your use of ASIKON's learning, shop, community, and mentorship services."
  >
    <h2>1. Welcome</h2>
    <p>By creating an account or using ASIKON, you agree to these Terms. If you don't agree, please don't use the service.</p>

    <h2>2. Your account</h2>
    <p>You're responsible for keeping your login details safe. One person, one account. You must be 13 or older to sign up; mentorship for under-13 learners is booked by a parent.</p>

    <h2>3. Acceptable use</h2>
    <p>Don't post anything illegal, hateful, or that infringes someone else's rights. Don't try to break, scrape, or abuse the platform. We may suspend accounts that do.</p>

    <h2>4. Purchases</h2>
    <p>Prices are listed in BDT. Orders are confirmed only when payment (or COD acceptance) is verified. Shipping times are estimates.</p>

    <h2>5. Learning content</h2>
    <p>Lessons, AI responses, and community content are provided "as is" for educational purposes and aren't a substitute for professional advice.</p>

    <h2>6. Intellectual property</h2>
    <p>ASIKON owns the platform, brand, and curated content. You keep ownership of what you post — but you grant us a license to display and distribute it within the service.</p>

    <h2>7. Termination</h2>
    <p>You can delete your account anytime from Settings. We may close accounts that violate these terms or harm other members.</p>

    <h2>8. Liability</h2>
    <p>To the maximum extent allowed by law, ASIKON isn't liable for indirect or consequential damages arising from your use of the service.</p>

    <h2>9. Changes</h2>
    <p>We may update these terms. We'll notify you of meaningful changes in-app or by email.</p>

    <h2>10. Contact</h2>
    <p>Questions? Reach us at <a href="mailto:hello@asikon.app">hello@asikon.app</a>.</p>
  </LegalShell>
);

export default Terms;
