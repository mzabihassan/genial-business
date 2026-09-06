import type { StaticImageData } from "next/image";
import isiilShot from "@/assets/isiil.webp";
import profalyShot from "@/assets/profaly.webp";

export type Project = {
  slug: string;
  name: string;
  domain: string;
  url: string;
  sector: string;
  tagline: string;
  summary: string;
  surfaces: { title: string; note: string }[];
  capabilities: string[];
  shot: { src: StaticImageData; alt: string };
};

/**
 * Two products, both live. Everything below describes what the sites actually
 * do — no metrics, no testimonials, no invented outcomes. If a claim isn’t
 * visible on the product itself, it isn’t here.
 */
export const projects: Project[] = [
  {
    slug: "isiil",
    name: "ISIIL",
    domain: "isiil.com",
    url: "https://isiil.com",
    sector: "Formation professionnelle en ligne",
    tagline: "Un institut en ligne où chaque compétence est prouvée, pas déclarée.",
    summary:
      "ISIIL forme à un métier précis et fait démontrer chaque compétence par une évaluation qui laisse une preuve datée. Le produit relie un référentiel de métier, des parcours d’apprentissage, des évaluations et un passeport de compétences que n’importe qui peut vérifier avec un lien.",
    surfaces: [
      {
        title: "Site public",
        note: "Présentation de l’institut, des programmes et de la méthode d’évaluation.",
      },
      {
        title: "Diagnostic de CV",
        note: "Un outil gratuit qui lit un CV face au référentiel d’un métier et indique les compétences déjà démontrées et celles qui manquent.",
      },
      {
        title: "Espace étudiant",
        note: "Le parcours de l’apprenant : cours, laboratoires, projets et évaluations.",
      },
      {
        title: "Cockpit de compétences",
        note: "Préparation au rôle, compétences prouvées, prochaine compétence à démontrer, et l’évaluation exacte derrière chaque preuve.",
      },
      {
        title: "Passeport vérifiable",
        note: "Un profil de compétences partageable, vérifiable publiquement par lien depuis le site.",
      },
    ],
    capabilities: [
      "Site public",
      "Espace étudiant",
      "Comptes utilisateurs",
      "Référentiel de compétences",
      "Évaluations & examens",
      "Correction assistée par IA",
      "Analyse de CV par IA",
      "Vérification publique",
      "Administration",
      "Déploiement",
    ],
    shot: {
      src: isiilShot,
      alt: "Page d’accueil du site ISIIL : « Prouvez vos compétences. Entrez dans le métier. »",
    },
  },
  {
    slug: "profaly",
    name: "Profaly",
    domain: "profaly.com",
    url: "https://profaly.com",
    sector: "Certification professionnelle",
    tagline: "Une certification en ligne qui produit un résultat mesurable et vérifiable.",
    summary:
      "Profaly permet de passer une certification professionnelle en ligne, de la payer en une fois, et d’en ressortir avec un score, un niveau, un profil de compétences et un certificat PDF que les recruteurs peuvent vérifier. Une analyse de CV par IA complète le résultat avec des points forts, des faiblesses et des pistes concrètes.",
    surfaces: [
      {
        title: "Catalogue de certifications",
        note: "Recherche et exploration des certifications publiées, par métier.",
      },
      {
        title: "Inscription et paiement",
        note: "Paiement unique en ligne, accès immédiat, sans abonnement ni reconduction.",
      },
      {
        title: "Passage d’examen",
        note: "L’épreuve, puis le calcul du score professionnel et du niveau PROFALY.",
      },
      {
        title: "Résultat détaillé",
        note: "Score sur 100, niveau A1–C2, répartition par compétence, classement mondial.",
      },
      {
        title: "Analyse de CV par IA",
        note: "Points forts détectés, défauts identifiés, améliorations suggérées, mise en relation avec des offres.",
      },
      {
        title: "Vérification de certificat",
        note: "Une page publique où un recruteur vérifie un certificat à partir de son code unique.",
      },
    ],
    capabilities: [
      "Site public",
      "Comptes utilisateurs",
      "Paiements en ligne",
      "Examens en ligne",
      "Génération de certificats PDF",
      "Vérification publique",
      "Analyse de CV par IA",
      "Interface multilingue",
      "Administration",
      "Déploiement",
    ],
    shot: {
      src: profalyShot,
      alt: "Page d’accueil du site Profaly, certification « Analyste financier » avec score professionnel et niveau PROFALY.",
    },
  },
];
