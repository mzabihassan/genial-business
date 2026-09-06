import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (
    path: string,
    priority: number,
    changeFrequency: "monthly" | "yearly",
  ) => ({ url: `${site.url}${path}`, lastModified: now, changeFrequency, priority });

  return [
    entry("/", 1, "monthly"),
    entry("/services", 0.9, "monthly"),
    entry("/realisations", 0.9, "monthly"),
    entry("/methode", 0.8, "monthly"),
    entry("/devis", 0.9, "monthly"),
    entry("/mentions-legales", 0.2, "yearly"),
    entry("/confidentialite", 0.2, "yearly"),
  ];
}
