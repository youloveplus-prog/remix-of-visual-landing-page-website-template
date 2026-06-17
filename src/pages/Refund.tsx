import { LegalShell } from "@/components/legal/LegalShell";
import { LegalSection } from "@/components/legal/LegalSection";

const toc = [
  { index: 1, title: "Eligibility" },
  { index: 2, title: "How to start a return" },
  { index: 3, title: "Refunds" },
  { index: 4, title: "Damaged or wrong items" },
  { index: 5, title: "Non-returnable" },
  { index: 6, title: "Need help?" },
];

const Refund = () => (
  <LegalShell analyticsSlug="refund"
    eyebrow="Legal"
    title="Refund & Return Policy."
    updated="May 2026"
    intro="Shop confidently. If something isn't right, we'll make it right."
    canonical="https://style-verse-suite.lovable.app/refund"
    metaTitle="Refund & Return Policy — ASIKON"
    metaDescription="ASIKON's return, refund, and replacement policy for products purchased through our shop."
    toc={toc}
  >
    <LegalSection index={1} title="Eligibility">
      <p>You can request a return within <strong>7 days</strong> of delivery if the item is unused, in original packaging, and accompanied by proof of purchase.</p>
    </LegalSection>

    <LegalSection index={2} title="How to start a return">
      <ol>
        <li>Open <a href="/orders">Orders</a> and select the item.</li>
        <li>Tap <em>Request return</em> and choose a reason.</li>
        <li>Our team replies within 24 hours with pickup or drop-off instructions.</li>
      </ol>
    </LegalSection>

    <LegalSection index={3} title="Refunds">
      <p>Once approved, we issue your refund within <strong>5–7 business days</strong> to the original payment method.</p>
    </LegalSection>

    <LegalSection index={4} title="Damaged or wrong items">
      <p>If your order arrives damaged or incorrect, send a photo within 48 hours of delivery and we'll replace it at no cost.</p>
    </LegalSection>

    <LegalSection index={5} title="Non-returnable">
      <ul>
        <li>Digital downloads and lesson access</li>
        <li>Coins or rewards already redeemed</li>
        <li>Personalized or custom-made items</li>
      </ul>
    </LegalSection>

    <LegalSection index={6} title="Need help?">
      <p>Email <a href="mailto:support@asikon.app">support@asikon.app</a> with your order number.</p>
    </LegalSection>
  </LegalShell>
);

export default Refund;
