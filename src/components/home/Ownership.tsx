import Link from "next/link";
import { ArrowUpRight, Check, IconKey } from "@/components/site/Icons";
export function Ownership() {
  return (
    <section id="propriete" className="studio-section ownership-section" data-scroll-scene>
      <div className="shell ownership-layout">
        <div>
          <h2>Vous avez les clés.<br /><span className="ownership-accent">Et le choix.</span></h2>
          <p className="section-lead">
            Vous recevez le code dans vos dépôts, les comptes à votre nom et les
            configurations documentées. Vous pouvez reprendre le produit sans rester lié à notre équipe.
          </p>
          <p className="ownership-freedom">
            Après la livraison, vous pouvez continuer avec nous, reprendre le
            projet en interne ou le confier à un autre partenaire.
          </p>
          <Link href="/methode#propriete" className="text-link">
            Ce que nous vous remettons <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="handover" data-reveal="handover">
          <div className="handover-top">
            <IconKey className="size-6" />
            <span className="studio-kicker">À la livraison</span>
          </div>
          <ul>
            {[
              "Code source, dépôts & historique",
              "Domaine & hébergement",
              "Administration & données",
              "Comptes & services connectés",
              "Documentation & configuration",
            ].map((s) => (
              <li key={s}>
                <span>{s}</span>
                <Check className="size-4" />
              </li>
            ))}
          </ul>
          <p>La suite reste un choix, jamais une dépendance.</p>
        </div>
      </div>
    </section>
  );
}
