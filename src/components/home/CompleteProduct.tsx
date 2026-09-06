import Link from "next/link";
import { strata } from "@/content/strata";
import { ArrowRight, Check } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

/**
 * The page’s argument, made visible.
 *
 * The client’s sentence stays pinned on the left while the substrate stacks up
 * on the right: you keep reading "je veux une plateforme de réservation" as
 * nine layers of what that actually requires slide into place beneath it.
 */
export function CompleteProduct() {
  return (
    <section id="produit-complet" className="on-dark sheet-grid-dark band">
      <div className="shell">
        <p className="label eyebrow eyebrow-accent" data-reveal="none">
          Le produit complet
        </p>
        <h2
          data-reveal
          style={delay(60)}
          className="mt-6 max-w-4xl font-display text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.02]"
        >
          Un produit, ce n&rsquo;est pas seulement une interface.
        </h2>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* The ask — pinned, so it stays true while the stack grows */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <figure data-reveal="left" className="relative">
                <div className="border-l-2 border-trace pl-6">
                  <blockquote className="font-display text-[1.75rem] font-medium leading-[1.2] tracking-[-0.02em] text-paper md:text-[2rem]">
                    « Je veux une plateforme de réservation. »
                  </blockquote>
                  <figcaption className="label mt-4 text-[#93aab4]">
                    Un client, première conversation
                  </figcaption>
                </div>
              </figure>

              <div className="mt-10 space-y-5 text-[1.0625rem] leading-relaxed text-[#a9bdc6]">
                <p>
                  C&rsquo;est un très bon point de départ. Mais une plateforme de
                  réservation qui fonctionne vraiment, ce n&rsquo;est pas un écran
                  de réservation&nbsp;: c&rsquo;est aussi des comptes, une
                  administration, des emails de confirmation, des paiements, des
                  données, une mise en ligne.
                </p>
                <p className="text-paper">
                  Vous n&rsquo;avez pas à identifier tout cela. C&rsquo;est
                  précisément notre travail.
                </p>
              </div>

              <p
                data-reveal="left"
                style={delay(120)}
                className="mt-8 border-t border-[#f3f3f024] pt-6 text-[0.9375rem] leading-relaxed text-[#93aab4]"
              >
                Chaque projet est différent. Nous n&rsquo;ajoutons que les briques
                réellement nécessaires à votre produit — jamais un catalogue
                complet appliqué à tout le monde.
              </p>

              <Link
                href="/devis"
                className="btn btn-marker mt-8 hidden lg:inline-flex"
              >
                Parlez-nous de votre projet
                <ArrowRight className="arrow size-4" />
              </Link>
            </div>
          </div>

          {/* The substrate */}
          <div className="lg:col-span-7">
            <p className="label mb-4 flex items-center gap-3 text-[#93aab4]">
              <span aria-hidden="true" className="h-px w-6 bg-[#f3f3f03d]" />
              Ce qu&rsquo;il faut en dessous
            </p>

            <ol className="overflow-hidden rounded-[5px] border border-[#f3f3f024] bg-[#ffffff06]">
              {strata.map((s, i) => (
                <li
                  key={s.id}
                  data-reveal="right"
                  style={delay(i * 45)}
                  className="grid gap-x-5 gap-y-2 border-b border-[#f3f3f01a] px-5 py-6 transition-colors hover:bg-[#ffffff08] md:grid-cols-[1.75rem_minmax(0,11rem)_1fr] md:px-7 md:py-7"
                >
                  <s.Icon className="size-[1.375rem] text-trace/85 md:mt-0.5" />

                  <div>
                    <h3 className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-paper">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-[0.8125rem] leading-snug text-[#93aab4] md:hidden lg:block">
                      {s.role}
                    </p>
                  </div>

                  <ul className="flex flex-wrap items-baseline gap-x-2 gap-y-1 self-start font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-[#a9bdc6] md:mt-0.5">
                    {s.parts.map((part, j) => (
                      <li key={part}>
                        {part}
                        {j < s.parts.length - 1 && (
                          <span aria-hidden="true" className="ml-2 text-[#f3f3f030]">
                            ·
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

              {/* Terminus */}
              <li
                data-reveal="right"
                style={delay(160)}
                className="flex items-center gap-4 bg-trace px-5 py-6 md:px-7"
              >
                <Check className="size-5 shrink-0 text-prussian-ink" strokeWidth={2} />
                <div>
                  <p className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-prussian-ink">
                    Produit complet
                  </p>
                  <p className="text-[0.8125rem] leading-snug text-[#0724307a]">
                    En ligne, utilisable, et à vous.
                  </p>
                </div>
              </li>
            </ol>

            <Link href="/devis" className="btn btn-marker mt-8 w-full lg:hidden">
              Parlez-nous de votre projet
              <ArrowRight className="arrow size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
