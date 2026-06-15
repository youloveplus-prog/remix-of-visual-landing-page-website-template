import { Link } from "react-router-dom";
import { Mail, Code2, Send, Camera, Users, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const columns = [
  {
    title: "Company",
    links: [
      { label: "Home", to: "/" },
      { label: "About us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Help & FAQ", to: "/help" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Shop", to: "/shop" },
      { label: "Learn", to: "/learn" },
      { label: "Mentors", to: "/mentors" },
      { label: "Community", to: "/community" },
    ],
  },
];

const socials = [
  { icon: Users, href: "https://facebook.com", label: "Facebook" },
  { icon: Camera, href: "https://instagram.com", label: "Instagram" },
  { icon: Send, href: "https://twitter.com", label: "Twitter" },
  { icon: Code2, href: "https://github.com", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@asikon.app", label: "Email" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({ title: "Subscribed", description: `We'll keep ${email} in the loop.` });
    setEmail("");
  };

  return (
    <footer
      className="bg-muted/30"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="container-editorial py-10 md:py-14 lg:py-20">
        {/* CTA card */}
        <div
          className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] px-5 md:px-8 py-12 md:py-16 lg:py-20 text-center text-primary-foreground shadow-[var(--shadow-elegant,0_30px_80px_-30px_hsl(var(--primary)/0.5))]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 20% 80%, hsl(var(--primary-foreground)/0.25), transparent 55%), radial-gradient(circle at 85% 20%, hsl(var(--primary-foreground)/0.18), transparent 50%)",
            }}
          />
          <div className="relative max-w-2xl mx-auto">
            <h3 className="font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-[1.1]">
              Learn smarter.<br />Build with ASIKON.
            </h3>
            <p className="mt-5 text-sm sm:text-base text-primary-foreground/85 max-w-lg mx-auto leading-relaxed">
              An AI-powered learning universe — calm, smart, and unmistakably made for Bangladeshi learners.
            </p>
            <Link
              to="/learn"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-background text-foreground pl-6 pr-2 py-2 text-sm font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Start learning
              <span className="grid place-items-center h-8 w-8 rounded-full bg-foreground text-background">
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* Link grid */}
        <div className="mt-10 md:mt-14 grid gap-8 md:gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="font-display text-2xl font-black tracking-tight">ASIKON</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              AI-powered learning platform designed to help Bangladeshi learners grow effortlessly and confidently.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-9 rounded-full grid place-items-center bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <nav className="lg:col-span-4 grid grid-cols-2 gap-6 md:gap-8" aria-label="Footer navigation">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.to + l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="lg:col-span-4">
            <h3 id="newsletter-heading" className="font-display text-lg font-bold tracking-tight text-foreground">
              Newsletter
            </h3>
            <p id="newsletter-desc" className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Get tips, product updates, and insights on learning smarter with AI.
            </p>
            <form
              onSubmit={handleSubscribe}
              aria-labelledby="newsletter-heading"
              className="mt-5 flex items-center gap-1 rounded-full border border-border bg-background p-1 pl-4 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30 transition"
            >
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                aria-describedby="newsletter-desc"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{ background: "var(--gradient-primary)" }}
              >
                Subscribe
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ASIKON. Made with care in Dhaka, Bangladesh.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-3">
            <Link to="/privacy" className="hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Privacy Policy</Link>
            <span className="opacity-40">·</span>
            <Link to="/terms" className="hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Terms of Service</Link>
            <span className="opacity-40">·</span>
            <Link to="/refund" className="hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Refunds</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
