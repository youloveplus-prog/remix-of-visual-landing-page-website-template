import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Reveal } from "@/components/transitions/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message sent — we'll reply within one business day.");
    }, 600);
  };

  return (
    <AppLayout>
      <SEO
        title="Contact ASIKON — we'd love to hear from you"
        description="Reach the ASIKON team for support, partnerships, press, or feedback. We reply within one business day."
        url="https://asikonpro.lovable.app/contact"
      />

      <Reveal as="section" className="pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24">
        <div className="container-editorial text-center max-w-3xl">
          <p className="eyebrow-bar mb-4 justify-center">Contact</p>
          <h1 className="display-1 mb-6">Let's talk.</h1>
          <p className="body-lg text-muted-foreground">
            Questions, partnerships, or feedback — every message reaches a real person on our team.
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="pb-20 sm:pb-28">
        <div className="container-editorial grid lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-5 space-y-6">
            {[
              { icon: Mail, label: "Email", value: "hello@asikon.app", href: "mailto:hello@asikon.app" },
              { icon: MessageSquare, label: "Support", value: "support@asikon.app", href: "mailto:support@asikon.app" },
              { icon: Phone, label: "Phone", value: "+880 1700 000000", href: "tel:+8801700000000" },
              { icon: MapPin, label: "Studio", value: "Dhaka, Bangladesh" },
            ].map(({ icon: Icon, label, value, href }) => {
              const Inner = (
                <div className="glass-strong rounded-2xl p-6 flex items-start gap-4 transition hover:translate-y-[-2px]">
                  <div className="size-11 rounded-xl bg-primary/10 grid place-items-center text-primary shrink-0">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                    <p className="font-display text-lg mt-1">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
                  {Inner}
                </a>
              ) : (
                <div key={label}>{Inner}</div>
              );
            })}
          </aside>

          <form onSubmit={onSubmit} className="lg:col-span-7 glass-strong rounded-3xl p-7 sm:p-10 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input id="name" name="name" required className="mt-2" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" required className="mt-2" placeholder="you@email.com" />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input id="subject" name="subject" required className="mt-2" placeholder="What's this about?" />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Textarea id="message" name="message" required rows={6} className="mt-2" placeholder="Tell us a little more…" />
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
              {submitting ? "Sending…" : "Send message"}
            </Button>
            <p className="text-xs text-muted-foreground">
              By contacting us you agree to our Privacy Policy. We never share your email.
            </p>
          </form>
        </div>
      </Reveal>
    </AppLayout>
  );
};

export default Contact;
