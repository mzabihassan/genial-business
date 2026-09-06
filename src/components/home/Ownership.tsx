import Link from "next/link";
import { ownedAssets } from "@/content/ownership";
import { Check, IconKey } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

/**
 * A handover note, not a reassurance paragraph. Listing the actual objects that
 * change hands is what makes the claim believable.
 */
export function Ownership() {
  return (
    <section id="propriete" className="on-dark band">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="label eyebrow eyebrow-accent" data-reveal="none">
                Propriété
              </p>
              <h2
                data-reveal
                style={delay(60)}
                className="mt-6 font-display text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.02]"
              >
                Votre produit.
                <br />
                Vos accès.
                <br />
                <span className="text-trace">Votre contrôle.</span>
              </h2>

              <div
                data-reveal
                style={delay(120)}
                className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-[#a9bdc6]"
              >
                <p>
                  Nous construisons votre produit pour vous, pas pour vous rendre
                  dépendant de nous. À la livraison, vous recevez les accès à tout
                  ce qui concerne votre projet.
                </p>
                <p className="text-paper">
                  Vous restez libre de continuer avec nous, de maintenir le produit
                  en interne, ou de travailler avec un autre partenaire. Le choix
                  vous appartient — parce que le produit vous appartient.
                </p>
              </div>

              <Link href="/methode#propriete" className="btn btn-ghost mt-8">
                Ce que contient une livraison
              </Link>
            </div>
          </div>

          {/* The handover note */}
          <div className="lg:col-span-7">
            <div
              data-reveal="right"
              className="overflow-hidden rounded-[5px] border border-[#f3f3f024] bg-[#ffffff06]"
            >
              <div className="flex items-center gap-3 border-b border-[#f3f3f024] px-5 py-4 md:px-7">
                <IconKey className="size-[1.125rem] text-trace" />
                <h3 className="label text-paper">À la livraison, vous recevez</h3>
              </div>

              <ul>
                {ownedAssets.map((asset, i) => (
                  <li
                    key={asset.label}
                    data-reveal="right"
                    style={delay(i * 40)}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#f3f3f014] px-5 py-4 last:border-b-0 md:px-7"
                  >
                    <span className="flex items-baseline gap-3">
                      <Check
                        className="size-[0.9375rem] shrink-0 translate-y-0.5 text-trace"
                        strokeWidth={2.2}
                      />
                      <span className="font-medium text-paper">{asset.label}</span>
                    </span>
                    <span className="ml-[1.6875rem] font-mono text-[0.75rem] text-[#93aab4] md:ml-0">
                      {asset.note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p
              data-reveal
              className="mt-7 font-display text-[1.375rem] font-semibold tracking-[-0.025em] text-paper md:text-[1.625rem]"
            >
              Pas de dépendance artificielle.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
