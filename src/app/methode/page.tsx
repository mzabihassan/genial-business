import type { Metadata } from "next";
import { Process } from "@/components/home/Process";
import { HumanAi } from "@/components/home/HumanAi";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ownedAssets } from "@/content/ownership";
import { delay } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notre méthode | De l’idée à la mise en ligne",
  description:
    "Comment se passe un projet chez Genial Business : cadrage, périmètre, devis, construction, validation, mise en ligne, puis remise du produit et de tous ses accès.",
  alternates: { canonical: "/methode" },
};

const freedoms = [
  {
    title: "Continuer avec nous",
    body: "Nous assurons la maintenance, le suivi et les évolutions du produit.",
  },
  {
    title: "Reprendre en interne",
    body: "Votre équipe technique récupère le code, la documentation et les accès.",
  },
  {
    title: "Travailler avec un autre partenaire",
    body: "Le projet est transférable. Nous facilitons la transition plutôt que de la freiner.",
  },
];

export default function MethodePage() {
  return (
    <>
      <section className="sheet-grid editorial-hero border-b border-rule pb-14 pt-32 md:pb-16 md:pt-44" data-scroll-scene>
        <div className="shell">
          <p className="label eyebrow eyebrow-accent">Notre méthode</p>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,5.4vw,4rem)] font-semibold leading-[1.02]">
            Vous connaissez votre activité. Nous construisons le produit avec vous.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            Vous apportez le besoin et les retours métier. Nous prenons en charge
            la conception, la technique et la mise en ligne. À chaque étape,
            vous savez ce que vous validez et ce que vous recevez.
          </p>
        </div>
      </section>

      <Process detailed />
      <HumanAi showLink={false} />

      {/* Ownership, in detail */}
      <section
        id="propriete"
        className="band scroll-mt-24 border-b border-rule"
      >
        <div className="shell">
          <SectionHeading
            title="Ce que contient une livraison."
            lead="À la livraison, vous recevez le produit en ligne, son code, ses comptes et la documentation nécessaire pour le reprendre."
          />

          <ul className="mt-14 grid gap-x-10 border-t border-rule sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {ownedAssets.map((a, i) => (
              <li
                key={a.label}
                data-reveal
                style={delay((i % 3) * 60)}
                className="border-b border-rule py-5"
              >
                <h3 className="font-display text-[1rem] font-semibold tracking-[-0.02em]">
                  {a.label}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-mute">
                  {a.note}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-16">
            <h3
              data-reveal
              className="max-w-2xl font-display text-[clamp(1.5rem,3vw,2.125rem)] font-semibold leading-[1.1]"
            >
              Après la livraison, vous choisissez la suite.
            </h3>
            <ul className="mt-8 grid gap-8 md:grid-cols-3">
              {freedoms.map((f, i) => (
                <li
                  key={f.title}
                  data-reveal
                  style={delay(i * 70)}
                  className="border-t border-rule pt-5"
                >
                  <h4 className="text-[1rem] font-semibold text-ink">
                    {f.title}
                  </h4>
                  <p className="mt-2 text-base leading-relaxed text-ink-soft">
                    {f.body}
                  </p>
                </li>
              ))}
            </ul>
            <p
              data-reveal
              className="mt-10 font-display text-[1.375rem] font-semibold tracking-[-0.025em] text-prussian md:text-[1.625rem]"
            >
              Votre produit vous appartient.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
