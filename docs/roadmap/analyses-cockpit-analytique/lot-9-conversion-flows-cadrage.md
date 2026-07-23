# Lot 9 — Conversion : dispositifs de conversion (cadrage)

## Statut

A faire

## Objectif

Activer le domaine `engagement.conversion` : mécanismes de relance, upsell, cross-sell et seuils de progression dans le parcours d'achat. Le modèle Prisma est posé et le domaine est documenté comme `cross-cutting` / `activable: oui`, mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/engagement/conversion.prisma` — modèles `ConversionFlow`, `ConversionFlowProduct` déjà posés (observés)
- Définition d'un dispositif de conversion (règle de récupération de panier, offre upsell/cross-sell, seuil de progression)
- Exposition effective d'un mécanisme de conversion dans le parcours d'achat (panier, checkout)
- Admin : gestion des dispositifs de conversion

**Distinction importante** : ce domaine doit être articulé, sans le dupliquer, avec l'effet de bord panier abandonné déjà livré (`docs/roadmap/analyses-cockpit-analytique/lot-7-panier-abandonne-effet-bord-cadrage.md`, réactivation transparente Option A) et avec `catalog.products.related`/`engagement.recommendations` (cf. `docs/roadmap/h3-administration-avancee/lot-recommendations.md`) pour les mécanismes de cross-sell catalogue. `conversion` porte des dispositifs de relance et de progression commerciale explicitement gouvernés (seuils, upsell/cross-sell dans le tunnel d'achat), distincts d'une simple association produit ou d'un recalcul d'état panier.

## Hors périmètre

- Les remises et coupons (relève de `discounts`, déjà implémenté — un dispositif de conversion peut s'appuyer sur une remise existante mais n'en porte pas la logique)
- Les campagnes marketing et la newsletter (relèvent de `marketing`/`newsletter`, déjà livrés séparément)
- Le CRM enrichi (relève de `crm`, hors périmètre)
- Les recommandations catalogue génériques (relève de `engagement.recommendations`, domaine distinct cadré séparément)

## Dépendances

- Décision produit : quels dispositifs de conversion sont réellement prioritaires pour le business (relance panier, upsell, seuils de progression) ? — à trancher avant tout cadrage détaillé
- L'effet de bord panier abandonné déjà livré (`lot-7-panier-abandonne-effet-bord-cadrage.md`) comme référence à ne pas dupliquer côté logique de réactivation
- `docs/domains/cross-cutting/conversion.md` comme référence doctrinale du domaine (distinction avec `discounts`, `marketing`, `newsletter`, `crm`, `recommendations`)

## Invariants

- Le système reste maître de la vérité sur les dispositifs de conversion définis et leur exposition effective
- Distinction stricte avec les remises (`discounts`), le marketing (`marketing`) et les recommandations catalogue génériques (`recommendations`) — cf. `docs/domains/cross-cutting/conversion.md`
- Une exposition de dispositif de conversion doit rester traçable à sa règle et à son contexte

## Risques

- Chevauchement fonctionnel avec l'effet de bord panier abandonné déjà livré si la frontière n'est pas explicitement tranchée
- Chevauchement fonctionnel avec `engagement.recommendations` (cadré séparément, également non implémenté) si les deux domaines ne sont pas articulés dès le cadrage

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la résolution et l'exposition d'un dispositif de conversion selon un contexte donné

## Critères de fin

- Un dispositif de conversion peut être défini et exposé dans le parcours d'achat
- La frontière avec l'effet de bord panier abandonné et avec `engagement.recommendations` est explicitement tranchée et documentée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et les frontières avec le panier abandonné et les recommandations, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
