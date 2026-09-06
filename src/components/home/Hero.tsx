import Link from "next/link";
import { ArrowRight } from "@/components/site/Icons";
import { ProductionLine } from "./ProductionLine";

export function Hero() {
  return (
    <section className="sheet-grid relative overflow-hidden border-b border-rule pb-16 pt-32 md:pb-24 md:pt-44">
      {/* A wash of cyanotype behind the type, so the sheet has depth without a gradient doing the work */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10%] -top-[30%] h-[70rem] w-[70rem] rounded-full bg-[radial-gradient(circle,#0e3a4f0f_0%,transparent_62%)]"
      />

      <div className="shell relative">
        <p
          className="label eyebrow eyebrow-accent animate-[rise_0.7s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ animationDelay: "60ms" }}
        >
          Studio de développement logiciel
        </p>

        <h1 className="mt-7 max-w-[19ch] font-display text-[clamp(2.5rem,7.4vw,5.25rem)] font-semibold leading-[0.97]">
          <span
            className="block animate-[rise_0.8s_cubic-bezier(0.22,1,0.36,1)_both]"
            style={{ animationDelay: "120ms" }}
          >
            Vous avez l&rsquo;idée.
          </span>
          <span
            className="mt-1 block animate-[rise_0.8s_cubic-bezier(0.22,1,0.36,1)_both] text-prussian"
            style={{ animationDelay: "220ms" }}
          >
            Nous construisons
            <br className="hidden sm:block" />{" "}
            <span className="relative inline-block">
              le produit.
              {/* The marker stroke — the one flourish in the hero */}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 h-[0.14em] w-full origin-left animate-[draw_0.85s_cubic-bezier(0.22,1,0.36,1)_1s_both] rounded-full bg-trace"
              />
            </span>
          </span>
        </h1>

        <div className="mt-9 max-w-2xl">
          <p
            className="animate-[rise_0.8s_cubic-bezier(0.22,1,0.36,1)_both] text-lg leading-relaxed text-ink-soft md:text-xl"
            style={{ animationDelay: "320ms" }}
          >
            Nous concevons et développons des produits digitaux complets, de la
            première conversation jusqu’à la mise en ligne. Vous n’avez pas besoin
            de savoir ce que votre produit nécessite&nbsp;: c’est notre travail de
            le déterminer.
          </p>

          <div
            className="mt-9 flex animate-[rise_0.8s_cubic-bezier(0.22,1,0.36,1)_both] flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "400ms" }}
          >
            <Link href="/devis" className="btn btn-primary btn-lg">
              Demander un devis
              <ArrowRight className="arrow size-4" />
            </Link>
            <Link href="/realisations" className="btn btn-ghost btn-lg">
              Voir nos réalisations
            </Link>
          </div>
        </div>

        <ProductionLine className="mt-16 md:mt-24" />
      </div>
    </section>
  );
}
