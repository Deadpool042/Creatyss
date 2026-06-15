<!-- docs/lots/2026-06-13-inventory-media-levels-cadrage.md -->

# Cadrage — `catalog.products.inventory` (alerts) & `catalog.products.media` (optimization)

> Suite de `docs/roadmap/2026-06-13-audit-catalogue-modules.md`, section 6,
> point 3 : « Combler l'écart niveaux déclarés/câblés sur
> `catalog.products.inventory` (alerts) et `catalog.products.media`
> (optimization) — petits lots, dans le socle existant. »

## État actuel (audit)

### Feature catalog et niveaux

`features/admin/pilotage/catalog/feature-catalog.ts` :

```ts
export const FEATURE_LEVELS = {
  ...
  media: ["basic", "optimization", "generation", "automation"],
  inventory: ["manual", "alerts", "forecasting"],
  ...
};
```

`catalog.products.inventory` et `catalog.products.media` sont `family: "core"`,
`defaultState: "active"`, `mutability: "level_selectable"`, `levels:
FEATURE_LEVELS.inventory|media`. Le niveau est donc **sélectionnable** dans
`/admin/settings/advanced`.

### Écart n°1 — le mécanisme de niveau lui-même n'est pas câblé

`prisma/seed/feature-flags-catalog.seed.ts` seed ces deux `FeatureFlag` sans
`allowedLevels`/`defaultLevel` (valeurs par défaut : `[]` / `null`). Or
`resolveEffectiveLevel`/`meetsRequiredLevel`
(`entities/feature-flags/feature-level.ts`) renvoient `null`/`false` quand
`allowedLevels` est vide — donc même si l'admin choisit « alerts » ou
« optimization » dans le pilotage, **aucune lecture côté code ne peut
aujourd'hui résoudre ce niveau** : ni stocké correctement (le flag n'est pas
gradué), ni lu.

Le seul précédent de câblage de gradation est `platform.localization`
(`features/localization/queries/get-localization-feature-state.query.ts`,
`getLocalizationFeatureState` / `meetsLocalizationLevel`), qui suit le schéma
`allowedLevels` + `defaultLevel` + override `STORE` + `resolveEffectiveLevel`.

### Écart n°2 — Inventory : un seuil « stock faible » existe déjà, mais codé en dur

- `prisma/optional/commerce/inventory/inventory.prisma` : `InventoryItem`
  (`onHandQuantity`, `reservedQuantity`, `status`, `sku`, `notes`) — **aucun
  champ de seuil**.
- `features/admin/products/components/editor/variants/product-variant-item.utils.ts`,
  `getStockBadge()` : déjà fonctionnel, calcule `availableQuantity =
  onHand - reserved` et retourne :
  - `"Rupture"` si `<= 0` ;
  - `"Stock faible · {qty}"` si `<= 2` (**seuil 2 codé en dur**) ;
  - `"Stock · {qty}"` sinon.

  → Affiché dans l'éditeur produit (liste des variantes), sans gating de
  niveau : ce comportement existe déjà au niveau `manual`.

- Côté liste produits (`features/admin/products/components/list/...`),
  `ProductStockState` = `"in-stock" | "out-of-stock"` (binaire) et
  `PRODUCT_STOCK_BADGE_COPY.lowStockLabel`/`lowStockShort` (« Stock faible » /
  « Faible ») sont **définis mais jamais utilisés** — `getStockConfig` n'a pas
  de branche `low-stock`. Code mort, sans bug actif (cf.
  `docs/audit-admin-products-2026-05-23.md`).

### Écart n°3 — Media : l'optimisation technique de base existe déjà à l'upload

- `core/uploads/image-processing.ts` : tout upload (`uploadAdminMedia`,
  `saveUploadedImage`) est déjà recadré (max 2000px), converti en WebP
  (qualité 82). C'est une forme d'« optimisation » déjà active au niveau
  `basic`.
- `prisma/satellites/media.prisma` : `MediaAsset` porte `widthPx`/`heightPx`,
  `altText` — déjà peuplés à l'upload. `MediaVariant` (variantes
  responsive) existe en modèle mais **n'est jamais créé** par le code.
- `docs/domains/satellites/media.md` documente une « Convention galerie
  produit V1 » : ratio source 4:5 pour les images de galerie produit,
  règles éditoriales (ordre, cadrage) — **non vérifiée par le code**.
- Aucun diagnostic d'admin n'existe pour signaler une image produit sans
  `altText` ou hors ratio 4:5 (à comparer avec
  `AdminProductCardItem.diagnostics: { missingPrimaryImage, missingPrice }`,
  qui est le pattern existant pour ce type de signal).

## Décisions à trancher

### A — Câblage du mécanisme de niveau pour les deux flags `core`

1. **Seeder `allowedLevels`/`defaultLevel`** pour `catalog.products.inventory`
   (`["manual","alerts","forecasting"]`, défaut `manual`) et
   `catalog.products.media` (`["basic","optimization","generation","automation"]`,
   défaut `basic`), et créer un résolveur générique réutilisant
   `resolveEffectiveLevel`/`meetsRequiredLevel` (même schéma que
   `getLocalizationFeatureState`/`meetsLocalizationLevel`, généralisé aux
   features `core` graduées). Sans ce sous-lot, choisir « alerts »/
   « optimization » dans le pilotage reste un choix d'UI sans effet
   observable nulle part — c'est exactement l'écart signalé par le roadmap.
2. **Ne pas câbler de mécanisme de niveau** : traiter les évolutions B/C
   ci-dessous comme toujours actives (le sélecteur de niveau au pilotage
   reste cosmétique pour ces deux entrées, comme aujourd'hui).

### B — Inventory : seuil « stock faible » configurable (alerts)

1. Ajouter `lowStockThreshold: Int?` sur `InventoryItem` (migration Prisma,
   nullable — `null` = comportement actuel, seuil par défaut 2). Champ admin
   dans l'éditeur de variante (`ProductInventoryTab` / `InventoryFields`)
   pour ajuster ce seuil par variante. `getStockBadge()` utilise
   `inventory.lowStockThreshold ?? 2` au lieu de `2` en dur.
   - Si **A1** retenu : le champ de réglage du seuil n'est affiché/modifiable
     que si le niveau effectif de `catalog.products.inventory` est `alerts`
     ou `forecasting` (sinon comportement `manual` = seuil fixe 2,
     identique à aujourd'hui).
   - Si **A2** retenu : le champ est toujours affiché (pas de gating).
2. Ne rien faire côté inventory pour l'instant — rester sur le seuil 2 codé
   en dur (statu quo).

Hors périmètre dans les deux cas : agrégation « stock faible » au niveau
liste produits (`ProductStockState`/`ProductStockBadge` restent binaires —
le code mort `lowStockLabel` n'est ni supprimé ni branché ici), alertes
email/notifications, prévisions (`forecasting`).

### C — Media : diagnostics qualité image (optimization)

1. Ajouter deux diagnostics non bloquants dans l'onglet images de l'éditeur
   produit (`product-images-tab.tsx` / `product-image-item.tsx`) :
   - **texte alternatif manquant** (`MediaAsset.altText` vide/null) ;
   - **ratio non conforme à la convention 4:5** pour les images de galerie
     produit, calculé depuis `widthPx`/`heightPx` déjà stockés (tolérance à
     définir, ex. ±2 %).
   - Si **A1** retenu : ces diagnostics ne s'affichent que si le niveau
     effectif de `catalog.products.media` est `optimization` (ou plus).
   - Si **A2** retenu : toujours affichés.
2. Ne rien faire côté media pour l'instant — rester au niveau `basic`
   (optimisation technique à l'upload uniquement, déjà en place).

Hors périmètre dans les deux cas : génération de `MediaVariant` responsive,
remplacement/recompression d'images existantes, vérification automatique de
l'ordre des images (`generation`/`automation`).

## Sous-lots proposés (si A1 + B1 + C1)

1. **Sous-lot 0** — Seed `allowedLevels`/`defaultLevel` pour
   `catalog.products.inventory` et `catalog.products.media` + résolveur
   générique de niveau (généralisation de
   `getLocalizationFeatureState`/`meetsLocalizationLevel`). Vérif
   `tsc --noEmit`.
2. **Sous-lot 1** — Inventory : migration `InventoryItem.lowStockThreshold`,
   champ admin (gated si A1), `getStockBadge()` utilise le seuil
   configuré. Vérif `tsc --noEmit`.
3. **Sous-lot 2** — Media : diagnostics alt-text + ratio 4:5 dans l'éditeur
   images (gated si A1). Vérif `tsc --noEmit`.
4. **Sous-lot 3** — Vérifications + mise à jour
   `docs/domains/optional/commerce/inventory.md`,
   `docs/domains/satellites/media.md` (sections « Décisions
   d'implémentation ») et `docs/roadmap/2026-06-13-audit-catalogue-modules.md`
   (entrées `catalog.products.inventory`/`catalog.products.media`).

Si **A2** est retenu, le sous-lot 0 est supprimé (B1/C1 sans gating) ; si
**B2**/**C2** sont retenus, le sous-lot correspondant est supprimé.

## Hors périmètre (doctrine)

- Niveaux `forecasting` (inventory), `generation`/`automation` (media).
- `MediaVariant` (variantes responsive générées).
- Affichage « stock faible » côté storefront ou liste produits admin.
- Alertes/notifications (email, dashboard dédié).
- Intégrations WMS/ERP, synchronisation externe.
- Suppression du code mort `PRODUCT_STOCK_BADGE_COPY.lowStockLabel`/
  `lowStockShort` (signalé mais non traité ici — pas dans le périmètre de ce
  lot, et son traitement relève plutôt de l'audit
  `docs/audit-admin-products-2026-05-23.md`).

## Prochaine étape

Trancher A (1 ou 2), B (1 ou 2), C (1 ou 2), puis exécuter le(s) lot(s)
résultant(s) sous-lot par sous-lot, chacun vérifié `tsc --noEmit`.

## Décision tranchée (2026-06-13)

- **A → A1** : seed `allowedLevels`/`defaultLevel` + résolveur générique de
  niveau pour `catalog.products.inventory` et `catalog.products.media`.
- **B → B1** : `InventoryItem.lowStockThreshold` configurable, gated par
  niveau (`alerts`/`forecasting`).
- **C → C1** : diagnostics alt-text + ratio 4:5 dans l'éditeur images, gated
  par niveau (`optimization`/`generation`/`automation`).

→ Les 4 sous-lots de la section précédente sont retenus, à exécuter dans
l'ordre, chacun vérifié `tsc --noEmit`.

## Bilan d'exécution (2026-06-13)

Les 4 sous-lots ont été exécutés dans l'ordre, chacun vérifié `tsc --noEmit`
(0 erreur).

### Sous-lot 0 — résolveur générique de niveau

- `prisma/seed/feature-flags-catalog.seed.ts` : `catalog.products.inventory`
  → `allowedLevels: ["manual","alerts","forecasting"]`,
  `defaultLevel: "manual"` ; `catalog.products.media` →
  `allowedLevels: ["basic","optimization","generation","automation"]`,
  `defaultLevel: "basic"`.
- `features/admin/pilotage/queries/get-feature-level-state.query.ts` (nouveau,
  server-only) : `getFeatureLevelState`/`meetsFeatureLevel`, généralisation de
  `getLocalizationFeatureState`/`meetsLocalizationLevel`.

### Sous-lot 1 — `InventoryItem.lowStockThreshold`

- Migration `20260613090000_add_inventory_low_stock_threshold` (`Int?`
  nullable sur `inventory_items`).
- `getStockBadge()` utilise `inventory.lowStockThreshold ?? 2`.
- Champ « Seuil stock faible » dans `ProductInventoryTab` /
  `InventoryFields`, gated `meetsFeatureLevel("catalog.products.inventory",
  "alerts")`.
- Persistance via `updateProductInventoryAction` /
  `product-update-services.ts` (`InventoryItem.upsert`).

Détails dans `docs/domains/optional/commerce/inventory.md` (section
« Décisions d'implémentation »).

### Sous-lot 2 — diagnostics media

**Écart détecté en cours d'exécution** : l'audit initial (écart n°3)
supposait qu'aucun diagnostic alt-text/ratio 4:5 n'existait dans
`product-images-tab.tsx`/`product-image-item.tsx`. En réalité, le diagnostic
ratio 4:5 (`ratioStats`, `getRatioConformity()`) et l'affichage de l'alt-text
par image étaient déjà implémentés, sans gating, au niveau `basic`.

Option retenue (validée par l'utilisateur) : ajouter uniquement le
diagnostic agrégé « Sans texte alternatif » manquant, gated
`meetsFeatureLevel("catalog.products.media", "optimization")`. Le diagnostic
ratio 4:5 existant n'est pas rétroactivement gated — il reste visible à tous
les niveaux.

- `app/admin/(protected)/catalog/products/[slug]/media/page.tsx` : ajoute
  `meetsFeatureLevel("catalog.products.media", "optimization")` au
  `Promise.all`, passé en prop `showMediaOptimizationDiagnostics`.
- `features/admin/products/components/editor/product-images-tab.tsx` :
  `missingAltTextCount` (compteur), tuile « Sans texte alternatif » dans la
  grille de stats, affichée si `showMediaOptimizationDiagnostics`.

Détails et écart documentés dans `docs/domains/satellites/media.md` (section
« Décisions d'implémentation »).

### Sous-lot 3 — vérifications + documentation

- `docs/domains/optional/commerce/inventory.md` et
  `docs/domains/satellites/media.md` : sections « Décisions
  d'implémentation » ajoutées.
- `docs/roadmap/2026-06-13-audit-catalogue-modules.md` : entrées
  `catalog.products.inventory`/`catalog.products.media` mises à jour (niveaux
  `alerts`/`optimization` câblés), point 3 de la section 6 marqué fait.
- Présent bilan ajouté au cadrage.

### Hors périmètre (confirmé, inchangé)

`forecasting` (inventory), `generation`/`automation` (media), `MediaVariant`,
affichage « stock faible » storefront/liste produits, alertes/notifications,
intégrations WMS/ERP, code mort `PRODUCT_STOCK_BADGE_COPY.lowStockLabel`.
