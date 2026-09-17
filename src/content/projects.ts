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
 * do. No metrics, testimonials or invented outcomes. If a claim isn’t
 * visible on the product itself, it isn’t here.
 */
export const projects: Project[] = [
  {
    slug: "isiil",
    name: "ISIIL",
    domain: "isiil.com",
    url: "https://isiil.com",
    sector: "Formation professionnelle en ligne",
    tagline: "Un institut en ligne fondé sur des compétences évaluées et vérifiables.",
    summary:
      "ISIIL relie un référentiel métier, des parcours d’apprentissage et des évaluations. Chaque compétence validée laisse une preuve datée dans un passeport partageable par lien.",
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
        note: "Préparation au rôle, compétences validées, prochaine compétence à démontrer et évaluation associée à chaque preuve.",
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
    tagline: "Une certification en ligne avec un score, un niveau et un certificat vérifiable.",
    summary:
      "Profaly permet d’acheter et de passer une certification professionnelle en ligne. Le candidat obtient un score, un niveau, un profil de compétences et un certificat PDF vérifiable. Une analyse de CV assistée par IA complète le résultat.",
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
