<!-- docs/lots/2026-06-14-commerce-returns-cadrage.md -->

# Cadrage — `commerce.returns` (retours)

> Roadmap point 6. **Cadrage uniquement**, aucune implémentation. Conforme
> `AGENTS.md` : objectif / périmètre / hors périmètre / invariants / risques /
> vérifications / critères de fin, avec distinction état réel vs cible.

## Objectif

Permettre de représenter et suivre une **demande de retour** rattachée à une
commande (lignes, quantités, décisions, statut), conformément à
`docs/domains/optional/returns.md`.

## État réel (audit)

- **Modèle Prisma complet** (`prisma/optional/commerce/returns.prisma`, `L2`,
  `DependsOn: foundation.store, commerce.orders, commerce.fulfillment`) :
  - `ReturnRequest` : `orderId`, `customerId?`, `returnNumber`
    (`@@unique([storeId, returnNumber])`), `status`
    (`REQUESTED|UNDER_REVIEW|APPROVED|REJECTED|RECEIVED|REFUNDED|CLOSED|CANCELLED|ARCHIVED`),
    `reasonCode`, horodatages par étape.
  - `ReturnItem` : `orderLineId?`, `quantity`, `condition`, snapshot
    `productName`/`variantName`/`sku`.
  - `ReturnDecision` : `type` (`APPROVE|REJECT|PARTIAL_APPROVE`), `decidedByUserId?`.
- **Aucun code applicatif** — `commerce.returns` est **L0** (clé dans
  `feature-catalog.ts`, aucun seed, aucune query/page/service). Pas de migration
  (schéma déjà posé).

## Frontières (doctrine, à préserver)

- `returns` possède : la demande, ses lignes/quantités, ses décisions, son statut.
- `returns` **ne possède pas** : la commande (`orders`), le remboursement
  effectif (`payments` / avoir `commerce.documents`), le restock
  (`inventory`), l'expédition retour (`shipping`), le support (`support`).

## Périmètre proposé (V1)

1. Création d'une demande de retour depuis une commande, avec sélection de
   lignes et quantités (snapshot `productName`/`sku` figé).
2. Workflow de statut : `REQUESTED → UNDER_REVIEW → APPROVED | REJECTED →
   RECEIVED → CLOSED` (+ `CANCELLED`). `REFUNDED` posé en statut sans déclencher
   de remboursement réel.
3. Enregistrement des décisions (`ReturnDecision`, traçabilité utilisateur).
4. Lecture/affichage dans le détail commande (admin), gating
   `FeatureFlag commerce.returns` (DRAFT, inactif par défaut).

## Hors périmètre (V1)

- **Remboursement réel** (paiement / génération d'avoir) : non. Le statut
  `REFUNDED` est déclaratif ; le lien vers un `CREDIT_NOTE` (`commerce.documents`)
  pourra être ajouté ultérieurement.
- **Restock inventaire** à `RECEIVED` : non (décision inter-domaines `inventory`,
  même prudence que `fulfillment`).
- **Demande de retour côté client** (storefront) : V1 admin uniquement.
- Logistique retour (étiquette, suivi) côté `shipping`.

## Décisions à trancher

- **D1 — Numérotation `returnNumber`** : pas d'obligation légale de séquence sans
  trou (contrairement aux factures). Recommandé : référence simple lisible
  `RET-{année}-{séquence}` via le même compteur `DocumentCounter` **ou** une
  référence courte non séquentielle. À trancher (réutiliser le compteur = lot
  `prisma-architect` léger ; ref courte = zéro dépendance).
- **D2 — Granularité** : sélection de lignes + quantités dès V1 (recommandé, le
  modèle le porte) vs retour « commande entière » seulement.
- **D3 — Emplacement UI** : carte dans le détail commande (recommandé, cohérent
  avec documents/fulfillment) vs page dédiée `/admin/commerce/returns`.
- **D4 — Remboursement** : confirmer que `REFUNDED` reste déclaratif en V1.

## Invariants à préserver

- `ReturnItem.quantity` ≤ quantité commandée de la ligne (moins déjà retourné).
- `returns` ne modifie ni `Order.status`, ni le stock, ni les paiements en V1.
- Décisions tracées (`ReturnDecision`) pour tout changement d'issue.
- Pas de logique métier dans l'UI.

## Risques

- Confusion avec annulation de commande et avoir (bien séparer : retour ≠ avoir ≠
  annulation).
- Couplage involontaire à `inventory`/`payments` si D2/D4 mal cadrés.
- Numérotation : éviter d'imposer la rigueur « facture » là où elle n'est pas due.

## Sous-lots proposés (si V1 retenu)

1. **(option D1)** Numérotation : ref courte (zéro schéma) ou extension compteur.
2. **Service** : `createReturnRequest`, `recordReturnDecision`,
   `advanceReturnStatus`. Pas de schéma. Vérif `tsc`.
3. **UI admin** : carte « Retour » dans le détail commande (création + décisions
   + statut), `next-admin-ui-builder`.
4. **Gating + seed** : `FeatureFlag commerce.returns` (DRAFT).
5. **Doc** : `returns.md` (décisions d'implémentation), roadmap, bilan.

## Vérifications (AGENTS.md)

- `pnpm prisma validate` (aucun changement de schéma attendu si D1 = ref courte).
- `pnpm typecheck`, `pnpm lint`, `pnpm test` (tests ciblés transitions de statut).
- e2e ciblé si l'UI détail commande est touchée.

## Critères de fin

- Depuis une commande, un admin peut ouvrir une demande de retour (lignes +
  quantités), enregistrer une décision, faire avancer le statut jusqu'à `CLOSED`,
  et voir l'état — derrière le `FeatureFlag`, sans impact stock/paiement/commande.
- Doctrine `returns.md` à jour (état réel), frontières préservées.

## Prérequis de décision (avant ouverture)

1. D1 : `returnNumber` séquentiel (compteur) ou référence courte ? (reco : courte)
2. D3 : carte détail commande (reco) ou page dédiée ?
3. D4 : `REFUNDED` déclaratif en V1 ? (reco : oui)
