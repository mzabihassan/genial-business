import Link from "next/link";
import { capabilities } from "@/content/capabilities";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowRight } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

export function WhatWeBuild() {
  return (
    <section id="ce-que-nous-construisons" className="band border-b border-rule">
      <div className="shell">
        <SectionHeading
          eyebrow="Ce que nous construisons"
          title="Arrivez avec un besoin. Repartez avec un produit."
          lead="Que vous vouliez une présence en ligne, un outil interne ou un produit que vos clients paient, le point de départ est le même : une conversation sur ce que vous voulez obtenir."
        />

        {/* An index, not a grid of look-alike cards. Each line is a way in. */}
        <ul className="mt-14 border-t border-rule md:mt-20">
          {capabilities.map((c, i) => (
            <li key={c.slug} data-reveal style={delay(i * 55)}>
              <Link
                href={`/services#${c.slug}`}
                className="group grid gap-x-8 gap-y-3 border-b border-rule py-7 transition-colors hover:bg-surface md:grid-cols-[1.5rem_minmax(0,17rem)_1fr_1.5rem] md:items-baseline md:py-8 md:pl-4 md:pr-4 lg:gap-x-12"
              >
                <c.Icon className="size-6 self-start text-prussian transition-colors group-hover:text-trace-deep md:mt-0.5" />

                <h3 className="font-display text-[1.375rem] font-semibold tracking-[-0.025em] md:text-2xl">
                  {c.title}
                </h3>

                <div>
                  <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-ink-soft md:text-base">
                    {c.outcome}
                  </p>
                  <p className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-mute">
                    {c.examples.map((e, j) => (
                      <span key={e}>
                        {e}
                        {j < c.examples.length - 1 && (
                          <span className="ml-2.5 text-rule" aria-hidden="true">
                            /
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                </div>

                <ArrowRight
                  className="hidden size-5 self-start text-ink-mute transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:text-ink md:mt-1 md:block"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>

        <p data-reveal className="mt-8 text-[0.9375rem] text-ink-mute">
          Votre projet ne rentre dans aucune de ces cases&nbsp;?{" "}
          <Link href="/devis" className="link-underline font-medium text-ink">
            Décrivez-le nous quand même
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
