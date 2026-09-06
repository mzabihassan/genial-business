import {
  IconAi,
  IconApp,
  IconDashboard,
  IconRefonte,
  IconSaas,
  IconSite,
  IconWorkflow,
} from "@/components/site/Icons";

export type Capability = {
  slug: string;
  title: string;
  outcome: string;
  detail: string;
  examples: string[];
  Icon: typeof IconSite;
};

export const capabilities: Capability[] = [
  {
    slug: "site-professionnel",
    title: "Site professionnel",
    outcome:
      "Une présence en ligne qui explique clairement ce que vous faites et transforme les visiteurs en contacts.",
    detail:
      "Un site pensé pour être trouvé, compris et utilisé. Contenu structuré, pages rapides, formulaires qui arrivent vraiment dans votre boîte mail, et une interface pour mettre à jour vos contenus sans nous appeler.",
    examples: ["Site vitrine", "Site institutionnel", "Site de service", "Page de lancement"],
    Icon: IconSite,
  },
  {
    slug: "application-web",
    title: "Application web",
    outcome:
      "Un outil accessible depuis un navigateur, construit autour de vos utilisateurs et de leurs usages réels.",
    detail:
      "Comptes, espaces personnels, formulaires, recherche, fichiers, notifications. Une application qui fonctionne sur ordinateur comme sur mobile, sans installation.",
    examples: ["Portail client", "Espace membre", "Plateforme de réservation", "Service en ligne"],
    Icon: IconApp,
  },
  {
    slug: "plateforme-saas",
    title: "Plateforme SaaS",
    outcome:
      "Un produit que vos clients utilisent en autonomie, et que vous pilotez depuis une administration.",
    detail:
      "Inscription, abonnements, facturation, gestion des comptes, niveaux d’accès, tableau de bord. Tout ce qu’il faut pour vendre un service en ligne de façon récurrente.",
    examples: ["Produit par abonnement", "Espace multi-clients", "Marketplace", "Service B2B"],
    Icon: IconSaas,
  },
  {
    slug: "dashboard-back-office",
    title: "Dashboard & back-office",
    outcome:
      "L’interface qui vous donne la main sur votre activité : données, contenus, utilisateurs, réglages.",
    detail:
      "Ce que vos équipes utilisent tous les jours. Chiffres à jour, recherche, filtres, exports, droits par rôle. Conçu pour être compris sans formation.",
    examples: ["Tableau de bord", "Administration", "Reporting", "Gestion des utilisateurs"],
    Icon: IconDashboard,
  },
  {
    slug: "application-metier",
    title: "Application métier",
    outcome:
      "Un processus interne remplacé par un outil. Fini les fichiers partagés et les étapes tenues à la main.",
    detail:
      "Nous partons de votre façon de travailler, pas d’un logiciel générique. Étapes, validations, rôles, historique, documents : votre métier devient un outil que vos équipes utilisent réellement.",
    examples: ["Gestion de dossiers", "Suivi d’activité", "Validation interne", "Planification"],
    Icon: IconWorkflow,
  },
  {
    slug: "refonte",
    title: "Refonte d’un produit existant",
    outcome:
      "Un produit vieillissant repris, modernisé, et remis en état de fonctionner et d’évoluer.",
    detail:
      "Nous reprenons un site ou une application déjà en place : nouvelle interface, performances, corrections, nouvelles fonctionnalités, migration. Sans repartir de zéro quand ce n’est pas nécessaire.",
    examples: ["Nouvelle interface", "Modernisation technique", "Performances", "Nouvelles fonctionnalités"],
    Icon: IconRefonte,
  },
  {
    slug: "produit-ia",
    title: "Solution intégrant l’IA",
    outcome:
      "De l’intelligence artificielle là où elle apporte un gain réel, pas là où elle fait joli.",
    detail:
      "Analyse de documents, génération et classification de contenu, assistance à la saisie, automatisation d’étapes répétitives. Nous intégrons l’IA quand elle résout un vrai problème de votre activité.",
    examples: ["Analyse de documents", "Automatisation", "Assistance métier", "Traitement de contenu"],
    Icon: IconAi,
  },
];
