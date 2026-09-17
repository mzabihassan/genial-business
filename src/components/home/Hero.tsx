import Link from "next/link";
import { HeroAssembly } from "@/components/home/HeroAssembly";
import { ArrowRight, ArrowUpRight } from "@/components/site/Icons";

export function Hero() {
  return (
    <section className="studio-hero" data-scroll-scene>
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-light-field" />
        <svg className="hero-contours" viewBox="0 0 1200 760" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M420 -100C980 20 410 360 920 470S1450 820 820 900" />
          <path d="M500 -120C1060 0 490 340 1000 450S1530 800 900 880" />
          <path d="M580 -140C1140 -20 570 320 1080 430S1610 780 980 860" />
        </svg>
      </div>
      <div className="shell">
        <div className="hero-layout">
          <div className="hero-copy">
            <h1>
              <span className="hero-line">Votre idée.</span>
              <span className="hero-line">Un produit</span>
              <span className="hero-line hero-line-accent">
                qui prend{" "}
                <span className="hero-life" aria-label="vie.">
                  <span className="hero-life-char" aria-hidden="true">v</span>
                  <span className="hero-life-char" aria-hidden="true">i</span>
                  <span className="hero-life-char" aria-hidden="true">e</span>
                  <span className="hero-life-pulse" aria-hidden="true">.</span>
                </span>
              </span>
            </h1>
            <p className="hero-lead">
              Un site, une application, un logiciel métier. Une seule équipe
              pour le concevoir, le construire et le mettre en production.
              Vous repartez avec le produit et toutes les clés.
            </p>
            <div className="hero-actions">
              <Link href="/devis" className="btn btn-primary btn-lg">
                Demander un devis <ArrowUpRight className="size-4" />
              </Link>
              <Link href="#realisations" className="text-link">
                Voir nos réalisations <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="hero-reassurance">
              Une idée suffit pour commencer. Aucun cahier des charges requis.
            </p>
          </div>
          <HeroAssembly />
        </div>
      </div>
    </section>
  );
}
