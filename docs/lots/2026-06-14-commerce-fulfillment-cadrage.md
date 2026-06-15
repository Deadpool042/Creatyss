<!-- docs/lots/2026-06-14-commerce-fulfillment-cadrage.md -->

# Cadrage — `commerce.fulfillment` (exécution logistique)

> Roadmap point 6 (`docs/roadmap/2026-06-13-audit-catalogue-modules.md`).
> **Nature : cadrage uniquement.** Aucune implémentation. Conforme à `AGENTS.md`
> (doctrine canonique) : sections objectif / périmètre / hors périmètre /
> invariants / risques / vérifications / critères de fin.

## Objectif

Donner au système la capacité de représenter et suivre la **préparation
logistique** d'une commande (pick/pack), distincte de l'expédition et du stock,
conformément à la doctrine `docs/domains/optional/commerce/fulfillment.md`.

## État réel (audit)

- **Modèle Prisma complet** (`prisma/optional/commerce/fulfillment.prisma`,
  `L2`, `DependsOn: foundation.store, commerce.orders`) :
  - `Fulfillment` : `orderId`, `shipmentId?`, `status`
    (`PENDING|READY|PARTIALLY_FULFILLED|FULFILLED|CANCELLED|ARCHIVED`),
    `fulfilledAt`/`cancelledAt`, `notes`, lien `shipment?`.
  - `FulfillmentItem` : `orderLineId`, `quantity`, `status`,
    `@@unique([fulfillmentId, orderLineId])` → **supporte le partiel**.
- **Aucun code applicatif** (`features/**`, `app/**`) — `commerce.fulfillment`
  est **L0** (clé présente dans `feature-catalog.ts`, aucun seed `FeatureFlag`,
  aucune query/page/service). Pas de migration nécessaire (schéma déjà posé).
- **Flux d'expédition actuel** (`features/admin/commerce/orders/services/ship-admin-order.service.ts`) :
  crée directement un `Shipment` (carrier/tracking) et passe la commande à
  `COMPLETED` + historique, **sans fulfillment**. Le fulfillment n'est donc pas
  dans le chemin critique aujourd'hui.

## Frontières (doctrine, à préserver)

- `fulfillment` **exécute** la préparation ; il **ne possède pas** : la commande
  (`orders`), le stock (`inventory`), la vendabilité (`availability`), le suivi
  de livraison (`shipping`).
- `Fulfillment.shipmentId` permet de relier une préparation à une expédition,
  sans fusionner les deux domaines.

## Périmètre proposé (V1)

1. Création d'un fulfillment pour une commande, avec ses `FulfillmentItem`
   (une ligne par `OrderLine`, `quantity` = quantité commandée).
2. Avancement de statut : `PENDING → READY → FULFILLED` (et `CANCELLED`).
3. Lecture/affichage de l'état d'exécution dans le détail commande (admin).
4. Gating `FeatureFlag commerce.taxation`-style (seed DRAFT, inactif par défaut).

## Hors périmètre (V1)

- **Mutation d'inventaire** (décrément `onHandQuantity` / libération
  `reservedQuantity`) à la préparation : **non** en V1 — c'est une décision
  inter-domaines (`inventory`) à trancher séparément (cf. D3). Risque de
  double-décrément avec d'autres flux.
- **Fulfillment partiel** par quantités < commandé (le modèle le permet, mais V1
  reste « tout ou rien » par ligne pour borner).
- **Modification du flux d'expédition existant** (`ship-admin-order.service`) :
  inchangé. Pas de couplage automatique fulfillment ↔ shipment en V1.
- `commerce.returns`, et toute logique multi-entrepôt.

## Décisions à trancher

- **D1 — Granularité** : V1 « tout ou rien » par ligne (recommandé) vs partiel
  par quantité.
- **D2 — Relation à l'expédition** : fulfillment indépendant (recommandé, ne
  touche pas au flux `ship-admin-order` qui marche) vs intégration (créer un
  fulfillment à l'expédition). Décision structurante → préférer indépendant V1.
- **D3 — Inventaire** : la mise à `FULFILLED` décrémente-t-elle le stock ?
  Recommandé **non en V1** (flag explicite), à cadrer avec `inventory` car
  inter-domaines et à risque de double-comptage.
- **D4 — Cycle de vie** : transitions autorisées et irréversibilité de
  `FULFILLED`/`CANCELLED`.

## Invariants à préserver

- Un `FulfillmentItem.quantity` ≤ quantité de l'`OrderLine` correspondante.
- Un seul `FulfillmentItem` par `(fulfillment, orderLine)` (contrainte DB).
- `fulfillment` ne modifie ni `Order.status` ni le stock sans décision explicite
  (D2/D3).
- Pas de logique métier dans l'UI (AGENTS.md).

## Risques

- Chevauchement conceptuel avec le flux d'expédition actuel (confusion
  utilisateur si deux notions de « préparation/expédition » coexistent).
- Couplage involontaire à `inventory` si D3 mal cadré (double-décrément).
- Sur-architecture si le partiel est introduit trop tôt.

## Sous-lots proposés (si V1 retenu)

1. **Service** : `createFulfillment` (items depuis les lignes), `advanceFulfillmentStatus`.
   Pas de schéma (modèle déjà posé). Vérif `tsc`.
2. **UI admin** : section « Préparation » dans le détail commande
   (`next-admin-ui-builder`) — création + avancement + lecture statut.
3. **Gating + seed** : `FeatureFlag commerce.fulfillment` (DRAFT), gating page.
4. **Doc** : `fulfillment.md` (décisions d'implémentation), roadmap audit, bilan.

## Vérifications (AGENTS.md)

- `pnpm prisma validate` (aucun changement de schéma attendu).
- `pnpm typecheck`, `pnpm lint`, `pnpm test` (tests ciblés service si logique de
  transition).
- e2e ciblé si l'UI admin commande est touchée.

## Critères de fin

- Depuis une commande, un admin peut créer une préparation, la faire avancer
  jusqu'à `FULFILLED`, et voir l'état — le tout derrière le `FeatureFlag`, sans
  impacter le flux d'expédition ni le stock.
- Doctrine `fulfillment.md` à jour (état réel), frontières `shipping`/`inventory`
  préservées.

## Prérequis de décision (avant ouverture)

1. D2 : fulfillment indépendant du flux d'expédition actuel ? (recommandé oui)
2. D3 : impact stock à la préparation ? (recommandé : aucun en V1)
3. D1 : « tout ou rien » V1, partiel plus tard ? (recommandé oui)
