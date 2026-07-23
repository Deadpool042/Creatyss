# Lot — Politique de vente (sales-policy)

## Statut

A faire

## Objectif

Formaliser le domaine `satellites.sales-policy` : décision de vendabilité contextuelle d'un produit/variante/offre (règles métier, commerciales, géographiques ou temporelles). Le modèle Prisma est posé et le domaine est documenté comme `satellites` / `activable: non` (structurel dès que le système ne réduit pas la vente à la simple existence d'un produit et d'un prix), mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/commerce/sales-policy.prisma` — modèles `SalesPolicy`, `SellabilityDecision`, `SalesPolicyProductTarget`, `SalesPolicyVariantTarget`, `SalesPolicyCategoryTarget` déjà posés (observés)
- Définition de règles de politique de vente ciblant produit, variante ou catégorie
- Évaluation d'une décision de vendabilité contextuelle (contexte de vente donné : boutique, marché, canal)
- Admin : gestion des politiques de vente et de leurs cibles

## Hors périmètre

- Le stock quantitatif (relève de `inventory`, hors périmètre)
- Le pricing, les remises et la taxation (relèvent respectivement de `pricing`, `discounts`, `taxation`)
- Les canaux et intégrations externes (hors périmètre de ce lot)
- L'intégration avec `commerce.bundles` (dépend d'une vendabilité cohérente des composants — à cadrer conjointement si les deux lots avancent en parallèle)

## Dépendances

- Décision produit : quels critères de vendabilité contextuelle sont réellement nécessaires au-delà de ce qui est déjà géré par la disponibilité produit/stock actuelle ? — à trancher avant tout cadrage détaillé
- `catalog.products` actif comme cible des règles de vendabilité
- `docs/domains/satellites/sales-policy.md` comme référence doctrinale du domaine (distinction avec `products`, `inventory`, `availability`, `pricing`, `discounts`, `taxation`)

## Invariants

- Le système reste maître de la vérité sur la décision de vendabilité contextuelle
- Distinction stricte avec le catalogue source (`products`), le stock (`inventory`) et la disponibilité calculée (`availability`) — cf. `docs/domains/satellites/sales-policy.md`
- Une décision de vendabilité doit rester explicable (raison de refus, restriction ou acceptation conditionnelle)

## Risques

- Confusion fonctionnelle avec la disponibilité produit déjà gérée localement dans le catalogue si la frontière n'est pas explicitement tranchée
- Complexité d'un socle générique de règles sans cas d'usage concret validé en amont (marchés, canaux, contextes géographiques)

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur l'évaluation d'une décision de vendabilité selon un contexte donné

## Critères de fin

- Une règle de politique de vente peut être définie et évaluée pour produire une décision de vendabilité explicable
- La frontière avec `inventory`/`availability` est explicitement tranchée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la cible fonctionnelle prioritaire et la frontière avec `inventory`/`availability`, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
