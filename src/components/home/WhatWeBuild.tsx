import Link from "next/link";
import {
  ArrowUpRight,
  IconSite,
  IconSaas,
  IconWorkflow,
  IconRefonte,
} from "@/components/site/Icons";

const services = [
  {
    title: "Transformez l’intérêt en demandes.",
    text: "Présentez votre travail et donnez aux visiteurs un moyen simple de vous contacter.",
    tag: "Sites web & présence en ligne",
    href: "site-professionnel",
    Icon: IconSite,
  },
  {
    title: "Ouvrez votre service à vos clients.",
    text: "Réservation, espace client ou service par abonnement : le produit s’adapte à l’usage.",
    tag: "Applications web & SaaS",
    href: "application-web",
    Icon: IconSaas,
  },
  {
    title: "Faites avancer le travail, pas les tableurs.",
    text: "Centralisez un processus, suivez l’activité ou automatisez une tâche répétitive.",
    tag: "Outils métier & intelligence artificielle",
    href: "application-metier",
    Icon: IconWorkflow,
  },
  {
    title: "Faites évoluer ce qui existe déjà.",
    text: "Corrigez ce qui bloque, modernisez l’interface et faites évoluer l’existant.",
    tag: "Refonte & évolution",
    href: "refonte",
    Icon: IconRefonte,
  },
];

export function WhatWeBuild() {
  return (
    <section
      id="ce-que-nous-construisons"
      className="studio-section services-section"
    >
      <div className="shell services-layout">
        <div>
          <h2>Le bon produit commence par votre besoin.</h2>
          <p className="section-lead">
            Gagner des clients, lancer un service ou simplifier le quotidien de
            l’équipe. Nous choisissons le format qui sert votre objectif, puis
            prenons en charge sa réalisation.
          </p>
          <Link href="/services" className="text-link">
            Découvrir nos expertises <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="service-list">
          {services.map((s) => (
            <Link
              key={s.href}
              href={`/services#${s.href}`}
              className="service-row"
            >
              <div className="service-icon">
                <s.Icon className="size-6" />
              </div>
              <div>
                <p className="studio-kicker">{s.tag}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              <ArrowUpRight className="service-arrow size-5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
