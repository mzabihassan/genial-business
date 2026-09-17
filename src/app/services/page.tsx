import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { capabilities } from "@/content/capabilities";
import { strata } from "@/content/strata";
import { CtaBand } from "@/components/site/CtaBand";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowRight } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Services | Sites, applications et logiciels métier",
  description:
    "Conception et développement de sites, applications web, plateformes SaaS, outils métier et refontes, de la définition du besoin à la mise en ligne.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="sheet-grid editorial-hero border-b border-rule pb-16 pt-32 md:pb-20 md:pt-44" data-scroll-scene>
        <div className="shell">
          <p className="label eyebrow eyebrow-accent">Services</p>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,5.4vw,4rem)] font-semibold leading-[1.02]">
            Ce dont votre activité a besoin. Jusqu’à la mise en ligne.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            Un site pour recevoir des demandes. Une application pour vendre un
            service. Un logiciel pour mieux travailler. Nous construisons le
            produit et les outils nécessaires à son fonctionnement, avec une seule équipe.
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
            title="Partez de votre besoin."
            lead="Ces catégories donnent un point de repère. Si votre projet se trouve entre plusieurs, nous définirons le bon périmètre avec vous."
          />

          <div className="mt-14 border-t border-rule md:mt-20">
            {capabilities.map((c, i) => (
              <article
                key={c.slug}
                id={c.slug}
                data-reveal="line"
                style={delay((i % 3) * 60)}
                className="capability-detail scroll-mt-28 border-b border-rule"
              >
                <div className="grid gap-6 p-7 md:grid-cols-12 md:gap-10 md:p-10">
                  <div className="md:col-span-4">
                    <h3 className="font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.025em] md:text-[1.75rem]">
                      {c.title}
                    </h3>
                  </div>

                  <div className="md:col-span-8">
                    <p className="text-[1.0625rem] font-medium leading-snug text-prussian">
                      {c.outcome}
                    </p>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
                      {c.detail}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-x-2.5 gap-y-1.5 font-mono text-xs uppercase tracking-[0.08em] text-ink-mute">
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
            title="Un produit prêt à fonctionner, pas un chantier à terminer."
            lead="Administration, accès, données ou hébergement : leur utilité dépend du projet. Nous ne prévoyons que ce qui est nécessaire à son fonctionnement."
          />

          <div className="mt-14 grid gap-x-10 gap-y-0 border-t border-rule sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
            {strata.map((s, i) => (
              <div
                key={s.id}
                data-reveal
                style={delay((i % 3) * 70)}
                className="border-b border-rule py-7"
              >
                <h3 className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-mute">
                  {s.role}
                </p>
                <ul className="mt-4 space-y-2 text-base leading-relaxed text-ink-soft">
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

          <p data-reveal className="mt-8 max-w-2xl text-base leading-relaxed text-ink-mute">
            Nous passons ces points en revue pendant le cadrage. Vous n’avez pas
            à les définir avant de nous contacter.
          </p>
        </div>
      </section>

      <CtaBand
        title="Décrivez-nous votre besoin."
        lead="Nous déterminerons avec vous ce que le produit doit contenir, puis nous chiffrerons ce périmètre."
      />
    </>
  );
}
