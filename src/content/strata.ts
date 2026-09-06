import {
  IconApp,
  IconBell,
  IconData,
  IconGrowth,
  IconLaunch,
  IconMonitor,
  IconPayment,
  IconSettings,
  IconShield,
} from "@/components/site/Icons";

export type Stratum = {
  id: string;
  title: string;
  role: string;
  parts: string[];
  Icon: typeof IconApp;
};

/**
 * The substrate under "je veux juste une plateforme de réservation".
 * Ordered as the product is actually assembled: what the user touches first,
 * then everything that has to exist for it to hold up.
 */
export const strata: Stratum[] = [
  {
    id: "experience",
    title: "Expérience client",
    role: "Ce que vos utilisateurs voient et utilisent.",
    parts: [
      "Site public",
      "Application client",
      "Espace personnel",
      "Navigation",
      "Recherche & filtres",
      "Formulaires",
      "Version mobile",
    ],
    Icon: IconApp,
  },
  {
    id: "administration",
    title: "Administration",
    role: "Votre main sur le produit, au quotidien.",
    parts: [
      "Tableau de bord",
      "Gestion des utilisateurs",
      "Gestion des contenus",
      "Paramètres métier",
      "Modération",
      "Rapports",
    ],
    Icon: IconSettings,
  },
  {
    id: "comptes",
    title: "Comptes & sécurité",
    role: "Qui entre, et jusqu’où.",
    parts: [
      "Inscription",
      "Connexion",
      "Mot de passe oublié",
      "Rôles",
      "Permissions",
      "Accès sécurisé",
      "Protection contre les abus",
    ],
    Icon: IconShield,
  },
  {
    id: "communication",
    title: "Communication",
    role: "Le produit qui parle à vos utilisateurs.",
    parts: [
      "Emails transactionnels",
      "Confirmations",
      "Notifications",
      "Rappels",
      "Emails de compte",
      "Alertes métier",
    ],
    Icon: IconBell,
  },
  {
    id: "paiements",
    title: "Paiements & opérations",
    role: "Quand de l’argent ou une validation circule.",
    parts: [
      "Paiement en ligne",
      "Abonnements",
      "Factures",
      "Reçus",
      "Remboursements",
      "Workflows de validation",
      "Règles métier",
    ],
    Icon: IconPayment,
  },
  {
    id: "donnees",
    title: "Données & contenus",
    role: "Ce que le produit conserve, et retrouve.",
    parts: [
      "Données clients",
      "Données métier",
      "Documents",
      "Envoi de fichiers",
      "Recherche",
      "Exports",
      "Sauvegardes",
    ],
    Icon: IconData,
  },
  {
    id: "visibilite",
    title: "Visibilité & croissance",
    role: "Pour qu’on vous trouve, et qu’on revienne.",
    parts: [
      "SEO",
      "Partage social",
      "Analytics",
      "Suivi des conversions",
      "Performance",
      "Expérience mobile",
    ],
    Icon: IconGrowth,
  },
  {
    id: "exploitation",
    title: "Exploitation",
    role: "Savoir ce qui se passe, avant vos utilisateurs.",
    parts: [
      "Logs",
      "Suivi des erreurs",
      "Monitoring",
      "Sauvegardes",
      "Alertes",
      "État du système",
    ],
    Icon: IconMonitor,
  },
  {
    id: "mise-en-ligne",
    title: "Mise en ligne & suite",
    role: "Le moment où le produit devient réel.",
    parts: [
      "Domaine",
      "Hébergement",
      "Mise en production",
      "Configuration",
      "Environnements",
      "Maintenance",
      "Évolutions",
    ],
    Icon: IconLaunch,
  },
];
