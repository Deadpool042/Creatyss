# Lot — Audit navigation admin

## Statut

À faire

## Objectif

Produire une cartographie complète et factuelle de la navigation admin actuelle, sans proposer aucune restructuration. Ce lot est un lot d'observation pur : le lot de décision (`lot-decision-ia-admin.md`) s'appuiera sur ce livrable pour proposer des options, mais ce lot-ci ne doit contenir aucune recommandation.

## Périmètre

- Recenser tous les groupes définis dans `features/admin/navigation/utils/admin-navigation.data.ts` (`adminNavigationGroupDefinitions`) et tous les items (`adminNavigationItems`), avec pour chacun : clé, label, href, groupe, capability(ies) requise(s), feature flag(s) requis, visibilité (sidebar / mobilePrimary / mobileMore / internalOnly).
- Recenser l'arborescence complète de `app/admin/(protected)/**` (tous les segments de route observés), indépendamment de la présence ou non d'un item de navigation associé.
- Lister explicitement chaque duplication observée entre une section `settings/*` et une section domaine équivalente (ex. `catalog-settings` vs `/admin/catalog`).
- Calculer et lister la profondeur (nombre de segments de route depuis `/admin`) de chaque écran, en particulier la fiche produit (`/admin/catalog/products/[slug]/**`).
- Recenser les routes utilisant le pattern `@list`/`@detail` (parallel routes) et leur emplacement.

## Hors périmètre

- Toute proposition de nouvelle structure de navigation (relève de `lot-decision-ia-admin.md`).
- Toute modification de code.
- Toute recommandation de fusion, suppression ou renommage de groupe ou d'item.

## Invariants

- Le document produit doit être vérifiable ligne à ligne contre le code source cité (`admin-navigation.data.ts`, arborescence `app/admin/(protected)/**`).
- Aucune affirmation ne doit être formulée comme "implémenté" ou "actif" sans référence au fichier ou à la route observée.

## Risques

- Risque de dérive vers des recommandations de restructuration pendant l'audit — à éviter explicitement, ce lot reste un audit d'observation.
- Risque d'omission si l'audit se limite à `admin-navigation.data.ts` sans croiser avec l'arborescence réelle de `app/admin/(protected)/**` (des routes existent sans item de navigation, ou inversement).

## Critères de fin

- Chaque groupe et chaque item de navigation admin est recensé avec sa capability/flag associé(s).
- Chaque duplication settings/domaine est listée explicitement.
- Chaque route dont la profondeur dépasse 3 niveaux est signalée.
- Le document ne contient aucune recommandation de restructuration.

## Agent recommandé

`architect-review`
