# Lot 7 — Effet de bord storefront du scan panier abandonné : cadrage

Suite du lot 3 (`c4155483`, relance panier abandonné via `engagement.automations`). Déclenché par un audit storefront post-lot 6 (2026-07-06).

**Livré (2026-07-06)** : lien de reprise explicite dans l'email `cart-abandoned-reminder` (correction du 3e point ci-dessous : le worker de traitement du job existait déjà — `run-automation-jobs`/`executeAutomationJob` —, contrairement à ce que l'audit initial affirmait ; seule l'URL du CTA manquait). Nouvelle route `GET /api/cart/restore?token=<base64url(cartId)>` (`app/api/cart/restore/route.ts`, pattern repris de `app/api/newsletter/unsubscribe`) qui réactive le panier (`reactivateAbandonedCart`, `features/commerce/cart/lib/guest-cart.repository.ts`) et pose le cookie de session avant de rediriger vers `/panier?status=restored`. Option retenue : lien de reprise explicite (ni réactivation transparente au simple retour storefront, ni report). Vérifié : template email génère bien l'URL de reprise, round-trip d'encodage du token confirmé, 443 tests unitaires + typecheck + lint verts. Vérifié en conditions réelles contre le serveur de dev (`http://localhost:3000`, script `tsx` jetable, panier réel créé/nettoyé en base) : lien valide sur panier `ABANDONED` → redirection `/panier?status=restored` + cookie posé + `status` passé à `ACTIVE` en base ; second appel sur le même lien (panier déjà `ACTIVE`) → redirection `/panier` sans cookie ; token invalide → redirection `/panier` sans erreur exposée. Non vérifié : réception et clic du lien depuis un email réel (Mailpit non démarré dans cette session).

## Observé (2026-07-06)

Le scan cron (`queueCartAbandonedAutomationJobs`, `features/automations/services/queue-cart-abandoned-automation-jobs.service.ts:126-129`) transitionne un `Cart` `ACTIVE` inactif depuis 24h vers `status: "ABANDONED"`. Or le storefront filtre partout sur `status: "ACTIVE"` :

- `readGuestCartById`/`readGuestCartByToken` (`features/commerce/cart/lib/guest-cart.repository.ts:345-346`) retournent `null` pour un panier `ABANDONED` → `/panier` (`app/(public)/panier/page.tsx:60-67`) affiche un panier vide, sans message explicatif.
- `readGuestCheckoutContextByToken` (même filtre) → `/checkout` (`app/(public)/checkout/page.tsx:108-116`) a le même effet.
- Le plus grave : `findGuestCartIdByToken` (`guest-cart.repository.ts:143-145`) retourne `null` pour un panier non-`ACTIVE`. Dans `add-to-cart-action.ts:75-80`, ce `null` déclenche silencieusement `createGuestCart()` et écrase le cookie de session. Le client qui ajoute un article après le scan récupère un **panier neuf** ; l'ancien panier (avec ses lignes) devient orphelin en base, inaccessible depuis le storefront.

Le filtre `status: "ACTIVE"` est antérieur à ce lot (l'enum `CartStatus` porte `ABANDONED` depuis la migration initiale). Ce n'est donc pas une régression introduite par le lot 3 : c'est un chemin de code resté dormant, que le scan cron rend désormais réellement atteignable dès qu'il y a du trafic.

**Aggravant** : aucun worker ne consomme le job `AUTOMATION_CART_ABANDONED_JOB_TYPE` mis en file par le scan (confirmé par recherche : seuls `features/automations/shared/automation-job.constants.ts` et `queue-cart-abandoned-automation-jobs.service.ts` référencent ce type de job). L'email de relance n'existe donc pas encore en pratique — même s'il existait, il ne contournerait pas le problème sans un lien de récupération dédié basé sur `cartId` plutôt que sur le cookie de session.

## Ce qu'il faut trancher

1. **Réactivation du panier au retour client** : quand un client revient sur un panier `ABANDONED` (même cookie de session), faut-il le repasser en `ACTIVE` silencieusement (dans `findGuestCartIdByToken`/`readGuestCartById`), pour que le parcours storefront reste transparent — au prix de fausser la mesure “paniers abandonnés” si le client revient de lui-même sans avoir cliqué sur un email de relance ?
2. **Ordre d'implémentation** : construire le worker de traitement du job (email de relance avec lien de récupération) est un prérequis fonctionnel plus large que ce cadrage — indépendant du bug ci-dessus. Le bug storefront existe même sans worker, dès qu'un client revient de lui-même.

## Options

- **Option A — Réactivation transparente** : dans les fonctions de lecture guest (`findGuestCartIdByToken`, `readGuestCartById`, `readGuestCheckoutContextByToken`), élargir le filtre pour accepter aussi `ABANDONED` et transitionner vers `ACTIVE` à la lecture. Simple, restaure la continuité du parcours. Risque : dilue la mesure "paniers réellement abandonnés" côté reporting (`AnalyticsSnapshot`/admin), puisqu'un retour spontané ne serait plus distinguable d'un retour via email de relance.
- **Option B — Message explicite, pas de réactivation automatique** : le storefront détecte le panier `ABANDONED` et affiche un message ("votre panier a expiré, voulez-vous le restaurer ?") avant de le réactiver sur action explicite du client. Plus de friction UX, mais mesure de conversion propre et pas de réactivation silencieuse.
- **Option C — Ne rien faire côté storefront, construire le worker + lien de récupération en premier** : traiter le bug comme secondaire tant que l'automation de relance (avec son propre lien de reprise dédié) n'est pas implémentée — cette dernière pourrait absorber le cas d'usage principal (le client revient via l'email, pas en navigant seul).

## Hors périmètre de ce document

Toute implémentation. Décision requise avant tout code : quelle option retenir, et si le worker de traitement du job de relance doit être cadré/livré avant ou après ce correctif.
