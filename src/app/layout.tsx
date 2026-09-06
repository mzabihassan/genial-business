import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { RevealProvider, revealBootScript } from "@/components/site/RevealProvider";
import "./globals.css";

/* The Google "latin" subset already covers French, œ and € included, so
   latin-ext would only add weight. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

// Utility type only — it may swap in a beat later without hurting the page.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Genial Business — De l’idée au produit en ligne",
    template: "%s · Genial Business",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: [
    "développement logiciel",
    "création application web",
    "studio produit digital",
    "développement sur mesure",
    "application métier",
    "SaaS",
    "refonte site web",
    "développeurs expérimentés",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: site.name,
    title: "Genial Business — De l’idée au produit en ligne",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Genial Business — De l’idée au produit en ligne",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e3a4f",
  colorScheme: "light",
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  areaServed: "FR",
  knowsLanguage: ["fr-FR"],
  serviceType: [
    "Développement d’applications web",
    "Développement de plateformes SaaS",
    "Applications métier et back-office",
    "Refonte de produits digitaux",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${instrument.variable} ${plexMono.variable}`}
      // The boot script stamps `reveal-ready` here before React hydrates.
      suppressHydrationWarning
    >
      <body>
        {/* Runs before the rest of <body> is parsed — no flash of revealed content */}
        <script dangerouslySetInnerHTML={{ __html: revealBootScript }} />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-prussian focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Aller au contenu
        </a>
        <RevealProvider />
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
      </body>
    </html>
  );
}
