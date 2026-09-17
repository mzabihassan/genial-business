import type { Metadata } from "next";
import { site } from "@/lib/site";

/** Keep search and sharing metadata specific to the current page. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = path === "/" ? title : `${title} · ${site.name}`;

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: `${site.url}${path}` },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: site.name,
      url: `${site.url}${path}`,
      title: fullTitle,
      description,
    },
    twitter: { card: "summary", title: fullTitle, description },
  };
}
