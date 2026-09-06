# Genial Business

Site du studio — `genial-business.com`.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Nodemailer.

---

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis remplir
npm run dev
```

`npm run build` pour la production, `npm start` pour servir le build.

---

## Avant la mise en ligne — obligatoire

Trois choses ne peuvent pas être devinées et doivent être renseignées :

1. **SMTP** — sans `SMTP_HOST`, le formulaire de devis échoue explicitement en
   production (jamais de faux succès). En développement, la demande est
   simplement affichée dans la console.
2. **Identité légale** — les variables `NEXT_PUBLIC_LEGAL_*` alimentent
   `/mentions-legales`. Tout champ non rempli s'affiche `[À compléter]`.
3. **`QUOTE_TO_EMAIL`** — l'adresse qui reçoit les demandes. Actuellement
   `elmzabi.hassan18@gmail.com`.

`QUOTE_FROM_EMAIL` doit appartenir à un domaine dont vous contrôlez SPF/DKIM,
sinon les notifications partiront en spam.

---

## Architecture

```
src/
  app/                  Pages (App Router) + /api/devis
  components/
    site/               Header, Footer, CTA, FAQ, icônes, cadres projet
    home/               Sections de la page d'accueil
    quote/              Formulaire de devis en 6 étapes
  content/              Tout le texte éditorial (capabilities, strata,
                        process, faq, ownership, projects)
  lib/                  quote (schéma partagé), mail, site, legal, utils
public/realisations/    Captures des produits (webp, 1600px)
```

**Le contenu vit dans `src/content/`.** Modifier un service, une question de FAQ
ou une réalisation ne demande pas de toucher aux composants.

---

## Le formulaire de devis

`src/lib/quote.ts` est la source unique du vocabulaire : le client et l'API
valident contre les mêmes listes, donc l'email ne peut pas contenir une valeur
que le formulaire ne produit pas.

Protections en place :

- honeypot invisible + délai minimum de remplissage ;
- limitation à 5 envois / 15 min par IP (en mémoire) ;
- pièces jointes contrôlées (extension **et** type MIME, 10 Mo par fichier,
  20 Mo au total, 5 fichiers) ;
- tout contenu utilisateur est échappé avant d'entrer dans l'email HTML ;
- `Reply-To` pointe sur le demandeur, pour répondre directement.

Un accusé de réception est envoyé au demandeur en « best-effort » : son échec
n'invalide jamais la demande déjà transmise.

---

## Design

Vocabulaire visuel : le **plan technique**. Papier calque `#f3f3f0`, encre
cyanotype `#0e3a4f`, un seul accent — l'ambre d'annotation `#e9a23b`.
Archivo (display) / Instrument Sans (texte) / IBM Plex Mono → Consolas (labels).

Les tokens sont dans `@theme` (`src/app/globals.css`). Le rythme des sections
passe par `.band` / `.shell` : une seule source de vérité, pour qu'aucune règle
d'espacement n'en écrase une autre.

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

Le site est entièrement statique sauf `/api/devis` (Node runtime). Il tourne
partout où Node est disponible : VPS, Docker, Railway, Render, Fly, Vercel.
Aucune base de données, aucun stockage persistant requis.
