export type OwnedAsset = { label: string; note: string };

/** What is handed over at delivery. Stated as objects, not promises. */
export const ownedAssets: OwnedAsset[] = [
  { label: "Code source", note: "L’intégralité du code de votre produit." },
  { label: "Dépôts du projet", note: "L’historique complet du développement." },
  { label: "Nom de domaine", note: "Enregistré à votre nom." },
  { label: "Hébergement", note: "Le compte est le vôtre." },
  { label: "Base de données", note: "Vos données, exportables." },
  { label: "Administration", note: "Les accès administrateur du produit." },
  { label: "Emails", note: "Le service d’envoi et sa configuration." },
  { label: "Paiements", note: "Le compte marchand, s’il y en a un." },
  { label: "Analytics", note: "Les statistiques d’usage." },
  { label: "Production", note: "L’environnement en ligne et ses réglages." },
  { label: "Documentation", note: "De quoi reprendre la main." },
];
