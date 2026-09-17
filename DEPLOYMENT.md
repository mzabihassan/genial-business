# Déploiement Cloudflare Pages (offre gratuite)

La cible de production est un export statique Next.js servi par Cloudflare
Pages. Seul `POST /api/devis` exécute du code, dans
`functions/api/devis.ts`. Cette Function appelle directement l’API HTTP
transactionnelle de Brevo ; elle n’utilise ni SMTP, ni Nodemailer, ni serveur
Next.js SSR, ni Cloudflare Container.

Le succès est retourné dès que Brevo accepte la notification destinée à l’équipe.
L’accusé de réception destiné au visiteur est ensuite conservé en arrière-plan
avec `context.waitUntil()`, sans retarder la réponse HTTP. Cet appel secondaire
expire après 20 secondes et ses erreurs sont journalisées sans invalider la
demande déjà transmise. Il n’est jamais lancé si la notification principale échoue.
Les pièces jointes restent transmises en binaire par le navigateur, sans altération.

Cloudflare documente cette architecture pour les exports statiques Next.js :
[guide Next.js statique](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
et [Pages Functions](https://developers.cloudflare.com/pages/functions/).

## Variables et secrets

La Function lit ces valeurs uniquement côté Cloudflare :

- `BREVO_API_KEY` : obligatoire, à enregistrer comme secret chiffré ;
- `QUOTE_TO_EMAIL` : adresse qui reçoit les demandes ;
- `QUOTE_FROM_EMAIL` : expéditeur Brevo vérifié, au format
  `Nom <adresse@example.com>` ou `adresse@example.com`.

Le dépôt ne doit contenir aucune vraie clé. Pour l’aperçu local, copiez
`.dev.vars.example` vers `.dev.vars` et remplissez-le localement. Le fichier
`.dev.vars` est ignoré par Git. Les tests n’en ont pas besoin et ne contactent
jamais Brevo.

## Préparer Brevo

1. Créez un compte Brevo gratuit.
2. Dans **SMTP & API > Clés API**, créez une clé API v3 dédiée au site.
3. Dans **Expéditeurs, domaines et IP dédiées**, vérifiez l’adresse ou le
   domaine utilisé par `QUOTE_FROM_EMAIL`.
4. Ne copiez jamais la clé dans un fichier suivi par Git ou dans une commande
   visible dans l’historique du shell.

Brevo accepte les pièces jointes API en base64. Sa limite documentée est de
20 MB pour l’email complet, contenu compris, et sa liste d’extensions exclut
`.md` et `.webp`. Le formulaire limite donc les fichiers bruts à 10 Mo chacun,
14 Mo au total et cinq fichiers, afin de laisser de la place à l’expansion
base64 et au corps du message.

Références : [API d’envoi Brevo](https://developers.brevo.com/reference/send-transac-email)
et [limites des pièces jointes](https://help.brevo.com/hc/fr/articles/4402811730962-Ajouter-une-pi%C3%A8ce-jointe-%C3%A0-un-email-transactionnel).

## Vérifier localement

```bash
npm ci
npm run lint
npm run test:quote
npm run build
```

L’export se trouve dans `out/`. Pour lancer Pages et la Function localement :

```bash
cp .dev.vars.example .dev.vars
npm run preview:cloudflare
```

L’aperçu écoute par défaut sur `http://localhost:8788`. Sans vraie clé Brevo,
les pages statiques restent testables et `POST /api/devis` renvoie une erreur
502 claire après validation ; utilisez `npm run test:quote` pour vérifier les
scénarios de livraison avec le transport HTTP simulé.

## Créer et configurer le projet Pages

Authentifiez Wrangler, puis créez le projet Direct Upload une seule fois :

```bash
npx wrangler login
npx wrangler pages project create genial-business --production-branch main
```

Saisissez les valeurs uniquement dans les invites interactives suivantes :

```bash
npx wrangler pages secret put BREVO_API_KEY --project-name genial-business
npx wrangler pages secret put QUOTE_TO_EMAIL --project-name genial-business
npx wrangler pages secret put QUOTE_FROM_EMAIL --project-name genial-business
```

`QUOTE_TO_EMAIL` et `QUOTE_FROM_EMAIL` peuvent aussi être des variables texte
dans **Workers & Pages > genial-business > Settings > Variables and Secrets**.
`BREVO_API_KEY` doit rester chiffrée. Configurez les valeurs avant le premier
déploiement fonctionnel.

## Déployer

```bash
npm run deploy:cloudflare
```

Wrangler charge le dossier racine `functions/` avec l’export `out/`. Le fichier
`public/_routes.json`, copié dans l’export, limite les invocations à
`/api/devis`; tous les autres chemins restent des requêtes statiques gratuites.
Le premier déploiement reçoit une URL `https://genial-business.pages.dev`.

Un projet Direct Upload ne peut pas être converti ensuite en projet Pages relié
à Git ; il faut créer un nouveau projet si un déploiement Git automatique est
souhaité. Un domaine personnalisé peut être connecté uniquement si vous le
possédez déjà : l’enregistrement du domaine n’est pas gratuit.

## Limites gratuites à connaître

- Pages statique : requêtes gratuites et illimitées, 20 000 fichiers par site,
  25 MiB maximum par fichier et 500 builds par mois.
- Pages Functions / Workers Free : 100 000 requêtes par jour, 10 ms de CPU et
  128 MB de mémoire par invocation. Les appels HTTP sortants attendus ne sont
  pas du temps CPU.
- Les requêtes HTTP entrantes du plan Cloudflare Free sont limitées à 100 MB.
- Brevo limite l’email transactionnel complet à 20 MB. Son offre gratuite
  autorise 300 emails par jour et ajoute la mention « Sent with Brevo » ; une
  demande complète consomme normalement deux envois (notification et accusé),
  soit au plus environ 150 demandes par jour si aucun autre email n’est envoyé.
- Le compteur anti-abus en mémoire est local à un isolate Cloudflare. Il réduit
  les boucles simples mais ne constitue pas une limitation globale. KV ou un
  Durable Object ajouterait de l’infrastructure non nécessaire à ce site.

Références Cloudflare : [limites Pages](https://developers.cloudflare.com/pages/platform/limits/),
[tarification Functions](https://developers.cloudflare.com/pages/functions/pricing/)
et [limites Workers](https://developers.cloudflare.com/workers/platform/limits/).

## Docker

Le `Dockerfile` existant reste isolé du déploiement Pages : il demande
explicitement `NEXT_OUTPUT=standalone`, tandis que le build normal exporte le
site. Il peut encore servir le frontend avec `npm run docker:build`, mais il ne
contient plus le endpoint de devis ; la cible complète et supportée est Pages.
Le fichier `.dockerignore` exclut les fichiers d’environnement, sorties de
build locales et identifiants.
