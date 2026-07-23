# Lot — Marketplace

## Statut

A faire

## Objectif

Activer le domaine `marketplace` : orchestration d'une place de marché (vendeurs tiers, offres, catalogues ou stocks tiers exposés dans un cadre gouverné). Le domaine est documenté (`docs/domains/optional/marketplace.md`, `optional` / `activable: oui`, décrit comme « fortement structurant » une fois activé sur catalogue, vente, commandes, paiements et intégrations), mais aucun modèle Prisma ni aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé.

## Périmètre

Proposition — aucun modèle Prisma existant à ce jour, la modélisation elle-même fait partie du lot :

- Modélisation Prisma du domaine (`MarketplaceSeller`, `MarketplaceOffer`, `MarketplaceSellerStatus`, `MarketplaceOfferStatus`, `MarketplacePolicy` — objets conceptuels cités par `docs/domains/optional/marketplace.md`, non observés dans `prisma/**`)
- Gouvernance d'un vendeur tiers (statut, onboarding — périmètre exact à définir en cadrage)
- Exposition d'offres marketplace dans le catalogue existant, sans confusion avec le catalogue propriétaire (`products`)
- Interaction avec paiements et commandes pour un flux marketplace (répartition, reversement — périmètre à définir)

## Hors périmètre

- Toute automatisation de reversement financier aux vendeurs tiers sans validation comptable explicite (risque financier fort, à cadrer séparément si retenu)
- Intégration technique avec un provider marketplace externe spécifique (relèverait de `integrations`)
- Migration du catalogue propriétaire existant vers un modèle marketplace — non présumée par ce lot

## Dépendances

- Décision produit sur la priorité, en l'absence de tout socle technique — ce domaine est documenté comme « fortement structurant » une fois activé (impact catalogue, vente, commandes, paiements, conformité) : toute décision d'activation doit être portée au niveau stratégique, pas traitée comme un micro-lot isolé
- `catalog.products`, `commerce.orders`, `commerce.payments` comme domaines fortement impactés par toute activation
- `docs/domains/optional/marketplace.md` comme référence doctrinale du domaine (distinction avec `products`, `integrations`, `pricing`, `payments`, `orders`)

## Invariants

- Le système reste maître de la vérité sur les vendeurs, offres et statuts marketplace (si le domaine est activé)
- Distinction stricte avec le catalogue propriétaire (`products`) — cf. `docs/domains/optional/marketplace.md`
- Aucune offre marketplace ne doit être confondue avec un produit du catalogue propriétaire dans les lectures storefront

## Risques

- Impact architectural majeur si le domaine est activé sans cadrage stratégique préalable — le domaine est documenté comme fortement structurant sur catalogue/vente/commandes/paiements, contrairement aux autres domaines de cette liste
- Risque financier et de conformité si la gestion des reversements vendeurs n'est pas strictement encadrée
- Effort de cadrage largement sous-estimé si traité comme un lot standard plutôt que comme une décision stratégique de plateforme

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `db:validate` si évolution du schéma Prisma retenue

## Critères de fin

- Une décision stratégique explicite est rendue sur l'opportunité d'activer ce domaine, avant tout travail de modélisation
- Si retenu, un schéma Prisma minimal et un périmètre v1 strictement borné sont cadrés séparément de ce lot
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour porter la décision stratégique d'activation (impact catalogue/vente/commandes/paiements) avant tout travail de modélisation ou d'implémentation.
