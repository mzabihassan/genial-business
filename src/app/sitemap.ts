import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Omit lastModified until actual editorial update dates are tracked.
  // A build timestamp incorrectly tells Google every page has changed.
  return [
    "/",
    "/services",
    "/realisations",
    "/methode",
    "/devis",
    "/confidentialite",
    "/mentions-legales",
    "/cgv",
    "/cookies",
  ].map((path) => ({ url: `${site.url}${path}` }));
}
