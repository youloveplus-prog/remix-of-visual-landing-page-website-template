import { LegalShell } from "@/components/legal/LegalShell";
import { LegalSection } from "@/components/legal/LegalSection";

const toc = [
  { index: 1, title: "Welcome" },
  { index: 2, title: "Your account" },
  { index: 3, title: "Acceptable use" },
  { index: 4, title: "Purchases" },
  { index: 5, title: "Learning content" },
  { index: 6, title: "Intellectual property" },
  { index: 7, title: "Termination" },
  { index: 8, title: "Liability" },
  { index: 9, title: "Changes" },
  { index: 10, title: "Contact" },
];

const Terms = () => (
  <LegalShell
    eyebrow="Legal"
    title="Terms of Service."
    updated="May 2026"
    intro="The simple rules for using ASIKON — written in plain language."
    canonical="https://asikonpro.lovable.app/terms"
    metaTitle="Terms of Service — ASIKON"
    metaDescription="The terms governing your use of ASIKON's learning, shop, community, and mentorship services."
    toc={toc}
  >
    <LegalSection index={1} title="Welcome">
      <p>By creating an account or using ASIKON, you agree to these Terms. If you don't agree, please don't use the service.</p>
    </LegalSection>

    <LegalSection index={2} title="Your account">
      <p>You're responsible for keeping your login details safe. One person, one account. You must be 13 or older to sign up; mentorship for under-13 learners is booked by a parent.</p>
    </LegalSection>

    <LegalSection index={3} title="Acceptable use">
      <p>Don't post anything illegal, hateful, or that infringes someone else's rights. Don't try to break, scrape, or abuse the platform. We may suspend accounts that do.</p>
    </LegalSection>

    <LegalSection index={4} title="Purchases">
      <p>Prices are listed in BDT. All products are digital. Orders are confirmed only when payment is verified, and access is granted immediately afterward.</p>
    </LegalSection>

    <LegalSection index={5} title="Learning content">
      <p>Lessons, AI responses, and community content are provided "as is" for educational purposes and aren't a substitute for professional advice.</p>
    </LegalSection>

    <LegalSection index={6} title="Intellectual property">
      <p>ASIKON owns the platform, brand, and curated content. You keep ownership of what you post — but you grant us a license to display and distribute it within the service.</p>
    </LegalSection>

    <LegalSection index={7} title="Termination">
      <p>You can delete your account anytime from Settings. We may close accounts that violate these terms or harm other members.</p>
    </LegalSection>

    <LegalSection index={8} title="Liability">
      <p>To the maximum extent allowed by law, ASIKON isn't liable for indirect or consequential damages arising from your use of the service.</p>
    </LegalSection>

    <LegalSection index={9} title="Changes">
      <p>We may update these terms. We'll notify you of meaningful changes in-app or by email.</p>
    </LegalSection>

    <LegalSection index={10} title="Contact">
      <p>Questions? Reach us at <a href="mailto:hello@asikon.app">hello@asikon.app</a>.</p>
    </LegalSection>
  </LegalShell>
);

export default Terms;
