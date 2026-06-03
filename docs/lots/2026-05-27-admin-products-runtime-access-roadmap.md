# Lot 8 — Admin products runtime access

## Objectif

Brancher le resolver de modules produit admin sur les signaux runtime réels déjà présents dans le repo : session admin, capabilities issues des rôles, store courant et feature flags effectifs.

---

## Périmètre

Inclus dans ce lot :

- définir une policy locale de feature flags/capabilities produit admin
- lire les flags produit effectifs au niveau store/utilisateur
- brancher le layout produit sur `requireAuthenticatedAdmin` et `getAdminNavigationContext`
- faire évoluer le resolver de modules produit pour consommer ce contexte runtime

---

## Hors périmètre

Explicitement exclus :

- refonte du shell admin protégé global
- création ou seed automatique de nouveaux permissions/flags
- enforcement page par page des routes modules
- refonte de `seo`, `categories`, `related`
- modification métier

---

## Invariants

- aucune modification Prisma
- aucune modification des actions ou formulaires métier
- les routes produit restent inchangées
- si un feature flag produit n'existe pas encore, la visibilité reste stable via fallback explicite

---

## Plan d'exécution

1. définir une policy locale de modules produit admin
2. ajouter une lecture runtime des feature flags effectifs par store/utilisateur
3. brancher le layout produit sur la session admin et le contexte de navigation
4. faire évoluer le resolver pour consommer capabilities + flags + overrides
5. vérifier typecheck et lint

---

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

---

## Critères de fin

- les modules produit admin ne reposent plus uniquement sur un resolver permissif
- le layout produit consomme un vrai contexte admin runtime
- la policy produit est localisée et prête pour des flags/permissions explicites
- aucun changement métier

---

## Notes de livraison

- policy locale ajoutée dans `features/admin/products/capabilities/product-module-policy.ts`
- lecture runtime des switches effectifs ajoutée dans `features/admin/products/capabilities/read-admin-product-module-feature-flags.ts`
- la lecture runtime prend en compte :
  - session admin courante
  - store du produit
  - feature flag global ou store
  - overrides `USER` puis `STORE`
- le layout produit `[slug]/layout.tsx` consomme maintenant :
  - `requireAuthenticatedAdmin`
  - `getAdminNavigationContext`
  - `readAdminProductModuleFeatureFlags`
- `product-module-capabilities` consomme désormais :
  - `navigationContext.capabilities`
  - `navigationContext.isInternalUser`
  - `moduleFeatureFlags`
  - `moduleAccessOverrides`
- `seo` est le premier module branché sur une capability repo existante : `admin.content.seo.read`
- les autres modules utilisent déjà les switches runtime s'ils existent, avec fallback explicite stable si aucun flag produit n'est encore seedé
- aucun enforcement route-level ajouté dans ce lot : la surface concernée reste navigation + resolver runtime
- vérifications passées :
  - `pnpm run typecheck`
  - `pnpm run lint`
