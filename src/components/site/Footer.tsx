import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { ArrowUpRight } from "./Icons";

const columns = [
  {
    title: "Studio",
    links: [
      { href: "/services", label: "Services" },
      { href: "/realisations", label: "Réalisations" },
      { href: "/methode", label: "Notre méthode" },
      { href: "/#faq", label: "Questions fréquentes" },
    ],
  },
  {
    title: "Démarrer",
    links: [
      { href: "/devis", label: "Demander un devis" },
      {
        href: "/services#produit-complet",
        label: "Ce que contient un produit",
      },
      { href: "/methode#propriete", label: "Propriété et accès" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/confidentialite", label: "Confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="on-dark sheet-grid-dark border-t border-[#f3f3f01f]">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Link
              href="/"
              className="text-paper"
              aria-label="Genial Business, accueil"
            >
              <Logo />
            </Link>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-[#b5b8aa]">
              Studio de développement logiciel. Nous concevons et construisons
              des produits digitaux complets, de l&rsquo;idée jusqu&rsquo;à la
              mise en ligne.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-6 inline-flex items-center gap-1.5 font-mono text-sm text-trace"
            >
              {site.email}
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="label text-[#a7ab9b]">{col.title}</h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="link-underline text-[0.9375rem] text-[#d5d8cc] transition-colors hover:text-paper"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[#f3f3f01f] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-[#a7ab9b]">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="label text-[#a7ab9b]">{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
