# Cadrage — `engagement.analytics` niveaux `insights` puis `recommendations`

**Date :** 2026-06-15
**Statut :** cadrage court

## Objectif

Définir la prochaine marche après le niveau `read` déjà en place pour
`engagement.analytics`, sans réintroduire d'analytics complexes ni mélanger
analytics et moteur de recommandations.

## État réel du repo

### Niveau actuel `read`

- `/admin/insights/analytics` est ouvert une fois le module actif ;
- le bloc « Ce mois » lit des données commerce réelles (`Order` / `Customer`) ;
- le bloc « Aujourd'hui vs hier » reste mock, faute de pipeline `tracking` ;
- `AnalyticsMetric` / `AnalyticsSnapshot` existent en Prisma mais ne sont pas
  alimentés ;
- la query réelle actuelle est
  `features/admin/insights/queries/get-monthly-commerce-analytics.query.ts`.

### Données commerce déjà disponibles

Le schéma `Order` / `OrderLine` permet déjà des lectures supplémentaires
crédibles sans infrastructure nouvelle :

- montants de commande ;
- statuts de commande ;
- lignes de commande ;
- noms de produits vendus ;
- rattachement client ;
- dates de création / placement / annulation.

### Frontière `recommendations`

Le repo porte déjà un domaine séparé :

- `prisma/optional/engagement/recommendations.prisma`
- `docs/domains/optional/recommendations.md`

Donc le niveau `recommendations` de `engagement.analytics` ne doit pas être
interprété comme licence pour créer un moteur de recommandations directement
dans le cockpit analytics.

## Recommandation

### Prochaine marche retenue

Ouvrir d'abord **`insights`** comme enrichissement du cockpit analytics sur
données commerce réelles.

### Ce qu'il ne faut pas faire maintenant

- ne pas ouvrir `recommendations` dans ce même lot ;
- ne pas brancher `AnalyticsSnapshot` ;
- ne pas reconstruire un domaine `recommendations` dans `features/admin/insights` ;
- ne pas toucher au tracking trafic.

## Périmètre recommandé pour `insights`

Le niveau `insights` peut rester borné au cockpit `/admin/insights/analytics`
avec des vues commerce supplémentaires, par exemple :

- répartition des commandes par statut sur le mois ;
- top produits vendus sur le mois ;
- panier moyen mensuel réel ;
- concentration simple du revenu sur quelques produits ;
- éventuellement comparaison mois courant vs mois précédent, mais seulement sur
  métriques commerce déjà calculables.

## Pourquoi ce choix

- toutes ces données existent déjà dans `Order` / `OrderLine` ;
- elles restent dans la frontière « analytics commerce » déjà ouverte au niveau
  `read` ;
- elles n'exigent ni tracking, ni pipeline différé, ni modèle externe ;
- elles produisent de vrais enseignements opératoires, au-delà du simple bloc
  « Ce mois ».

## Périmètre à éviter dans `insights`

- trafic et pages vues ;
- visiteurs uniques ;
- conversion session → commande ;
- attribution marketing ;
- signaux newsletter ;
- signaux comportementaux `Behavior*` ;
- lecture de `AnalyticsSnapshot` si ceux-ci restent non alimentés.

## Intégration recommandée

### Query

Créer une query dédiée de niveau `insights`, séparée de la query mensuelle
actuelle, par exemple pour retourner :

- statut des commandes du mois ;
- top produits par quantité ou revenu ;
- panier moyen ;
- période courante + précédente.

Cela évite de gonfler `getMonthlyCommerceAnalytics` avec plusieurs
responsabilités.

### UI

Rester dans `AnalyticsOverviewSections` :

- bloc `read` existant inchangé ;
- blocs supplémentaires affichés seulement si
  `meetsFeatureLevel("engagement.analytics", "insights")` ;
- disclaimers explicites maintenus sur toutes les zones encore mock.

## Recommandation sur `recommendations`

Le niveau `recommendations` de ce feature flag doit être traité comme un
**pré-requis de pilotage** éventuel pour un futur lot dédié, pas comme une
implémentation immédiate.

Si un jour ce niveau est ouvert, il devra être cadré avec :

- `engagement.recommendations` comme domaine source de vérité ;
- `RecommendationRule` / `RecommendationLink` ;
- frontière claire avec `catalog.products.related`, `search`, `crm`,
  `marketing`.

En l'état actuel, aucune implémentation `recommendations` ne doit être faite
dans le cockpit analytics.

## Invariants

- le cockpit analytics ne devient pas un moteur de recommandations ;
- une vue encore partielle reste explicitée comme telle ;
- aucune dépendance cachée à `tracking` ;
- aucune écriture opportuniste dans `AnalyticsMetric` /
  `AnalyticsSnapshot` ;
- aucun calcul analytique ne redéfinit la vérité métier source des commandes.

## Risques

- glissement de `insights` vers dashboarding générique ;
- mélange analytics / recommendations ;
- tentation d'utiliser des mocks supplémentaires au lieu de lectures réelles ;
- explosion du périmètre si on ajoute trop de dimensions en une seule fois.

## Vérifications attendues

- typecheck ;
- vérification manuelle de l'affichage gated `read` vs `insights` ;
- vérification que les blocs `tracking` restent explicitement mock ;
- vérification de cohérence entre agrégats mensuels et détails affichés.

## Ordre recommandé de mise en oeuvre

1. nouvelle query commerce `insights` bornée ;
2. gating `meetsFeatureLevel("engagement.analytics", "insights")` ;
3. blocs UI supplémentaires sur le cockpit ;
4. mise à jour doc domaine analytics ;
5. mise à jour roadmap ;
6. garder `recommendations` explicitement hors lot.

## Critère de fin

`engagement.analytics` atteint un vrai niveau `insights` quand
`/admin/insights/analytics` expose des lectures commerce additionnelles,
réelles et explicitables, au-delà du simple résumé mensuel, sans introduire
tracking avancé ni moteur de recommandations.

## Bilan d'exécution (2026-06-15)

- `app/admin/(protected)/insights/analytics/page.tsx` distingue maintenant les
  niveaux `read` et `insights`.
- Une nouvelle lecture dédiée
  `getCommerceAnalyticsInsights()` agrège le mois courant depuis `Order` /
  `OrderLine` :
  - panier moyen confirmé ;
  - commandes confirmées ;
  - statuts des commandes créées ce mois ;
  - top produits par revenu/volume.
- `AnalyticsOverviewSections` affiche ces blocs supplémentaires uniquement si
  `meetsFeatureLevel("engagement.analytics", "insights")` est atteint.
- Le cockpit garde explicitement hors lot :
  - tracking trafic ;
  - `AnalyticsMetric` / `AnalyticsSnapshot` ;
  - toute implémentation `recommendations`.
