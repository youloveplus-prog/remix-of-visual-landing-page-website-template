import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  /** Skip emitting <link rel="canonical"> entirely (e.g. 404 pages). */
  suppressCanonical?: boolean;
  children?: React.ReactNode;
}

const SITE_NAME = "Asikon";
const DEFAULT_OG = "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/0dcccf65-a2e2-4ca0-a953-c2bd4602ea4e";

/**
 * Per-route head tags. Wrap pages with <SEO ... /> for unique titles,
 * descriptions, canonical URLs, and social previews. Sitewide fallback
 * lives in index.html for non-JS-executing crawlers.
 */
export function SEO({
  title,
  description,
  image,
  url,
  type = "website",
  noIndex = false,
  suppressCanonical = false,
  children,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = suppressCanonical
    ? undefined
    : url ??
      (typeof window !== "undefined" ? window.location.href.split("?")[0] : undefined);
  const ogImage = image ?? DEFAULT_OG;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {children}
    </Helmet>
  );
}

export default SEO;
