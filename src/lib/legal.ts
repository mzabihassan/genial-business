/**
 * Legal identity. These are the only values on the site that cannot be written
 * for you — they must match the company's registration exactly.
 * Fill them in before going live; anything left as "[À compléter]" is visible
 * on /mentions-legales.
 */
export const legal = {
  companyName: process.env.NEXT_PUBLIC_LEGAL_NAME || "[À compléter]",
  legalForm: process.env.NEXT_PUBLIC_LEGAL_FORM || "[À compléter]",
  capital: process.env.NEXT_PUBLIC_LEGAL_CAPITAL || "",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "[À compléter]",
  siret: process.env.NEXT_PUBLIC_LEGAL_SIRET || "[À compléter]",
  rcs: process.env.NEXT_PUBLIC_LEGAL_RCS || "",
  vat: process.env.NEXT_PUBLIC_LEGAL_VAT || "",
  director: process.env.NEXT_PUBLIC_LEGAL_DIRECTOR || "[À compléter]",
  hostName: process.env.NEXT_PUBLIC_HOST_NAME || "[À compléter]",
  hostAddress: process.env.NEXT_PUBLIC_HOST_ADDRESS || "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@genial-business.com",
} as const;

export const LEGAL_UPDATED = "2026-09-06";
