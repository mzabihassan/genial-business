import { delay } from "@/lib/utils";

const pillars = [
  {
    title: "Un seul partenaire",
    body: "De la définition du produit à l’hébergement. Vous n’avez pas plusieurs prestataires à coordonner.",
  },
  {
    title: "Des développeurs expérimentés",
    body: "L’IA accélère notre travail. Les décisions, la qualité et la validation restent humaines.",
  },
  {
    title: "Un produit complet",
    body: "Interface, administration, comptes, données, emails, mise en ligne. Pas seulement des écrans.",
  },
  {
    title: "Votre produit vous appartient",
    body: "Code, accès et comptes vous sont remis. Aucune dépendance artificielle.",
  },
];

export function Pillars() {
  return (
    <section className="border-b border-rule bg-surface">
      <div className="shell">
        {/* Keeps the heading order intact: these four cards sit under a heading,
            it just doesn't need to be seen. */}
        <h2 className="sr-only">Ce qui distingue Genial Business</h2>
        <ul className="grid md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <li
              key={p.title}
              data-reveal
              style={delay(i * 80)}
              className="border-rule py-9 md:py-11 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0 lg:pr-8 [&:not(:last-child)]:border-b [&:not(:last-child)]:md:border-b-0"
            >
              <h3 className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">
                {p.title}
              </h3>
              <p className="mt-2.5 max-w-xs text-[0.9375rem] leading-relaxed text-ink-soft">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
