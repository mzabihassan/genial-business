"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  IconApp,
  IconShield,
  IconSettings,
  IconLaunch,
} from "@/components/site/Icons";

const layers = [
  {
    title: "L’expérience de vos clients",
    short: "L’expérience",
    Icon: IconApp,
    description:
      "Vos clients choisissent un créneau, réservent et retrouvent leur rendez-vous sur mobile comme sur ordinateur.",
    parts: [
      "Site & application",
      "Parcours de réservation",
      "Espace personnel",
    ],
  },
  {
    title: "Tout ce qui travaille en coulisses",
    short: "Les fonctionnalités",
    Icon: IconSettings,
    description:
      "Vous gérez les disponibilités. Vos clients reçoivent leurs confirmations. Les paiements sont intégrés si votre activité le nécessite.",
    parts: ["Administration", "Emails & rappels", "Paiements si nécessaires"],
  },
  {
    title: "Les accès et les données",
    short: "Les fondations",
    Icon: IconShield,
    description:
      "Chaque personne accède aux informations qui la concernent. Les données sont organisées, protégées et sauvegardées.",
    parts: ["Comptes & permissions", "Données & sauvegardes", "Sécurité"],
  },
  {
    title: "La mise en ligne",
    short: "La mise en ligne",
    Icon: IconLaunch,
    description:
      "Le domaine, l’hébergement et la configuration sont en place. Le parcours est testé, le produit est en ligne et vous avez les clés.",
    parts: ["Domaine & hébergement", "Tests & monitoring", "SEO & mesure d’audience", "Accès & documentation"],
  },
];
export function CompleteProduct() {
  const [active, setActive] = useState(0);
  const selected = layers[active];
  return (
    <section
      id="produit-complet"
      className="studio-section product-section on-dark"
      data-scroll-scene
    >
      <div className="shell">
        <div className="product-layout">
          <div className="product-copy">
            <h2>Ce que vos clients voient.<br /><span className="product-heading-muted">Et tout ce qui le fait fonctionner.</span></h2>
            <p className="section-lead">
              Vous n’avez pas à coordonner un prestataire pour le site, un autre
              pour les paiements et un troisième pour l’hébergement. Notre équipe
              prend en charge le produit dans son ensemble.
            </p>
            <Link href="/services#produit-complet" className="text-link">
              Tout ce que l’on prend en charge{" "}
              <ArrowUpRight className="size-4" />
            </Link>
            <p className="product-caveat">
              Nous ne retenons que les éléments utiles à votre projet.
            </p>
          </div>
          <div className="product-explorer">
            <div className="idea-example">
              <p>
                Prenons une plateforme
                <br />
                de réservation.
              </p>
              <span className="example-arrow" aria-hidden="true">
                ↓
              </span>
            </div>
            <div
              className="product-layer-list"
              aria-label="Les couches d’un produit complet"
            >
              {layers.map((layer, i) => (
                <button
                  key={layer.short}
                  type="button"
                  aria-pressed={active === i}
                  aria-controls="product-layer-detail"
                  onClick={() => setActive(i)}
                  className={`product-layer ${active === i ? "is-active" : ""}`}
                >
                  <layer.Icon className="size-5" />
                  <span>{layer.short}</span>
                  <span className="layer-count" aria-hidden="true">{active === i ? "−" : "+"}</span>
                </button>
              ))}
            </div>
            <div
              id="product-layer-detail"
              className="layer-detail"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="layer-detail-content" key={selected.title}>
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>
              <ul>
                {selected.parts.map((p) => (
                  <li key={p}>
                    <Check className="size-3.5" />
                    {p}
                  </li>
                ))}
              </ul>
              </div>
            </div>
            <div className="product-result">
              <Check className="size-4" />
              <span>Le produit est en ligne et les accès sont à vous.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
