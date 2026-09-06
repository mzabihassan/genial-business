export const site = {
  name: "Genial Business",
  domain: "genial-business.com",
  url: "https://genial-business.com",
  tagline: "Vous avez l’idée. Nous construisons le produit.",
  description:
    "Genial Business est un studio de développement logiciel. Nous concevons et construisons des produits digitaux complets, de l’idée jusqu’à la mise en ligne.",
  email: "contact@genial-business.com",
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/methode", label: "Notre méthode" },
  { href: "/#faq", label: "FAQ" },
] as const;
