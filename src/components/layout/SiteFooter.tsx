import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const linkColumns = [
  {
    title: "Links",
    links: [
      { label: "Home", to: "/" },
      { label: "Shop", to: "/shop" },
      { label: "About", to: "/about" },
      { label: "Careers", to: "/about" },
      { label: "Contact us", to: "/contact" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Learn", to: "/learn" },
      { label: "Why ASIKON?", to: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Mentors", to: "/mentors" },
      { label: "Community", to: "/community" },
      { label: "Help & FAQ", to: "/help" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Facebook", to: "https://facebook.com", external: true },
      { label: "Instagram", to: "https://instagram.com", external: true },
      { label: "X (Formerly Twitter)", to: "https://twitter.com", external: true },
    ],
  },
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
    <footer className="hidden md:block bg-background text-foreground border-t border-border/60" aria-label="ASIKON footer">
      <div className="container-editorial pt-12 md:pt-16 pb-0">
        {/* Top: brand + newsletter */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 md:items-start">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
            >
              <img src={logo} alt="Asikon" className="h-7 w-7 rounded-lg object-contain shrink-0" />
              <span className="font-display text-2xl font-black tracking-tight">ASIKON</span>
            </Link>
            <p className="mt-5 max-w-md text-sm md:text-base text-muted-foreground leading-relaxed">
              AI-powered learning platform blending modern tech with Bangladeshi context — built for learners across the Global South.
            </p>
          </div>

          <div className="md:justify-self-end w-full md:max-w-md">
            <p className="text-sm text-foreground/90">Subscribe to our newsletter</p>
            <form
              onSubmit={handleSubscribe}
              className="mt-3 flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 pl-4 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/30 transition"
            >
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent text-sm px-2 outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-3 font-dot text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              By subscribing you agree to our terms
            </p>
          </div>
        </div>

        {/* Link grid */}
        <nav
          aria-label="Footer navigation"
          className="mt-14 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-4 md:gap-x-8"
        >
          {linkColumns.map((col) => (
            <div key={col.title}>
              <h3 className="font-dot text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => {
                  const cls =
                    "text-sm text-foreground/85 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded";
                  return (
                    <li key={l.to + l.label}>
                      {"external" in l && l.external ? (
                        <a href={l.to} target="_blank" rel="noopener noreferrer" className={cls}>
                          {l.label}
                        </a>
                      ) : (
                        <Link to={l.to} className={cls}>
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-dot text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            © Copyright {new Date().getFullYear()} ASIKON
          </p>
          <p className="font-dot text-[11px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-5">
            <Link to="/terms" className="hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Privacy Policy</Link>
            <Link to="/refund" className="hover:text-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded">Refunds</Link>
          </p>
        </div>

        {/* Giant ghost wordmark */}
        <div className="relative mt-8 overflow-hidden" aria-hidden>
          <div className="font-display font-black tracking-tighter text-center leading-none select-none text-foreground/[0.06] text-[28vw] sm:text-[22vw] lg:text-[18vw]">
            ASIKON
          </div>
        </div>
      </div>
    </footer>
  );
}
