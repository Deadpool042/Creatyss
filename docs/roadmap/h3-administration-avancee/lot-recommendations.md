# Lot — Recommandations

## Statut

A faire

## Objectif

Activer le domaine `recommendations` : suggestions produit/offre gouvernées, exposées dans un contexte donné (panier, fiche produit, storefront). Les modèles Prisma sont posés et le domaine est documenté comme `optional` / `activable: oui`, mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/engagement/recommendations.prisma` — modèles `RecommendationRule`, `RecommendationLink` déjà posés (observés)
- Définition de règles de recommandation (contexte d'exposition, priorité) et de liens produit/offre associés
- Exposition storefront de recommandations gouvernées (panier, fiche produit, page catégorie)
- Admin : gestion des règles de recommandation
- Gating via `meetsFeatureLevel` — niveau(x) à définir en cadrage, cohérent avec `docs/domains/optional/recommendations.md`

**Distinction importante avec l'existant** : ce domaine ne doit pas être confondu avec `catalog.products.related` (produits associés), déjà implémenté et livré (cf. `docs/roadmap` — lot localisation des produits associés, `features/storefront/catalog` pour la logique de produits liés). `catalog.products.related` porte une association éditoriale simple et statique entre produits du catalogue. `engagement.recommendations` porterait un moteur de suggestions gouverné par règles et contexte d'exposition, potentiellement dynamique — un périmètre plus large et structurellement distinct. Tout cadrage de ce lot doit explicitement traiter la question du recouvrement fonctionnel avec l'existant avant toute décision d'implémentation, pour éviter de dupliquer une capacité déjà couverte.

## Hors périmètre

- Personnalisation algorithmique ou moteur de scoring (hors doctrine actuelle, à cadrer séparément si retenu)
- Recommandations CRM ou marketing relationnel (relève de `crm`/`marketing`, pas de ce domaine)
- Toute évolution de `catalog.products.related` dans le cadre de ce lot — restent deux domaines distincts

## Dépendances

- Décision produit : la fonctionnalité recommandations gouvernées est-elle réellement prioritaire, sachant que `catalog.products.related` couvre déjà un besoin proche en production ? — à trancher avant tout cadrage détaillé
- `catalog.products` actif comme source des produits recommandables
- `docs/domains/optional/recommendations.md` comme référence doctrinale du domaine

## Invariants

- Le système reste maître de la vérité sur les règles et liens de recommandation exposés
- Distinction stricte avec le search (`search`), le merchandising éditorial et `catalog.products.related` — cf. `docs/domains/optional/recommendations.md`
- Une recommandation exposée doit rester traçable à sa règle et à son contexte d'exposition

## Risques

- Duplication fonctionnelle avec `catalog.products.related` si la frontière n'est pas tranchée avant l'implémentation
- Complexité de priorisation entre plusieurs règles concurrentes sur un même contexte

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur la résolution d'une règle de recommandation selon un contexte donné

## Critères de fin

- Une règle de recommandation peut être définie en admin et exposée dans un contexte storefront donné
- La distinction avec `catalog.products.related` est documentée et respectée dans l'implémentation
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et la frontière avec `catalog.products.related`, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
