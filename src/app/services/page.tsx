import type { Metadata } from "next";
import Link from "next/link";
import { capabilities } from "@/content/capabilities";
import { strata } from "@/content/strata";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowRight } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services — sites, applications, SaaS, back-office",
  description:
    "Sites professionnels, applications web, plateformes SaaS, dashboards, applications métier, refontes et solutions intégrant l’IA. Un seul partenaire, de la définition du produit à la mise en ligne.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="sheet-grid border-b border-rule pb-16 pt-32 md:pb-20 md:pt-44">
        <div className="shell">
          <p className="label eyebrow eyebrow-accent">Services</p>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,5.4vw,4rem)] font-semibold leading-[1.02]">
            Un seul partenaire, de l’idée au produit en ligne.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            Nous prenons en charge le produit complet&nbsp;: définir ce qu’il doit
            faire, le concevoir, le développer, le tester, le mettre en ligne et
            vous en remettre les clés.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/devis" className="btn btn-primary btn-lg">
              Demander un devis
              <ArrowRight className="arrow size-4" />
            </Link>
            <Link href="/realisations" className="btn btn-ghost btn-lg">
              Voir nos réalisations
            </Link>
          </div>
        </div>
      </section>

      {/* Capabilities in depth */}
      <section className="band border-b border-rule">
        <div className="shell">
          <SectionHeading
            eyebrow="Ce que nous construisons"
            title="Sept points de départ. Un seul objectif : un produit qui sert."
            lead="Beaucoup de projets ne rentrent pas exactement dans une case. Ce n’est pas un problème — c’est même le cas le plus courant."
          />

          <div className="mt-14 space-y-px border-y border-rule md:mt-20">
            {capabilities.map((c, i) => (
              <article
                key={c.slug}
                id={c.slug}
                data-reveal
                style={delay((i % 3) * 60)}
                className="scroll-mt-28 bg-surface"
              >
                <div className="grid gap-6 p-7 md:grid-cols-12 md:gap-10 md:p-10">
                  <div className="md:col-span-4">
                    <c.Icon className="size-7 text-prussian" />
                    <h3 className="mt-5 font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.025em] md:text-[1.75rem]">
                      {c.title}
                    </h3>
                  </div>

                  <div className="md:col-span-8">
                    <p className="text-[1.0625rem] font-medium leading-snug text-prussian">
                      {c.outcome}
                    </p>
                    <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft">
                      {c.detail}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-x-2.5 gap-y-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-mute">
                      {c.examples.map((e, j, arr) => (
                        <li key={e}>
                          {e}
                          {j < arr.length - 1 && (
                            <span aria-hidden="true" className="ml-2.5 text-rule">
                              /
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What a complete product contains */}
      <section id="produit-complet" className="band scroll-mt-24 border-b border-rule">
        <div className="shell">
          <SectionHeading
            eyebrow="Le produit complet"
            title="Ce qu’il y a derrière ce que voit l’utilisateur."
            lead="Selon le projet, tout ou partie de ces briques est nécessaire. Nous identifions celles dont votre produit a réellement besoin — et nous laissons les autres de côté."
          />

          <div className="mt-14 grid gap-px overflow-hidden rounded-[5px] border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
            {strata.map((s, i) => (
              <div
                key={s.id}
                data-reveal
                style={delay((i % 3) * 70)}
                className="bg-surface p-7"
              >
                <s.Icon className="size-[1.375rem] text-trace-deep" />
                <h3 className="mt-5 font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-[0.875rem] leading-snug text-ink-mute">
                  {s.role}
                </p>
                <ul className="mt-4 space-y-1.5 text-[0.875rem] text-ink-soft">
                  {s.parts.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-px w-2.5 shrink-0 bg-[#0b1a2130]"
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p data-reveal className="mt-8 max-w-2xl text-[0.9375rem] text-ink-mute">
            Vous n’avez pas à penser à toute cette complexité. C’est notre travail.
          </p>
        </div>
      </section>

      <CtaBand
        title="Dites-nous ce que vous voulez obtenir."
        lead="Nous identifions ce que votre produit nécessite réellement, puis nous vous envoyons une proposition claire."
      />
    </>
  );
}
