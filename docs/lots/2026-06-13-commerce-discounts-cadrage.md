<!-- docs/lots/2026-06-13-commerce-discounts-cadrage.md -->

# Cadrage — `commerce.discounts` L1 → L?

> Suite de `docs/roadmap/2026-06-13-audit-catalogue-modules.md`, section 6,
> point 5 : « Modules L1 → L3 : `commerce.discounts`, `engagement.newsletter`,
> `engagement.automations` (vérifier/poser le schéma Prisma manquant en
> premier). » Module choisi en priorité (utilisateur, 2026-06-13).

## État actuel (audit)

### Feature catalog et niveaux

`features/admin/pilotage/catalog/feature-catalog.ts` :

```ts
export const FEATURE_LEVELS = {
  discounts: ["simple", "rules", "automation"],
  ...
};
```

```ts
{
  key: "commerce.discounts",
  label: "Remises",
  description: "Gestion des codes promo, règles de remise et promotions.",
  family: "satellite",
  module: "commerce",
  defaultState: "inactive",
  mutability: "level_selectable",
  scopes: ["store"],
  levels: FEATURE_LEVELS.discounts,
}
```

Aucun `FeatureFlag` `commerce.discounts` n'est seedé
(`prisma/seed/feature-flags-catalog.seed.ts` ne couvre que
`catalog.products.*` + le seed dédié `engagement.analytics` ajouté lors du
lot précédent). → `queryFeatureFlagActive("commerce.discounts")` retourne
`false` (aucune ligne). Même situation que `engagement.analytics` avant son
seed.

### Modèle Prisma — déjà entièrement posé

`prisma/optional/commerce/discounts.prisma` (header : `Feature:
commerce.discounts`, `Category: optional`, `Level: L2`, `DependsOn:
foundation.store, catalog.products, catalog.pricing, commerce.orders`) :

- `Discount` : `code`, `name`, `description?`, `status` (DRAFT/ACTIVE/
  INACTIVE/ARCHIVED), `type` (PERCENTAGE/FIXED_AMOUNT/FREE_SHIPPING),
  `scopeType` (ORDER/PRODUCT/PRODUCT_VARIANT/CATEGORY, défaut ORDER),
  `percentageValue?`/`fixedAmountValue?`/`currencyCode?`, `startsAt?`/
  `endsAt?`, `isAutomatic` (défaut false), `priority` (défaut 0),
  `maxRedemptions?`/`maxRedemptionsPerCode?`/`maxRedemptionsPerUser?`,
  `@@unique([storeId, code])`.
- `DiscountCode` : codes secondaires liés à un `Discount`, `status`
  (ACTIVE/INACTIVE/EXPIRED/ARCHIVED), `redeemedCount`, `maxRedemptions?`,
  `@@unique([discountId, code])`.
- `DiscountRedemption` : historique d'application (discount, code?, order?,
  customer?, `amountApplied?`, `redeemedAt`).
- `DiscountProductTarget` / `DiscountVariantTarget` /
  `DiscountCategoryTarget` : tables de jointure pour le ciblage par scope.

Le modèle couvre déjà les 3 niveaux déclarés (`simple` → codes promo basiques
ORDER/PERCENTAGE ou FIXED_AMOUNT ; `rules` → ciblage produit/variante/
catégorie, fenêtres temporelles, plafonds de rédemption ; `automation` →
`isAutomatic`, `priority`, cumul/règles entre remises).

### Code applicatif — rien d'implémenté

- `grep -rn "Discount" features/ app/` (hors types SDK Stripe) : **aucune
  occurrence**. Aucune query, action, composant.
- Page admin `app/admin/(protected)/marketing/discounts/page.tsx` :
  `AdminComingSoon`, gating `isDiscountsFeatureActive()` →
  `queryFeatureFlagActive("commerce.discounts")` → `notFound()` (flag non
  seedé).
- `features/commerce/orders/lib/order.repository.ts` (~ligne 313), création
  de commande depuis le checkout :

  ```ts
  subtotalAmount: subtotalCents / 100,
  shippingAmount: shippingCents / 100,
  discountAmount: 0,
  taxAmount: 0,
  totalAmount: totalCents / 100,
  ```

  `discountAmount` est codé en dur à `0`. `totalCents = subtotalCents +
  shippingCents`. Aucune logique de remise dans le panier/checkout.

### `marketing.discountsRead` — pas un écart, deux couches distinctes

`adminNavigationCapabilities.marketing.discountsRead =
"admin.marketing.discounts.read"` (`features/admin/navigation/utils/
admin-navigation-policy.ts`) est une **capability de navigation admin**
(contrôle de rôle/permission pour l'affichage du lien sidebar), distincte du
`FEATURE_CATALOG` (pilotage `/admin/settings/advanced`). L'entrée nav
`discounts` (`admin-navigation.data.ts`) combine déjà
`featureFlagsAll: [commerce.discounts]` (flag pilotage) +
`capabilitiesAll: [marketing.discountsRead]` (rôle admin) — cohérent avec le
pattern des autres modules marketing (`newsletter`, `automations`). Pas de
correction nécessaire.

### Doctrine — impact élevé si le module touche le panier/la commande

`docs/domains/satellites/discounts.md` :

- Invariants clés : « une remise inactive ou expirée ne doit pas être
  appliquée comme active sans règle explicite » ; « deux remises
  incompatibles ne doivent pas être cumulées silencieusement » ;
  « l'application d'une remise doit être explicable » ; « une remise ne doit
  pas produire un résultat monétaire incohérent ».
- Impact d'exploitation : « élevé lorsqu'il est activé... il modifie
  directement les montants affichés et commandés ».
- Limites du domaine : s'arrête avant le prix catalogue de base, la
  fiscalité, la commande comme agrégat complet, le paiement, la fidélité, la
  disponibilité/stock.

→ Tout sous-lot qui ferait passer `discountAmount` de `0` à une valeur
calculée touche `commerce.orders` (déjà `core`/actif) et le flux
panier/checkout — c'est le point le plus sensible du chantier.

## Décisions à trancher

### A — Périmètre de ce premier lot

1. **Admin CRUD uniquement, niveau `simple`** (Recommandé) : créer/lister/
   activer-désactiver des `Discount` (type PERCENTAGE/FIXED_AMOUNT, scope
   ORDER, codes simples) depuis l'admin. **Aucune application en
   panier/checkout** — `discountAmount` reste `0`, `Discount` reste un
   référentiel non consommé. La page `/admin/marketing/discounts` remplace
   `AdminComingSoon` par une vraie liste + formulaire de création.
   - Avantage : petit lot, ne touche pas `commerce.orders`/checkout (zone à
     impact élevé selon la doctrine), conforme au principe « plus petit
     changement sûr ». Pose la base de données réelles pour les niveaux
     `rules`/`automation` ultérieurs.
   - Limite explicite : un code promo créé n'a **aucun effet visible** côté
     boutique tant que le niveau `rules` (application checkout) n'est pas
     traité — à documenter clairement dans l'UI admin et la doctrine.
2. **Admin CRUD + application au checkout (niveau `rules`)** : en plus de A1,
   le panier/checkout résout un code promo saisi, calcule `discountAmount`
   (PERCENTAGE/FIXED_AMOUNT sur le sous-total, scope ORDER uniquement) et
   l'order le persiste réellement. Lot plus large, touche
   `order.repository.ts`, le flux panier/checkout storefront, et engage les
   invariants « explicabilité » / « pas de cumul silencieux » dès ce lot.
3. **Aucun pour l'instant** — signaler que le module reste en l'état (L1),
   sans ouvrir ce chantier maintenant.

### B — Si A1 : quels types/scopes couvrir au niveau `simple`

1. **PERCENTAGE + FIXED_AMOUNT, scope ORDER uniquement** (Recommandé) — le
   strict nécessaire pour un « code promo » basique, aligné avec les valeurs
   par défaut du schéma (`scopeType @default(ORDER)`). `FREE_SHIPPING` et les
   scopes PRODUCT/VARIANT/CATEGORY (et donc les tables `*Target`) restent
   pour le niveau `rules`.
2. Couvrir aussi `FREE_SHIPPING` dès `simple`.

### C — Gating et activation

1. **Seeder `commerce.discounts`** (`allowedLevels:
   ["simple","rules","automation"]`, `defaultLevel: "simple"`, `status:
   "DRAFT"`, `isEnabledByDefault: false`, même schéma que
   `engagement.analytics`) ; gater la nouvelle UI admin sur
   `meetsFeatureLevel("commerce.discounts","simple")`. (Recommandé)
2. Pas de gating par niveau, uniquement `queryFeatureFlagActive`.

## Sous-lots proposés (si A1 + B1 + C1)

1. **Sous-lot 0** — Seed `commerce.discounts` (`allowedLevels`/
   `defaultLevel`/`isEnabledByDefault: false`, seed dédié
   `prisma/seed/discounts-feature-flag.seed.ts`, câblé dans `prisma/seed.ts`).
   Vérif `tsc --noEmit` + vérif manuelle : module inactif par défaut.
2. **Sous-lot 1** — Queries/actions admin `commerce.discounts` : lister les
   `Discount` du store, créer un `Discount` (PERCENTAGE/FIXED_AMOUNT, scope
   ORDER, code unique par store), activer/désactiver (`status`). Vérif
   `tsc --noEmit`.
3. **Sous-lot 2** — Câblage `app/admin/(protected)/marketing/discounts/page.tsx` :
   remplace `AdminComingSoon` par liste + formulaire de création, gated
   `meetsFeatureLevel("commerce.discounts","simple")`, avec mention explicite
   que le code n'a pas encore d'effet côté boutique (niveau `rules` à venir).
   Vérif `tsc --noEmit`.
4. **Sous-lot 3** — Vérifications + mise à jour `docs/domains/satellites/
   discounts.md` (section décisions d'implémentation),
   `docs/roadmap/2026-06-13-audit-catalogue-modules.md` (entrée
   `commerce.discounts`), bilan d'exécution dans ce cadrage.

## Décision tranchée (2026-06-13)

- **A → A1** : admin CRUD seul, niveau `simple`. Aucune application en
  panier/checkout dans ce lot.
- **B → B1** : PERCENTAGE + FIXED_AMOUNT, scope ORDER uniquement.
- **C → C1** : seed `commerce.discounts` (`allowedLevels:
  ["simple","rules","automation"]`, `defaultLevel: "simple"`, `status:
  "DRAFT"`, `isEnabledByDefault: false`), gating
  `meetsFeatureLevel("commerce.discounts","simple")`.

→ Les 4 sous-lots de la section précédente sont retenus, à exécuter dans
l'ordre, chacun vérifié `tsc --noEmit`.

## Hors périmètre (si A1)

- Application d'un code promo en panier/checkout (`discountAmount` reste
  `0`, niveau `rules`).
- Scopes PRODUCT/PRODUCT_VARIANT/CATEGORY et tables `*Target`.
- `FREE_SHIPPING`, cumul/priorité entre remises (`isAutomatic`, `priority`,
  niveau `automation`).
- `DiscountRedemption` (historique de rédemption) — non alimenté tant
  qu'aucune remise n'est appliquée.

## Bilan d'exécution (2026-06-13)

Les 4 sous-lots ont été exécutés dans l'ordre, chacun vérifié `tsc --noEmit -p
tsconfig.json` (0 erreur).

- **Sous-lot 0** — `prisma/seed/discounts-feature-flag.seed.ts` (nouveau) :
  upsert `FeatureFlag` `commerce.discounts` (`allowedLevels:
  ["simple","rules","automation"]`, `defaultLevel: "simple"`, `status:
  "DRAFT"`, `scopeType: "STORE"`, `isEnabledByDefault: false`). Câblé dans
  `prisma/seed.ts` (import + appel après `seedAnalyticsFeatureFlag`). Module
  inactif par défaut, togglable depuis `/admin/settings/advanced`.
- **Sous-lot 1** — `features/admin/marketing/discounts/` :
  - `types/admin-discount.types.ts` (`AdminDiscountSummary`) ;
  - `queries/list-admin-discounts.query.ts` (`listAdminDiscounts`, lecture
    `Discount` non archivés du store courant) ;
  - `schemas/create-discount.schema.ts` (`createDiscountSchema`, Zod —
    PERCENTAGE/FIXED_AMOUNT, validations conditionnelles) ;
  - `shared/admin-discounts-routes.ts` (`ADMIN_DISCOUNTS_PATH`) ;
  - `actions/create-discount.action.ts` (`createDiscountAction`, "use
    server", `requireAuthenticatedAdmin`, gestion P2002 code dupliqué) ;
  - `actions/toggle-discount-status.action.ts`
    (`toggleDiscountStatusAction`, bascule ACTIVE/INACTIVE).
- **Sous-lot 2** — `features/admin/marketing/discounts/components/` :
  - `admin-discounts-list.tsx` (liste + toggle optimiste) ;
  - `admin-discount-create-form.tsx` (formulaire de création, `<select>`
    natif PERCENTAGE/FIXED_AMOUNT).
  - `app/admin/(protected)/marketing/discounts/page.tsx` (réécriture
    complète) : `notFound()` si flag inactif ; `AdminComingSoon` (avec
    prérequis affichés) si niveau `simple` non atteint ; sinon formulaire +
    liste, avec mention explicite « aucun effet panier/checkout ».
- **Sous-lot 3** (ce lot) — documentation :
  - `docs/domains/satellites/discounts.md` : section « Décisions
    d'implémentation » ajoutée (après « Documents liés »), décrivant le seed,
    l'UI admin, le périmètre `simple` et la limite « aucun effet
    panier/checkout ».
  - `docs/roadmap/2026-06-13-audit-catalogue-modules.md` : entrée
    `commerce.discounts` (section 3, satellites) passée de « L1,
    `AdminComingSoon` » à « L3 (inactif par défaut, niveau `simple`) » ;
    synthèse (section 4) mise à jour (L3 fonctionnel 16→17, L1 placeholder
    3→2) ; point 5 de la roadmap (section 6) marqué fait pour
    `commerce.discounts`, `engagement.newsletter`/`engagement.automations`
    restants.
  - Ce cadrage : présent bilan d'exécution.

### Ce qui n'a pas changé / hors périmètre confirmé

- `discountAmount` reste codé à `0` dans
  `features/commerce/orders/lib/order.repository.ts` — aucune logique de
  remise en panier/checkout.
- `DiscountCode`, `DiscountRedemption`, `DiscountProductTarget`/
  `DiscountVariantTarget`/`DiscountCategoryTarget`, `FREE_SHIPPING`,
  `isAutomatic`/`priority` : non alimentés, réservés aux niveaux
  `rules`/`automation`.
- `marketing.discountsRead` (capability nav) : aucune modification, déjà
  cohérent avec le flag `commerce.discounts`.

### Vérifications effectuées

- `tsc --noEmit -p tsconfig.json` → 0 erreur, après chacun des sous-lots 0, 1,
  2.
- Pas de test automatisé ajouté ni exécuté pour ce lot (admin CRUD simple,
  pattern identique à `engagement.analytics`/`toggleFeatureFlagAction`).
- Pas de vérification manuelle de l'UI (navigateur) — non exécutée dans cette
  session.
