# Genial Business

Site du studio — `genial-business.com`.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Cloudflare Pages.

---

## Démarrer

```bash
npm install
npm run dev
```

`npm run dev` sert le frontend Next.js. `npm run build` produit l’export
statique dans `out/`, puis `npm start` ou `npm run preview:cloudflare` sert
l’export et la Pages Function ensemble.

Les cibles Docker et Cloudflare Pages sont détaillées dans [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Avant la mise en ligne — obligatoire

Trois choses doivent être renseignées sur le projet Cloudflare Pages :

1. **`BREVO_API_KEY`** — secret de l’API transactionnelle Brevo. Sans lui, le
   formulaire échoue explicitement (jamais de faux succès). Les tests utilisent
   un `fetch` simulé et n’envoient aucun message.
2. **`QUOTE_TO_EMAIL`** — l'adresse qui reçoit les demandes, à configurer pour votre équipe.
3. **`QUOTE_FROM_EMAIL`** — l’expéditeur vérifié dans Brevo.

`QUOTE_FROM_EMAIL` doit appartenir à un domaine dont vous contrôlez SPF/DKIM,
sinon les notifications partiront en spam.

---

## Architecture

```
src/
  app/                  Pages statiques (App Router)
  components/
    site/               Header, Footer, CTA, FAQ, icônes, cadres projet
    home/               Sections de la page d'accueil
    quote/              Formulaire de devis en 6 étapes
  content/              Tout le texte éditorial (capabilities, strata,
                        process, faq, ownership, projects)
  lib/                  quote (schéma partagé), mail, site, utils
src/assets/            Captures des produits et illustration originale (WebP)
scripts/               Vérification du parcours de devis sans envoi d’email
functions/api/devis.ts Fonction Pages pour POST /api/devis
```

**Le contenu vit dans `src/content/`.** Modifier un service, une question de FAQ
ou une réalisation ne demande pas de toucher aux composants.

---

## Le formulaire de devis

`src/lib/quote.ts` est la source unique du vocabulaire : le client et la Function
valident contre les mêmes listes, donc l'email ne peut pas contenir une valeur
que le formulaire ne produit pas.

Protections en place :

- honeypot invisible + délai minimum de remplissage ;
- limitation à 5 envois / 15 min par IP et par isolate (en mémoire, donc non globale) ;
- pièces jointes contrôlées (extension **et** type MIME, 10 Mo par fichier,
  14 Mo au total avant encodage, 5 fichiers) ;
- tout contenu utilisateur est échappé avant d'entrer dans l'email HTML ;
- `Reply-To` pointe sur le demandeur, pour répondre directement.

Un accusé de réception est envoyé au demandeur en « best-effort » : son échec
n'invalide jamais la demande déjà transmise.

---

## Design

Identité : **ivoire, charbon et cuivre**. Fond `#f7f5f0`, texte `#272622`,
accent `#bb4d2d`. Archivo (titres), Georgia (accents éditoriaux),
Instrument Sans (texte), IBM Plex Mono / Consolas (labels).

L’illustration originale `src/assets/product-sculpture.webp` représente une idée
qui devient un produit complet. Elle est générée par ImageGen, optimisée à
51 Ko et servie par Next Image. Les captures ISIIL et Profaly restent celles
des produits réels. Le modèle de réservation est explicitement un exemple.

La page d’accueil condense les services et le processus ; les pages dédiées
conservent les détails. Le devis propose six étapes, des raccourcis pour les
étapes facultatives et un récapitulatif avant envoi.

Les tokens sont dans `@theme` (`src/app/globals.css`). `.shell` définit les
largeurs ; `.studio-section` le rythme des nouvelles sections ; `.band` reste
utilisé sur les pages détaillées.

### Animation

Les révélations au scroll sont une **amélioration progressive** : le HTML est
visible par défaut, et l'état masqué n'est appliqué que si un script d'amorçage
confirme JS + `IntersectionObserver` + absence de `prefers-reduced-motion`. Un
garde-fou retire cet état si l'hydratation n'a pas pris la main en 3 s. Sans JS,
en `reduced-motion`, ou pour un crawler, la page est intégralement lisible.

---

## Réalisations

Les deux projets sont dans `src/content/projects.ts`. Chaque cadre cliquable
ouvre le site réel. Les captures ont été prises sur les produits en ligne et
optimisées en webp.

Pour rafraîchir une capture :

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=1440,900 --virtual-time-budget=15000 \
  --screenshot=shot.png https://exemple.com
```

puis redimensionner à 1600px de large en webp.

**Aucune donnée n'est inventée sur ce site** : pas de témoignage, pas de logo
client, pas de chiffre, pas de récompense. Les réalisations décrivent uniquement
ce que les produits font réellement.

---

## Déploiement

Le site est entièrement statique sur Cloudflare Pages sauf `/api/devis`, traité
par une petite Pages Function qui appelle l’API HTTP de Brevo. Aucune base de
données, aucun stockage persistant et aucun conteneur Cloudflare ne sont requis.

## Vérification

```bash
npm run lint
npm run test:quote
npm run build
```

`test:quote` requiert Node.js 20.11+ et utilise TypeScript déjà installé pour
charger la validation, la Function et le générateur d’email. Brevo est simulé :
aucun message n’est envoyé. Les fichiers temporaires sont nettoyés après le test.

Les captures et observations de la refonte se trouvent dans
`artifacts/design/review-notes.md`.
