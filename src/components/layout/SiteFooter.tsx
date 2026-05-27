import { Link } from "react-router-dom";
import { Mail, Github, Twitter, Instagram, Facebook } from "lucide-react";

const columns = [
  {
    title: "Learn",
    links: [
      { label: "Daily missions", to: "/learn" },
      { label: "Tracks", to: "/learn" },
      { label: "Leaderboard", to: "/leaderboard" },
      { label: "AI prompts", to: "/prompts" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "All products", to: "/shop" },
      { label: "Cart", to: "/cart" },
      { label: "My orders", to: "/orders" },
      { label: "Wishlist", to: "/wishlist" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Feed", to: "/community" },
      { label: "Mentorship", to: "/mentors" },
      { label: "Notifications", to: "/notifications" },
      { label: "Profile", to: "/profile" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About ASIKON", to: "/about" },
      { label: "Help & FAQ", to: "/help" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Refund Policy", to: "/refund" },
    ],
  },
];

const socials = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@asikon.app", label: "Email" },
];

export function SiteFooter() {
  return (
    <footer
      className="hidden md:block border-t border-border/40 bg-card/30 backdrop-blur-sm"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      <div className="container-editorial py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-display text-2xl font-semibold tracking-tight">ASIKON</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
              An AI-powered learning universe — calm, smart, and unmistakably made for Bangladeshi learners.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-9 rounded-full grid place-items-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <nav className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-8" aria-label="Footer">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/90">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.to + l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ASIKON. Made with care in Dhaka, Bangladesh.
          </p>
          <p className="text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <span className="mx-2">·</span>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <span className="mx-2">·</span>
            <Link to="/refund" className="hover:text-foreground">Refunds</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
