/* Shared between the form and the API route: one source of truth for the
   vocabulary, so the email never shows a value the form can't produce. */

export const PROJECT_TYPES = [
  { value: "site", label: "Site web", note: "Site vitrine, institutionnel, de service" },
  { value: "application", label: "Application web", note: "Un outil accessible depuis un navigateur" },
  { value: "saas", label: "Plateforme SaaS", note: "Un produit vendu à vos clients" },
  { value: "dashboard", label: "Dashboard / Back-office", note: "Piloter votre activité et vos données" },
  { value: "metier", label: "Application métier", note: "Digitaliser un processus interne" },
  { value: "refonte", label: "Refonte d’un produit existant", note: "Moderniser ce qui existe déjà" },
  { value: "ia", label: "Projet avec intelligence artificielle", note: "Analyse, automatisation, assistance" },
  { value: "inconnu", label: "Je ne sais pas encore", note: "On en discute et on trouve ensemble" },
  { value: "autre", label: "Autre", note: "Décrivez-le à l’étape suivante" },
] as const;

export const SITUATIONS = [
  { value: "idee", label: "J’ai seulement une idée" },
  { value: "besoin", label: "J’ai déjà défini le besoin" },
  { value: "cahier", label: "J’ai un cahier des charges" },
  { value: "maquettes", label: "J’ai des maquettes" },
  { value: "produit", label: "J’ai déjà un produit" },
  { value: "remplacer", label: "Je souhaite remplacer une solution existante" },
] as const;

export const ASSETS = [
  "Logo / identité visuelle",
  "Nom de domaine",
  "Site existant",
  "Maquettes",
  "Documentation",
  "Produit existant",
  "Code existant",
  "Aucun pour l’instant",
] as const;

export const FEATURES = [
  "Comptes utilisateurs",
  "Dashboard",
  "Back-office / administration",
  "Paiements en ligne",
  "Abonnements",
  "Emails automatiques",
  "Notifications",
  "Envoi de fichiers",
  "Recherche",
  "Intégrations avec d’autres outils",
  "Intelligence artificielle",
  "Autre",
] as const;

export const FEATURE_UNSURE = "Je ne sais pas — conseillez-moi";

export const BUDGETS = [
  "Moins de 2 000 €",
  "2 000 – 5 000 €",
  "5 000 – 10 000 €",
  "10 000 – 25 000 €",
  "Plus de 25 000 €",
  "Je ne sais pas encore",
] as const;

export const TIMELINES = [
  "Dès que possible",
  "Moins d’un mois",
  "1 à 3 mois",
  "3 à 6 mois",
  "Flexible",
  "Je ne sais pas encore",
] as const;

/* --- Attachments --------------------------------------------------------- */

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 Mo
export const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20 Mo

export const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".odt",
  ".txt",
  ".md",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".zip",
] as const;

export const ACCEPTED_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.oasis.opendocument.text",
  "text/plain",
  "text/markdown",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/zip",
  "application/x-zip-compressed",
]);

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}

/* --- The payload --------------------------------------------------------- */

export type QuoteData = {
  projectType: string;
  projectTypeOther: string;
  description: string;
  objective: string;
  audience: string;
  situation: string;
  assets: string[];
  features: string[];
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string;
  message: string;
  consent: boolean;
};

export const emptyQuote: QuoteData = {
  projectType: "",
  projectTypeOther: "",
  description: "",
  objective: "",
  audience: "",
  situation: "",
  assets: [],
  features: [],
  budget: "",
  timeline: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  website: "",
  message: "",
  consent: false,
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/** Only three things are ever required. Everything else can wait for the call. */
export function validateStep(step: number, d: QuoteData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 0 && !d.projectType) {
    errors.projectType = "Choisissez un type de projet, ou « Je ne sais pas encore ».";
  }

  if (step === 1) {
    if (d.description.trim().length < 20) {
      errors.description =
        "Décrivez votre projet en quelques phrases (20 caractères minimum).";
    }
  }

  if (step === 5) {
    if (!d.name.trim()) errors.name = "Indiquez votre nom.";
    if (!d.email.trim()) errors.email = "Indiquez votre email.";
    else if (!EMAIL_RE.test(d.email.trim()))
      errors.email = "Cet email ne semble pas valide.";
    if (!d.consent)
      errors.consent = "Votre accord est nécessaire pour que nous puissions vous répondre.";
  }

  return errors;
}

export const STEPS = [
  { id: "type", title: "Type de projet", short: "Projet" },
  { id: "idee", title: "Votre idée", short: "Idée" },
  { id: "situation", title: "Où en êtes-vous", short: "Situation" },
  { id: "fonctionnalites", title: "Fonctionnalités", short: "Besoins" },
  { id: "cadre", title: "Budget & délai", short: "Cadre" },
  { id: "contact", title: "Vos coordonnées", short: "Contact" },
] as const;
