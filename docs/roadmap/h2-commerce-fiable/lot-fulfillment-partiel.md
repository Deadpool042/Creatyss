# Lot — Fulfillment partiel

## Statut

Terminé — implémenté 2026-06-24. Lignes partielles, décrément inventaire transactionnel, lien Shipment optionnel. Typecheck et lint verts.

## Objectif

Étendre le module fulfillment pour gérer la préparation par quantité de ligne (partielle), lier les préparations aux expéditions (`Shipment`), et impacter l'inventaire lors de la préparation. La V1 observée (`commerce.fulfillment` L3) couvre uniquement la préparation "tout ou rien" sans impact inventaire ni lien expédition.

## Périmètre

Livré au 2026-06-24 :

- `features/admin/commerce/fulfillment/` — logique de préparation partielle par ligne et quantité
- Décrément inventaire transactionnel sur `InventoryItem` lors de la validation de la préparation
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
- Le décrément d'inventaire doit être transactionnel (pas de décrément partiel en cas d'erreur)
- La préparation partielle ne doit pas être possible si la quantité demandée dépasse la quantité disponible
- Le lien Shipment est optionnel : une préparation peut être finalisée sans expédition associée (livraison en main propre)

## Risques

- Décrément inventaire : la V1 observée est "sans impact stock" — l'ajout du décrément modifie le comportement existant, risque de double décrément si une commande a déjà été préparée sans impact inventaire
- Préparations existantes sans impact inventaire : si des préparations ont déjà été créées en production en V1, il faudra décider si elles doivent être réconciliées ou laissées telles quelles
- Quantités partielles : la logique de résolution des quantités restantes par ligne peut devenir complexe si plusieurs préparations partielles successives sont permises

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la logique de décrément transactionnel
- Test manuel : commande multi-lignes → préparation partielle → stock mis à jour → expédition liée

## Critères de fin

- Une préparation peut être créée pour un sous-ensemble des lignes de commande
- La validation d'une préparation décrémente l'inventaire de façon transactionnelle
- Une préparation peut être liée à une expédition `Shipment`
- `typecheck` et `lint` passent sans erreur
- Le workflow V1 reste fonctionnel sans régression

## Agent recommandé

`next-feature-builder` pour l'implémentation. Un cadrage `architect-review` est recommandé pour trancher la politique de réconciliation des préparations V1 existantes et la logique de quantités partielles.
