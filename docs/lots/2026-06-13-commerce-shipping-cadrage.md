<!-- docs/lots/2026-06-13-commerce-shipping-cadrage.md -->

# Cadrage — `commerce.shipping` (L1 → étape suivante)

> Suite de `docs/roadmap/2026-06-13-audit-catalogue-modules.md`, section 6,
> point 2 : "Compléter un module déjà L3 partiel : `commerce.shipping` —
> admin transporteurs/suivi, pour atteindre la cohérence avec son
> `defaultState: active`."

## État actuel (audit)

### Feature catalog

`features/admin/pilotage/catalog/feature-catalog.ts` :

```ts
{
  key: "commerce.shipping",
  label: "Livraison",
  description: "Gestion des modes de livraison et des transporteurs.",
  family: "satellite",
  module: "commerce",
  defaultState: "active",
  mutability: "toggleable", // pas de levels
  scopes: ["store"],
}
```

### Ce qui est déjà L3

- **Réglages** (`/admin/settings/shipping`) : configuration fonctionnelle —
  upsert `ShippingZone` (FR uniquement, V1) + `ShippingMethod` (`STANDARD`
  payant, `FREE` au-delà d'un seuil). Cf.
  `docs/lots/2026-06-10-settings-shipping-v1-reference.md`.
- **Checkout** : `getAvailableShippingMethods` filtre les `ShippingMethod`
  `ACTIVE` par `minSubtotalAmount`/`maxSubtotalAmount` ; la sélection est
  persistée (`CheckoutShippingSelection` → `OrderShippingSelection`).
- **Commande (détail admin)** : `OrderDetailShippingCard` affiche déjà
  `shipmentStatus`, `trackingReference`, `carrier`, `trackingUrl`,
  `deliveredAtLabel` — lus depuis `Shipment`.
- **Action "Marquer comme expédiée"** (`shipAdminOrder`,
  `features/admin/commerce/orders/services/ship-admin-order.service.ts`) :
  transition commande → `COMPLETED`, crée/maj `Shipment`
  (`status: SHIPPED`, `trackingNumber`, `shippedAt`).

### Ce qui reste L1 / incomplet

- **`/admin/commerce/shipping`** (`app/admin/(protected)/commerce/shipping/page.tsx`) :
  `AdminComingSoon`, description : *"Gestion des expéditions, transporteurs,
  numéros de suivi et notifications clients. **Intégration Colissimo, Mondial
  Relay, etc.**"* — cette dernière phrase promet une intégration
  transporteur externe **explicitement hors périmètre** d'après
  `docs/domains/optional/commerce/shipping.md` (non-responsabilité :
  "intégrations transporteurs, webhooks").
- **Formulaire "Marquer comme expédiée"** (`shipOrderSchema`,
  `ShipOrderInput`) : ne capture que `trackingReference`. Les champs
  `carrier` et `trackingUrl`, déjà affichés par `OrderDetailShippingCard`
  (toujours `null` aujourd'hui faute d'écriture), ne sont jamais saisis.
- **Transition "Livrée"** : `Shipment.status` peut valoir `DELIVERED`
  (enum `ShipmentStatus`) et `deliveredAt` est déjà lu/affiché, mais
  **aucune action admin ne fait cette transition** — un `Shipment` reste
  `SHIPPED` indéfiniment une fois créé.

### Modèle Prisma (déjà posé, suffisant pour ce lot)

`prisma/optional/commerce/shipping.prisma` : `ShippingZone`,
`ShippingMethod`, `Shipment` (`status`, `carrier`, `trackingNumber`,
`trackingUrl`, `shippedAt`, `deliveredAt`, `cancelledAt`) + enums. Aucune
migration nécessaire pour les évolutions ci-dessous.

## Doctrine — rappel des limites (`docs/domains/optional/commerce/shipping.md`)

Non-responsabilités explicites du domaine `shipping` : commande, paiement,
stock, **fulfillment (logistique physique)**, **intégrations
transporteurs**, **webhooks**. Invariants : une expédition est liée à une
commande ; un statut ne doit pas redevenir incohérent (ex. livré → en
transit interdit).

## Décisions à trancher

### A — Page `/admin/commerce/shipping`

1. **Corriger uniquement la description `AdminComingSoon`** (retirer la
   mention "Intégration Colissimo, Mondial Relay, etc.", hors périmètre
   doctrine) — la page reste un placeholder, le pilotage shipping continue
   de se faire via réglages + détail commande.
2. **Construire une vue de suivi des expéditions** : liste des `Shipment`
   tous statuts/commandes confondus (filtrable par statut), avec lien vers
   chaque commande — complète le détail par-commande existant par une vue
   d'ensemble. Pas d'intégration transporteur.

### B — Capturer `carrier` / `trackingUrl` à l'expédition

Étendre `shipOrderSchema`/`ShipOrderInput`/`shipAdminOrder` pour saisir
`carrier` (texte libre, ex. "Colissimo") et `trackingUrl` en plus de
`trackingReference` lors de l'action "Marquer comme expédiée". Ces champs
sont déjà lus et affichés par `OrderDetailShippingCard` — saisie manuelle,
pas d'intégration API transporteur.

- Oui : étendre le formulaire/schema/service (petit lot, cohérent avec
  l'affichage déjà existant).
- Non : laisser `carrier`/`trackingUrl` à `null` pour l'instant (statu quo).

### C — Action "Marquer comme livrée"

Ajouter une action admin (depuis le détail commande) faisant la transition
`Shipment.status: SHIPPED → DELIVERED` + `deliveredAt = now()`. Respecte
l'invariant de cycle de vie de la doctrine (transitions non régressives).

- Oui : ajouter cette action (complète le cycle expédiée→livrée déjà
  modélisé mais inatteignable aujourd'hui).
- Non : pas encore — rester sur "expédiée" comme état final côté admin.

## Décision tranchée (2026-06-13)

- **A → option 2** : construire une vue de suivi des expéditions
  (liste `Shipment`, filtrable par statut, lien vers chaque commande),
  remplace `AdminComingSoon`.
- **B → oui** : étendre `shipOrderSchema`/`ShipOrderInput`/`shipAdminOrder`
  + formulaire admin avec `carrier` et `trackingUrl` (texte libre).
- **C → oui** : ajouter une action admin "Marquer comme livrée"
  (`SHIPPED → DELIVERED`, `deliveredAt = now()`).

→ Les 4 sous-lots ci-dessous sont retenus, à exécuter dans l'ordre,
chacun vérifié `tsc --noEmit`.

## Sous-lots proposés (si A2 + B + C retenus)

1. **Sous-lot 1** — Étendre `shipOrderSchema`/`ShipOrderInput`/
   `shipAdminOrder` + formulaire admin : champs `carrier`, `trackingUrl`
   optionnels. Vérif `tsc --noEmit`.
2. **Sous-lot 2** — Action `deliverAdminOrder` (transition `DELIVERED` +
   `deliveredAt`) + bouton dans `OrderDetailShippingCard`/détail commande,
   gardée par `resolveOrderStatusTransition`-équivalent côté `Shipment`.
3. **Sous-lot 3** — Vue `/admin/commerce/shipping` : liste des `Shipment`
   (query dédiée, filtre par statut), remplace `AdminComingSoon`.
4. **Sous-lot 4** — Vérifications + mise à jour `docs/domains/optional/commerce/shipping.md`
   (statut maturité) et `docs/roadmap/2026-06-13-audit-catalogue-modules.md`
   (entrée `commerce.shipping`).

Si seule A1 est retenue (correction de description), c'est un lot unique,
sans sous-lots.

## Hors périmètre (doctrine)

- Intégrations transporteurs (Colissimo, Mondial Relay, API tracking
  externe).
- Webhooks transporteurs / notifications client automatiques.
- Fulfillment (logistique physique, `commerce.fulfillment`, L0).
- Multi-colis, livraison partielle, zones hors France (questions ouvertes
  doctrine, non traitées ici).
- Modification des niveaux/gating : `commerce.shipping` n'a pas de
  `levels` au catalogue ; ce lot ne lui en ajoute pas.

## Prochaine étape

Trancher A (1 ou 2), B (oui/non), C (oui/non), puis exécuter le(s) lot(s)
résultant(s) sous-lot par sous-lot, chacun vérifié `tsc --noEmit`.

## Bilan d'exécution (2026-06-13)

Les 4 sous-lots ont été exécutés dans l'ordre, chacun vérifié
`npx tsc --noEmit -p tsconfig.json` (0 erreur après chaque sous-lot).

### Sous-lot 1 — `carrier` / `trackingUrl` à l'expédition

Fichiers modifiés :

- `features/admin/commerce/orders/schemas/ship-order.schema.ts` — ajout
  `carrier`, `trackingUrl` (nullable, texte libre) à `shipOrderSchema`.
- `features/admin/commerce/orders/services/ship-admin-order.service.ts` —
  `shipmentData` écrit désormais `carrier`/`trackingUrl` (create et update).
- `features/admin/commerce/orders/actions/ship-order-action.ts` — parse
  `carrier`/`trackingUrl` depuis le `FormData` (même pattern que
  `trackingReference`).
- `features/admin/commerce/orders/details/mappers/build-admin-order-detail-view-model.ts` —
  `orderMeta` expose désormais `carrier`/`trackingUrl`.
- `features/admin/commerce/orders/components/order-detail-actions-card.tsx` —
  formulaire "Expédier la commande" : 2 champs supplémentaires
  (`carrier`, `trackingUrl`), pré-remplis depuis `OrderDetailShippingCard`.

### Sous-lot 2 — Action "Marquer comme livrée"

Fichiers créés :

- `features/admin/commerce/orders/schemas/deliver-order.schema.ts`
- `features/admin/commerce/orders/services/deliver-admin-order.service.ts` —
  transition `Shipment.status: SHIPPED → DELIVERED` + `deliveredAt = now()`,
  gardée (rejette si l'expédition active n'est pas `SHIPPED` →
  `AdminOrderServiceError("invalid_shipment_transition")`).
- `features/admin/commerce/orders/actions/deliver-order-action.ts`

Fichiers modifiés :

- `features/admin/commerce/orders/services/admin-order-service.errors.ts` —
  nouveau code `invalid_shipment_transition`.
- `features/admin/commerce/orders/actions/index.ts` — export
  `deliverOrderAction`.
- `features/admin/commerce/orders/mappers/order-detail-mappers.ts` —
  messages `delivered` / `deliver_failed`.
- `features/admin/commerce/orders/components/order-detail-actions-card.tsx` —
  nouveau bouton "Marquer comme livrée" (visible si `shipmentStatus ===
  "SHIPPED"`), indépendant de `allowedTransitions` (le statut commande ne
  change pas).
- `app/admin/(protected)/commerce/orders/@detail/[id]/page.tsx` — passe
  `shipmentStatus={vm.shippingInfo.status}` à `OrderDetailActionsCard`.

### Sous-lot 3 — Vue `/admin/commerce/shipping`

Fichiers créés :

- `features/admin/commerce/shipping/list/types/admin-shipment-list.types.ts`
- `features/admin/commerce/shipping/list/mappers/map-admin-shipment-summary.ts`
- `features/admin/commerce/shipping/list/queries/list-admin-shipments.query.ts`
  — liste paginée des `Shipment` du store, filtrable par statut, jointure
  manuelle avec `Order` (référence, client).
- `features/admin/commerce/shipping/list/components/admin-shipments-list.tsx`
  — liste + filtres par statut (liens `?status=...`), chaque ligne pointe
  vers `/admin/commerce/orders/[orderId]`.

Fichiers modifiés :

- `app/admin/(protected)/commerce/shipping/page.tsx` — remplace
  `AdminComingSoon` par la vue de suivi, gardée par
  `requireAdminCapability("admin.commerce.shipping.read")`.

### Sous-lot 4 — Vérifications + documentation

- `npx tsc --noEmit -p tsconfig.json` final : 0 erreur.
- `docs/domains/optional/commerce/shipping.md` — section "Décisions
  d'implémentation" ajoutée (V1 2026-06-13).
- `docs/roadmap/2026-06-13-audit-catalogue-modules.md` — entrée
  `commerce.shipping` passée L1 → L3, synthèse section 4 mise à jour
  (15/32 L3, 3/32 L1 placeholder).

### Non vérifié / hors périmètre

- Pas de test E2E/unitaire ajouté pour `deliverAdminOrder` ou la nouvelle
  vue (`npx vitest run` reste cassé dans ce sandbox — limitation
  préexistante, non liée à ce lot).
- Pas de vérification visuelle (screenshot) de
  `/admin/commerce/shipping` ni du formulaire étendu côté détail commande.
- Intégrations transporteurs, webhooks, multi-colis, livraison partielle :
  toujours hors périmètre, conformément à la doctrine.
