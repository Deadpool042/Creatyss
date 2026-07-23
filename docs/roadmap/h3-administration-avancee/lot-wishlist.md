# Lot — Wishlist

## Statut

A faire

## Objectif

Activer le domaine `wishlist` : listes d'envies structurées, permettant à un client d'enregistrer des produits/variantes/offres pour plus tard, dans un cadre gouverné distinct du panier. Le domaine est documenté (`docs/domains/optional/wishlist.md`, `optional` / `activable: oui`), mais aucun modèle Prisma dédié ni aucune implémentation applicative de ce domaine n'existe à ce jour — ce lot n'a jamais été scopé.

**Constat préalable important** : le repo dispose déjà d'un mécanisme de « favoris » observé (`features/storefront/favorites/**` : `use-favorites.ts`, `toggle-favorite.action.ts`, `read-favorites.action.ts`, `favorite-button.tsx`, `favorite-product-card.tsx`, page `app/(public)/favoris/page.tsx`). Ce mécanisme couvre une partie du besoin fonctionnel décrit par `docs/domains/optional/wishlist.md` (enregistrement de produits « pour plus tard », distinct du panier). Ce lot ne doit donc pas être cadré comme une création ex nihilo : il doit d'abord déterminer si le domaine `wishlist` documenté est une simple formalisation/renommage doctrinal de l'existant `favorites`, ou s'il porte une capacité réellement plus large (partage de liste, durée de vie, propriétaire visiteur non identifié, etc.) qui justifierait un domaine distinct.

## Périmètre

Proposition — aucun modèle Prisma dédié `wishlist` existant à ce jour, la modélisation elle-même fait partie du lot :

- Clarification préalable de la frontière entre `wishlist` (doctrine) et `favorites` (implémentation observée) — priorité du cadrage avant toute modélisation
- Le cas échéant, modélisation Prisma du domaine (`Wishlist`, `WishlistItem`, `WishlistOwner`, `WishlistStatus` — objets conceptuels cités par `docs/domains/optional/wishlist.md`, non observés dans `prisma/**`)
- Le cas échéant, capacités non couvertes par `favorites` (partage de liste, gouvernance de durée de vie, etc.)

## Hors périmètre

- Toute réécriture de `features/storefront/favorites/**` non justifiée par le cadrage préalable
- Le panier (`cart`), les recommandations (`recommendations`) et le CRM (`crm`) — hors périmètre du domaine `wishlist`

## Dépendances

- Décision produit sur la priorité, en l'absence de tout socle technique dédié — et en présence d'un mécanisme `favorites` déjà en production qui peut réduire ou annuler le besoin
- Clarification doctrinale : `wishlist` (documenté) et `favorites` (implémenté) doivent-ils rester deux domaines distincts, ou `docs/domains/optional/wishlist.md` doit-il être mis à jour pour référencer `favorites` comme implémentation existante ? — écart à signaler indépendamment de ce lot
- `docs/domains/optional/wishlist.md` comme référence doctrinale du domaine

## Invariants

- Le système reste maître de la vérité sur les listes d'envies enregistrées (existant ou futur)
- Distinction stricte avec le panier (`cart`) — cf. `docs/domains/optional/wishlist.md`

## Risques

- Doublon fonctionnel et confusion architecturale si un nouveau domaine `wishlist` est implémenté sans clarifier sa relation avec `favorites` déjà en production
- Effort de cadrage sous-estimé si le lot est traité comme une création ex nihilo alors qu'une capacité proche existe déjà

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `db:validate` si évolution du schéma Prisma retenue
- Revue de code de `features/storefront/favorites/**` comme préalable au cadrage

## Critères de fin

- La frontière entre `wishlist` (doctrine) et `favorites` (implémentation) est explicitement tranchée et documentée
- Si un écart fonctionnel réel est confirmé, un schéma Prisma minimal et une implémentation ciblée couvrent ce seul écart
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la frontière entre `wishlist` documenté et `favorites` implémenté avant tout travail de modélisation ou d'implémentation.
