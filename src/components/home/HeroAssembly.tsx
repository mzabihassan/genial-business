"use client";

import { useRef, type PointerEvent } from "react";
import { ArrowUpRight, Check, IconShield } from "@/components/site/Icons";

/** An illustrative booking product, not a real customer's interface. */
export function HeroAssembly() {
  const scene = useRef<HTMLElement>(null);
  const pointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    scene.current?.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width - 0.5) * 7}deg`);
    scene.current?.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height - 0.5) * -5}deg`);
  };
  return (
    <figure className="product-assembly" ref={scene} onPointerMove={pointer} onPointerLeave={() => {
      scene.current?.style.setProperty("--pointer-x", "0deg");
      scene.current?.style.setProperty("--pointer-y", "0deg");
    }}>
      <div className="assembly-volume" aria-hidden="true">
        <div className="assembly-orbit" />
        <div className="product-stack">
          <div className="product-plate plate-infra">
            <div className="plate-heading"><span>Infrastructure</span><span className="plate-dot" /></div>
            <div className="infra-grid"><span>Base de données<i /><i /><i /></span><span>Cloud & déploiement<b>↗</b></span></div>
            <div className="plate-foot"><span>Logs / suivi / sauvegardes</span><span>Connecté <Check className="size-3" /></span></div>
          </div>
          <div className="product-plate plate-engine">
            <div className="plate-heading"><span>Le moteur du produit</span><span>API</span></div>
            <div className="engine-route"><span>Réservation</span><i /><span>Paiement</span><i /><span>Email</span></div>
            <div className="engine-code"><span>POST /reservations</span><span>201 CREATED</span></div>
            <div className="plate-foot"><span><IconShield className="size-3" /> Accès & permissions</span><span>Code source inclus</span></div>
          </div>
          <div className="product-plate plate-admin">
            <div className="plate-heading"><span>Votre espace de gestion</span><span>↗</span></div>
            <div className="booking-row"><span className="booking-avatar">AM</span><span>Réservation confirmée<small>Atelier découverte · 14 h 00</small></span><Check className="size-4" /></div>
            <div className="booking-row"><span className="booking-avatar">JL</span><span>Paiement reçu<small>Confirmation envoyée par email</small></span><Check className="size-4" /></div>
            <div className="plate-foot"><span>Clients / disponibilités / activité</span><span>Administration</span></div>
          </div>
          <div className="product-plate plate-site">
            <div className="plate-heading"><span>atelier.</span><span>Découvrir &nbsp; Réserver</span></div>
            <div className="mini-site"><div><span className="mini-eyebrow">Un moment pour créer</span><strong>Faites place<br />à vos idées.</strong><span className="mini-cta">Choisir mon atelier <ArrowUpRight className="size-3" /></span></div><div className="mini-art"><i /><i /><i /></div></div>
            <div className="plate-foot"><span>Site public / mobile / SEO</span><span>Votre produit</span></div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">Un produit de réservation s’assemble : infrastructure, API et services, administration, puis site public.</figcaption>
    </figure>
  );
}
