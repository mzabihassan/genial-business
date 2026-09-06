export type Step = {
  n: string;
  title: string;
  summary: string;
  detail: string;
  side: "vous" | "nous";
};

export const process: Step[] = [
  {
    n: "01",
    title: "Vous nous expliquez votre idée",
    summary: "Quelques lignes suffisent.",
    detail:
      "Pas de cahier des charges, pas de vocabulaire technique. Décrivez ce que vous voulez faire, avec vos mots. C’est le seul prérequis.",
    side: "vous",
  },
  {
    n: "02",
    title: "Nous étudions votre besoin",
    summary: "Nous cherchons à comprendre votre activité.",
    detail:
      "À qui s’adresse le produit, ce qu’il doit permettre, comment vous travaillez aujourd’hui, et ce qui compte vraiment pour vous. Nous posons les questions que vous n’aviez pas à préparer.",
    side: "nous",
  },
  {
    n: "03",
    title: "Nous définissons le périmètre",
    summary: "Ce que contient la première version.",
    detail:
      "Nous écrivons ce qui entre dans la première version, ce qui peut attendre, et les briques que le produit nécessite réellement pour fonctionner — y compris celles auxquelles vous n’avez pas pensé.",
    side: "nous",
  },
  {
    n: "04",
    title: "Vous recevez un devis",
    summary: "Une proposition claire, sur un périmètre écrit.",
    detail:
      "Vous savez ce qui est inclus, ce qui ne l’est pas, et pourquoi, avant de vous engager. S’il faut ajuster le périmètre pour tenir un budget, nous le faisons ensemble.",
    side: "vous",
  },
  {
    n: "05",
    title: "Nous construisons",
    summary: "Design et développement avancent ensemble.",
    detail:
      "Le produit n’est pas dessiné d’un côté et codé de l’autre. Vous suivez l’avancement et voyez les écrans réels, pas des images.",
    side: "nous",
  },
  {
    n: "06",
    title: "Nous validons",
    summary: "Relecture, tests, corrections.",
    detail:
      "Chaque parcours est vérifié : ce qui marche, ce qui casse, ce qui manque. Rien ne part en ligne sans avoir été relu et testé par un développeur.",
    side: "nous",
  },
  {
    n: "07",
    title: "Nous mettons en ligne",
    summary: "Domaine, hébergement, production.",
    detail:
      "Nous nous occupons du passage en réel : configuration, environnements, nom de domaine, emails, mise en production. Vous n’avez pas de prestataire supplémentaire à trouver.",
    side: "nous",
  },
  {
    n: "08",
    title: "Vous récupérez votre produit",
    summary: "Code, accès, comptes, documentation.",
    detail:
      "Nous vous remettons ce qui vous revient. Le produit est à vous, et la suite vous appartient : avec nous, en interne, ou avec quelqu’un d’autre.",
    side: "vous",
  },
];
