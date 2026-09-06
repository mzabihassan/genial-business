import type { Metadata } from "next";
import { Process } from "@/components/home/Process";
import { HumanAi } from "@/components/home/HumanAi";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ownedAssets } from "@/content/ownership";
import { Check } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notre méthode — de l’idée à la mise en ligne",
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
      <section className="sheet-grid border-b border-rule pb-14 pt-32 md:pb-16 md:pt-44">
        <div className="shell">
          <p className="label eyebrow eyebrow-accent">Notre méthode</p>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,5.4vw,4rem)] font-semibold leading-[1.02]">
            Vous expliquez. Nous cadrons, construisons et mettons en ligne.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            Un projet ne commence pas par un cahier des charges ni par un choix de
            technologie. Il commence par une conversation sur ce que vous voulez
            obtenir.
          </p>
        </div>
      </section>

      <Process />
      <HumanAi />

      {/* Ownership, in detail */}
      <section id="propriete" className="band scroll-mt-24 border-b border-rule">
        <div className="shell">
          <SectionHeading
            eyebrow="Propriété et accès"
            title="Ce que contient une livraison."
            lead="À la fin du projet, nous ne vous remettons pas seulement un site en ligne. Nous vous remettons tout ce qui permet de le faire vivre sans nous, si vous le souhaitez."
          />

          <div className="mt-14 grid gap-px overflow-hidden rounded-[5px] border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
            {ownedAssets.map((a, i) => (
              <div
                key={a.label}
                data-reveal
                style={delay((i % 3) * 60)}
                className="bg-surface p-6"
              >
                <Check className="size-[1.125rem] text-trace-deep" strokeWidth={2.2} />
                <h3 className="mt-4 font-display text-[1rem] font-semibold tracking-[-0.02em]">
                  {a.label}
                </h3>
                <p className="mt-1.5 text-[0.875rem] leading-snug text-ink-mute">
                  {a.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <h3
              data-reveal
              className="max-w-2xl font-display text-[clamp(1.5rem,3vw,2.125rem)] font-semibold leading-[1.1]"
            >
              Ensuite, trois portes sont ouvertes. Toutes les trois.
            </h3>
            <ul className="mt-8 grid gap-8 md:grid-cols-3">
              {freedoms.map((f, i) => (
                <li
                  key={f.title}
                  data-reveal
                  style={delay(i * 70)}
                  className="border-t border-rule pt-5"
                >
                  <h4 className="text-[1rem] font-semibold text-ink">{f.title}</h4>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {f.body}
                  </p>
                </li>
              ))}
            </ul>
            <p data-reveal className="mt-10 font-display text-[1.375rem] font-semibold tracking-[-0.025em] text-prussian md:text-[1.625rem]">
              Votre produit vous appartient.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
