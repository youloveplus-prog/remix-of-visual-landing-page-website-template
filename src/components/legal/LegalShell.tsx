import { AppLayout } from "@/components/layout/AppLayout";
import { SEO } from "@/components/SEO";
import { Reveal } from "@/components/transitions/Reveal";
import { ReactNode } from "react";

interface LegalShellProps {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  canonical: string;
  metaTitle: string;
  metaDescription: string;
  children: ReactNode;
}

export const LegalShell = ({
  eyebrow,
  title,
  updated,
  intro,
  canonical,
  metaTitle,
  metaDescription,
  children,
}: LegalShellProps) => {
  return (
    <AppLayout>
      <SEO title={metaTitle} description={metaDescription} url={canonical} />

      <Reveal as="section" className="pt-20 pb-10 sm:pt-28 sm:pb-14 lg:pt-36 lg:pb-20">
        <div className="container-editorial max-w-3xl text-center">
          <p className="eyebrow-bar mb-4 justify-center">{eyebrow}</p>
          <h1 className="display-1 mb-5">{title}</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Updated {updated}
          </p>
          <p className="body-lg text-muted-foreground">{intro}</p>
        </div>
      </Reveal>

      <Reveal as="section" className="pb-24">
        <div className="container-editorial max-w-3xl">
          <article className="glass-strong rounded-3xl p-8 sm:p-12 prose-legal">
            {children}
          </article>
        </div>
      </Reveal>
    </AppLayout>
  );
};
