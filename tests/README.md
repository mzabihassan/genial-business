# Parcours d’envoi de devis

`npm run test:quote-ui` démarre le site localement et vérifie le parcours dans
Chrome (qui doit être installé). Pour tester un build déjà servi, définir
`PLAYWRIGHT_BASE_URL`, par exemple `http://localhost:3018` avec
`npx wrangler pages dev out --port 3018`.

Tous les appels `/api/devis` sont interceptés : ces tests n’envoient aucun email.
Ils couvrent la double soumission, le clavier, le retour navigateur, les réponses
rapides, les erreurs serveur/réseau, la reprise avec pièces jointes, les réponses
invalides, l’attente longue, le mobile et la réduction des mouvements. Les
captures sont écrites dans `artifacts/quote-submission/`.

L’avancement visuel est estimé et reste sous 100 % tant que le serveur n’a pas
répondu `{ ok: true }`. Aucun délai décoratif ne retarde l’appel ou sa confirmation.
La requête expire après 60 secondes ; les réponses et fichiers restent en mémoire
pour réessayer. L’interface ne prétend pas analyser automatiquement le projet.

Le dialogue natif rend le reste de la page inerte. Un verrou synchrone empêche
les requêtes concurrentes et une entrée temporaire protège le retour navigateur.
`beforeunload` demande confirmation avant une fermeture ou un rechargement lorsque
le navigateur le permet : un site ne peut pas empêcher une fermeture forcée, et
les données ne survivent pas à la fermeture effective de l’onglet.
