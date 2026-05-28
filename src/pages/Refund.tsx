import { LegalShell } from "@/components/legal/LegalShell";

const Refund = () => (
  <LegalShell
    eyebrow="Legal"
    title="Refund & Return Policy."
    updated="May 2026"
    intro="Shop confidently. If something isn't right, we'll make it right."
    canonical="https://asikonpro.lovable.app/refund"
    metaTitle="Refund & Return Policy — ASIKON"
    metaDescription="ASIKON's return, refund, and replacement policy for products purchased through our shop."
  >
    <h2>Eligibility</h2>
    <p>You can request a return within <strong>7 days</strong> of delivery if the item is unused, in original packaging, and accompanied by proof of purchase.</p>

    <h2>How to start a return</h2>
    <ol>
      <li>Open <a href="/orders">Orders</a> and select the item.</li>
      <li>Tap <em>Request return</em> and choose a reason.</li>
      <li>Our team replies within 24 hours with pickup or drop-off instructions.</li>
    </ol>

    <h2>Refunds</h2>
    <p>Once approved, we issue your refund within <strong>5–7 business days</strong> to the original payment method.</p>

    <h2>Damaged or wrong items</h2>
    <p>If your order arrives damaged or incorrect, send a photo within 48 hours of delivery and we'll replace it at no cost.</p>

    <h2>Non-returnable</h2>
    <ul>
      <li>Digital downloads and lesson access</li>
      <li>Coins or rewards already redeemed</li>
      <li>Personalized or custom-made items</li>
    </ul>

    <h2>Need help?</h2>
    <p>Email <a href="mailto:support@asikon.app">support@asikon.app</a> with your order number.</p>
  </LegalShell>
);

export default Refund;
