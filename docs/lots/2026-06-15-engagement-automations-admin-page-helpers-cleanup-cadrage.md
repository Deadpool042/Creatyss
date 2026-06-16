<!-- docs/lots/2026-06-15-engagement-automations-admin-page-helpers-cleanup-cadrage.md -->

# Cadrage — `engagement.automations` nettoyage structurel de `page.tsx`

## Contexte

`app/admin/(protected)/marketing/automations/page.tsx` (1153 lignes) concentre :

- ~30 fonctions pures de présentation (lignes 74-506, ~430 lignes) ;
- 2 tableaux de filtres de statut de job strictement identiques
  (`JOB_STATUS_FILTERS` et `ARCHIVED_JOB_STATUS_FILTERS`) ;
- 1 des 3 implémentations d'un même href builder vers
  `/admin/marketing/automations` (les 2 autres sont dans
  `admin-archived-automations-list.tsx` et
  `admin-archived-automation-jobs-list.tsx`) ;
- 1 des 2-3 implémentations d'un résumé d'activité de jobs archivés
  (`getArchivedAutomationJobsFocusSummary` dans `page.tsx` vs
  `getArchivedJobActivitySummary` / `formatArchivedActivityBadges` dans
  `admin-archived-automations-list.tsx`).

Ceci contrevient à `docs/architecture/10-fondations/12-frontieres-et-responsabilites.md`
(Règle 1 : une responsabilité = un seul bloc) sans justifier une refonte :
le contenu est uniquement déplacé et dédupliqué.

## Objectif

Réduire `page.tsx` à son rôle de Server Component (fetch + composition JSX)
en extrayant les helpers de présentation purs vers
`features/admin/marketing/automations/shared/`, et en supprimant les
duplications identifiées, sans aucun changement de comportement.

## Périmètre

- Extraire les ~30 helpers purs de `page.tsx` (lignes 74-506) vers un ou
  plusieurs modules de `features/admin/marketing/automations/shared/`
  (découpage par section : définitions / jobs / archives définitions /
  archives jobs / filtres actifs globaux).
- Fusionner `JOB_STATUS_FILTERS` et `ARCHIVED_JOB_STATUS_FILTERS` en une
  seule constante partagée (les deux tableaux sont identiques).
- Unifier les 3 implémentations de href builder
  (`buildAutomationsPageHref` dans `page.tsx`,
  `buildArchivedAutomationJobsHref` dans
  `admin-archived-automations-list.tsx`,
  `buildArchivedAutomationHref` dans
  `admin-archived-automation-jobs-list.tsx`) en une seule fonction
  partagée dans `features/admin/marketing/automations/shared/`.
- Unifier les fonctions de résumé d'activité de jobs archivés si elles
  couvrent strictement le même calcul, sinon documenter pourquoi elles
  restent distinctes.
- Mettre à jour les imports dans `page.tsx`,
  `admin-archived-automations-list.tsx` et
  `admin-archived-automation-jobs-list.tsx`.

## Hors périmètre

- Tout changement UX/UI (bannières, repliage de la carte `Archives`,
  cohérence des compteurs) — lot séparé `next-admin-ui-builder`.
- Changement de route, de querystring, d'ancres (`#archives`,
  `#archived-automations`, `#archived-jobs`, `#automation-jobs`).
- Changement de logique métier (archive/restore, codes archivés/restaurés).
- Changement de schéma Prisma ou de queries.
- Renommage de types exportés de
  `features/admin/marketing/automations/types/**`.

## Invariants

- Route canonique inchangée : `/admin/marketing/automations`.
- Tous les paramètres de recherche (`automation_created`, `automation_error`,
  `automation`, `status`, `definition`, `archivedAutomation`,
  `archivedStatus`, `archivedDefinition`) et ancres inchangés.
- Sortie HTML/comportement strictement identique pour chaque filtre,
  compteur, bannière, lien de restauration.
- Aucun nouveau contrat public hors de
  `features/admin/marketing/automations/`.
- Pas de nouvelle dépendance.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Vérification manuelle de `/admin/marketing/automations` : filtres
  (définitions, jobs, archives définitions, archives jobs), compteurs,
  bannières de focus, liens de restauration, retrait des filtres.

## Critères de fin

- `page.tsx` ne contient plus que : constantes de recherche/typage de
  props, fetch des données, composition JSX (plus de ~30 helpers purs).
- Un seul tableau de filtres de statut de job (au lieu de deux identiques).
- Un seul href builder partagé (au lieu de trois).
- Au plus une fonction de résumé d'activité de jobs archivés par usage
  réel (dédup si redondance confirmée).
- `pnpm run typecheck` et `pnpm run lint` OK, comportement inchangé en
  vérification manuelle.

## Statut — clôturé

Réalisé en 3 lots :

- **Lot 1** : extraction des ~30 helpers purs de `page.tsx` vers
  `features/admin/marketing/automations/shared/` (filtres définitions,
  jobs, archives, page-href, page-summary), fusion
  `JOB_STATUS_FILTERS`/`ARCHIVED_JOB_STATUS_FILTERS`, unification des 3
  href builders dans `buildAutomationsPageHref`.
- **Lot 2** : mise à jour des imports de
  `admin-archived-automations-list.tsx` et
  `admin-archived-automation-jobs-list.tsx` vers les helpers partagés.
- **Lot 3** : `page.tsx` (709 lignes) découpé en 4 composants Server
  de présentation (`admin-automation-definitions-section.tsx`,
  `admin-automation-jobs-section.tsx`,
  `admin-archived-automations-section.tsx`,
  `admin-archived-automation-jobs-section.tsx`), `page.tsx` réduit à
  305 lignes (fetch + composition uniquement).

Dernier critère (résumé d'activité jobs archivés) : confirmé non
redondant — `getArchivedAutomationJobActivitySummary` (texte agrégé) et
`formatArchivedActivityBadges` (badges-liens filtrables) lisent le même
`jobActivity` mais produisent des sorties différentes. Documenté par
commentaire dans les deux fichiers plutôt que fusionné, pour éviter une
abstraction commune sans gain net.

Vérifications : `tsc --noEmit` et `eslint` OK. Ancres et searchParams
inchangés.
