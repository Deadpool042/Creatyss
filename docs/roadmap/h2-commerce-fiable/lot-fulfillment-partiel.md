# Lot — Fulfillment partiel

## Statut

Terminé — implémenté 2026-06-24. Lignes partielles, lien Shipment optionnel. Typecheck et lint verts.

**Correction doctrine (2026-07-01)** : un décrément d'inventaire transactionnel à `FULFILLED` avait été introduit puis retiré (double décrément avec la consommation de stock déjà faite à la création de commande). Doctrine V1 confirmée : le stock est consommé à la commande ; le fulfillment ne mute pas l'inventaire. Voir `docs/domains/optional/commerce/fulfillment.md`.

## Objectif

Étendre le module fulfillment pour gérer la préparation par quantité de ligne (partielle) et lier les préparations aux expéditions (`Shipment`). La V1 observée (`commerce.fulfillment` L3) couvre uniquement la préparation "tout ou rien" sans impact inventaire ni lien expédition ; cette absence d'impact inventaire reste la doctrine finale.

## Périmètre

Livré au 2026-06-24 :

- `features/admin/commerce/fulfillment/` — logique de préparation partielle par ligne et quantité
- Lien `Shipment` optionnel depuis la préparation
- `features/admin/commerce/shipping/` — lien cohérent depuis la vue expéditions vers la préparation associée

Reste hors de la preuve livrée dans ce lot :

- intégrations transporteurs
- automatisation d'étiquettes ou de tracking
- multi-entrepôts

## Hors périmètre

- Transporteurs intégrés (API Colissimo, DHL, etc.)
- Génération d'étiquettes d'expédition automatiques
- Tracking automatique de livraison (suivi via API transporteur)
- Multi-entrepôts

## Dépendances

- `commerce.fulfillment` V1 observée comme base de départ (ne pas réécrire le workflow PENDING→READY→FULFILLED/CANCELLED)
- `catalog.products.inventory` L3 actif (observé) avec `InventoryItem` accessible
- Aucune dépendance bloquante sur H1 — ce lot peut avancer en parallèle

## Invariants

- Le workflow PENDING→READY→FULFILLED/CANCELLED existant ne doit pas être redessiné — la préparation partielle s'y greffe
- La transition vers `FULFILLED` ne mute pas l'inventaire (stock déjà consommé à la création de commande)
- La préparation partielle ne doit pas être possible si la quantité demandée dépasse la quantité disponible
- Le lien Shipment est optionnel : une préparation peut être finalisée sans expédition associée (livraison en main propre)

## Risques

- Quantités partielles : la logique de résolution des quantités restantes par ligne peut devenir complexe si plusieurs préparations partielles successives sont permises

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Test E2E (`commerce-fulfillment.spec.ts`) : `inventoryOnHand` inchangé après passage à `FULFILLED`
- Test manuel : commande multi-lignes → préparation partielle → expédition liée, stock inchangé

## Critères de fin

- Une préparation peut être créée pour un sous-ensemble des lignes de commande
- La validation d'une préparation vers `FULFILLED` ne mute pas l'inventaire
- Une préparation peut être liée à une expédition `Shipment`
- `typecheck` et `lint` passent sans erreur
- Le workflow V1 reste fonctionnel sans régression

## Agent recommandé

`next-feature-builder` pour l'implémentation. Un cadrage `architect-review` est recommandé pour trancher la politique de réconciliation des préparations V1 existantes et la logique de quantités partielles.
