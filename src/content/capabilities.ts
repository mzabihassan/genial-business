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
      "Un site qui explique votre activité et permet aux visiteurs de vous contacter.",
    detail:
      "Nous structurons le contenu, travaillons les performances et relions les formulaires à votre boîte mail. Vous pouvez aussi disposer d’une interface pour mettre les pages à jour.",
    examples: ["Site vitrine", "Site institutionnel", "Site de service", "Page de lancement"],
    Icon: IconSite,
  },
  {
    slug: "application-web",
    title: "Application web",
    outcome:
      "Un outil accessible depuis un navigateur, sur ordinateur comme sur mobile.",
    detail:
      "Selon le besoin, l’application peut gérer des comptes, des espaces personnels, des formulaires, des fichiers ou des notifications. Elle ne demande aucune installation.",
    examples: ["Portail client", "Espace membre", "Plateforme de réservation", "Service en ligne"],
    Icon: IconApp,
  },
  {
    slug: "plateforme-saas",
    title: "Plateforme SaaS",
    outcome:
      "Un service en ligne que vos clients utilisent depuis leur compte et que vous gérez dans une administration.",
    detail:
      "Nous pouvons prendre en charge l’inscription, les abonnements, la facturation, les droits d’accès et le tableau de bord nécessaires au service.",
    examples: ["Produit par abonnement", "Espace multi-clients", "Marketplace", "Service B2B"],
    Icon: IconSaas,
  },
  {
    slug: "dashboard-back-office",
    title: "Dashboard & back-office",
    outcome:
      "Une interface interne pour suivre les données et gérer les contenus, les utilisateurs ou les réglages.",
    detail:
      "Nous organisons les chiffres, la recherche, les filtres, les exports et les droits par rôle autour des tâches quotidiennes de votre équipe.",
    examples: ["Tableau de bord", "Administration", "Reporting", "Gestion des utilisateurs"],
    Icon: IconDashboard,
  },
  {
    slug: "application-metier",
    title: "Application métier",
    outcome:
      "Un outil qui reprend un processus aujourd’hui géré dans des fichiers partagés ou suivi à la main.",
    detail:
      "Nous partons de votre façon de travailler. L’outil reprend les étapes, les validations, les rôles, l’historique et les documents dont votre équipe a besoin.",
    examples: ["Gestion de dossiers", "Suivi d’activité", "Validation interne", "Planification"],
    Icon: IconWorkflow,
  },
  {
    slug: "refonte",
    title: "Refonte d’un produit existant",
    outcome:
      "Un produit existant corrigé, modernisé et préparé pour les prochaines évolutions.",
    detail:
      "Nous examinons d’abord l’existant pour savoir ce qui peut être conservé. La reprise peut porter sur l’interface, les performances, les erreurs, les fonctionnalités ou une migration.",
    examples: ["Nouvelle interface", "Modernisation technique", "Performances", "Nouvelles fonctionnalités"],
    Icon: IconRefonte,
  },
  {
    slug: "produit-ia",
    title: "Solution intégrant l’IA",
    outcome:
      "Une fonction d’IA retenue parce qu’elle fait gagner du temps ou améliore un résultat mesurable.",
    detail:
      "L’IA peut servir à analyser des documents, classer du contenu, assister la saisie ou automatiser une étape répétitive. Nous vérifions d’abord qu’elle répond bien au besoin.",
    examples: ["Analyse de documents", "Automatisation", "Assistance métier", "Traitement de contenu"],
    Icon: IconAi,
  },
];
