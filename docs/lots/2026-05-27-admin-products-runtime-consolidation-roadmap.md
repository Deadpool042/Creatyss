# Lot 7 — Admin products runtime consolidation

## Objectif

Réduire le chargement runtime des pages module produit admin en introduisant un contexte produit léger réutilisable, puis préparer le resolver de capabilities produit à de vrais signaux runtime sans modifier le métier existant.

---

## Périmètre

Inclus dans ce lot :

- création d'une query légère de contexte produit par slug
- adoption de cette query par le layout produit et les pages modules qui n'ont pas besoin du modèle éditeur complet
- réduction du recours à `readAdminProductEditorBySlug` sur `pricing`, `availability`, `inventory`, `media`, `variants`
- durcissement du resolver `product-module-capabilities` pour accepter des signaux runtime optionnels

---

## Hors périmètre

Explicitement exclus :

- refonte des actions serveur
- refonte des tabs client
- wiring auth complet du produit sur permissions utilisateur
- création d'un moteur runtime de feature flags produit
- refonte Prisma
- refonte des pages `seo`, `categories`, `related` si elles dépendent encore du modèle éditeur complet
- browser verification

---

## Invariants

- aucune modification métier
- aucune modification Prisma
- aucune modification de contrat public des actions existantes
- les routes produit existantes restent inchangées
- `seo`, `categories`, `related` peuvent rester provisoirement sur le modèle éditeur complet si le gain n'est pas net

---

## Plan d'exécution

1. créer une query `readAdminProductPageContextBySlug`
2. brancher cette query dans le layout produit
3. rebrancher `pricing`, `availability`, `inventory`, `media`, `variants`
4. conserver `seo`, `categories`, `related` sur le modèle complet tant que leurs props le demandent
5. faire évoluer le resolver de capabilities pour accepter des signaux runtime optionnels sans inventer de nouvelles règles métier
6. vérifier typecheck et lint

---

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

---

## Critères de fin

- une query de contexte léger existe
- le layout produit n'interroge plus directement Prisma pour son contexte
- les pages modules ciblées n'utilisent plus `readAdminProductEditorBySlug`
- le resolver produit est prêt à recevoir des flags/capabilities optionnels
- aucun changement métier

---

## Notes de livraison

- query légère ajoutée dans `features/admin/products/editor/queries/product-editor-read-queries.ts` :
  - `readAdminProductPageContextBySlug`
  - `AdminProductPageContext`
- le layout produit `[slug]/layout.tsx` consomme maintenant cette query au lieu d'interroger Prisma directement
- `pricing`, `availability`, `inventory`, `media`, `variants` ne passent plus par `readAdminProductEditorBySlug`
- `availability` et `inventory` relisent seulement le bloc variantes via `readAdminProductVariants`
- `media` relit seulement :
  - le contexte léger produit
  - `readAdminProductImages`
  - `listAttachableMediaAssets`
- `variants` relit seulement :
  - le contexte léger produit
  - `readAdminProductVariants`
  - `readAdminProductImages`
  - `readAdminProductTypeWithOptions`
- `seo`, `categories`, `related` restent volontairement sur le modèle éditeur complet dans ce lot car leurs composants attendent encore `AdminProductEditorData`
- `product-module-capabilities` expose maintenant une base explicite et accepte des overrides runtime optionnels sans inventer de faux feature flags repo
- vérifications passées :
  - `pnpm run typecheck`
  - `pnpm run lint`
