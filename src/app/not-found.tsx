import Link from "next/link";
import { ArrowRight } from "@/components/site/Icons";

export const metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

const elsewhere = [
  { href: "/services", label: "Services", note: "Ce que nous construisons" },
  {
    href: "/realisations",
    label: "Réalisations",
    note: "Une sélection de produits en ligne",
  },
  { href: "/methode", label: "Notre méthode", note: "Comment se passe un projet" },
];

export default function NotFound() {
  return (
    <section className="sheet-grid flex min-h-[100svh] items-center pb-24 pt-36">
      <div className="shell">
        <p className="label eyebrow eyebrow-accent">Erreur 404</p>
        <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.25rem,5.6vw,4rem)] font-semibold leading-[1.02]">
          Cette page n’existe pas.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          Le lien est peut-être ancien, ou l’adresse comporte une erreur. Voici où
          aller à la place.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            Retour à l’accueil
            <ArrowRight className="arrow size-4" />
          </Link>
          <Link href="/devis" className="btn btn-ghost">
            Demander un devis
          </Link>
        </div>

        <ul className="mt-16 grid max-w-3xl gap-px overflow-hidden rounded-[5px] border border-rule bg-rule sm:grid-cols-3">
          {elsewhere.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                className="block h-full bg-surface p-5 transition-colors hover:bg-wash"
              >
                <span className="block text-base font-semibold text-ink">
                  {e.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-mute">
                  {e.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
