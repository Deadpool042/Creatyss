# Lot — Lisibilité des niveaux de gouvernance

## Statut

Livré — 2026-07-03. `levelLabels` ajouté aux 20 entrées graduées du catalogue (`feature-catalog.ts`), propagé par `list-admin-feature-flags.query.ts`, affiché dans `feature-flag-level-select.tsx` : tous les niveaux autorisés listés avec libellé FR + description, niveau courant marqué "Actuel". Vérifié visuellement sur `pricing` et `localization`. `typecheck` et `lint` passent.

## Objectif

Pour toute fonctionnalité graduée (`mutability: "level_selectable"` dans `FEATURE_CATALOG`), l'écran de gouvernance doit rendre visibles, sans action supplémentaire de l'utilisatrice :

1. Le toggle actif/inactif de la fonctionnalité (existe déjà).
2. Le niveau actuellement sélectionné (existe déjà).
3. **Pour chaque niveau autorisé, pas seulement le niveau courant** : son libellé traduit et une description de ce qu'il fait et ce qu'il apporte par rapport au niveau précédent.

Le contenu (descriptions par niveau) existe déjà dans `FEATURE_CATALOG` (`features/admin/pilotage/catalog/feature-catalog.ts`, champ `levelDescriptions`) — c'est un problème d'affichage, pas de données manquantes.

## Contexte technique observé

- `features/admin/pilotage/components/settings-advanced/feature-flag-level-select.tsx` : le composant actuel affiche un `<Select>` dont chaque `<SelectItem>` porte le code brut passé dans `humanizeLevel()` (simple capitalisation, pas de traduction), et n'affiche `currentLevelDescription` que pour le niveau sélectionné (lignes 38-39 et 58-60 du fichier).
- `features/admin/pilotage/catalog/feature-catalog.ts` : chaque fonctionnalité graduée porte déjà un objet `levelDescriptions: Record<string, string>` complet et en français correct (vérifié sur `catalog.products.pricing`, `catalog.products.availability`, et une dizaine d'autres entrées).
- Aucun champ `levelLabels` (libellé court traduit, distinct de la description longue) n'existe actuellement dans `FEATURE_CATALOG` — à ajouter.
- `prisma/seed/feature-flags-catalog.seed.ts` consomme `description` (au niveau fonctionnalité) mais ne référence pas les niveaux eux-mêmes — les codes de niveau (`base-price`, etc.) restent des clés techniques stables, ne pas les renommer.

## Périmètre

- Ajout d'un champ `levelLabels: Record<string, string>` (libellé FR court par code de niveau) dans `FEATURE_CATALOG`, à côté de `levelDescriptions` existant, pour chaque fonctionnalité graduée.
- Refonte de l'affichage de `FeatureFlagLevelSelect` (ou composant successeur) pour lister tous les niveaux autorisés avec leur libellé traduit et leur description, pas seulement le niveau courant — a minima au survol/dépliage, idéalement visible directement sans interaction supplémentaire vu le public non technique.
- Suppression de `humanizeLevel()` une fois le mapping de libellés en place (ne doit plus servir de source d'affichage).

## Hors périmètre

- Toute modification du mécanisme de gradation lui-même (résolution de niveau, mutabilité, guards serveur) — cf. `docs/domains/cross-cutting/feature-flags.md` et `feature-governance.md`, non concernés par ce lot.
- Toute modification des codes de niveau en base (`base-price`, `price-lists`, etc.) — ce sont des clés stables, seul leur affichage change.
- Le renommage ou la restructuration du menu "Avancé" — traité par `lot-nav-avance-clarification.md`.

## Invariants

- Aucune migration Prisma nécessaire : `levelLabels` est une donnée de configuration statique (`FEATURE_CATALOG`), pas un champ persisté.
- Le comportement fonctionnel du sélecteur (changement de niveau, mutabilité, capabilities) reste strictement inchangé — seul l'affichage évolue.
- Chaque fonctionnalité graduée existante doit avoir un `levelLabels` complet avant livraison — pas de fallback silencieux sur le code brut qui reproduirait le bug initial.

## Risques

- Composant partagé par toutes les familles de features graduées (`pricing`, `availability`, `blog`, `relatedProducts`, `variants` — cf. `FEATURE_LEVELS` dans `feature-catalog.ts`) : vérifier l'affichage sur chacune, pas seulement `pricing` qui a servi de cas observé.
- Risque d'oubli de `levelLabels` sur une fonctionnalité graduée ajoutée après ce lot — envisager une vérification de complétude (ex. test ou garde-fou signalant un niveau sans libellé) plutôt qu'une confiance manuelle.

## Critères de fin

- Chaque fonctionnalité graduée du `FEATURE_CATALOG` a un `levelLabels` en français pour chacun de ses niveaux.
- L'écran `/admin/settings/advanced/**` affiche, pour une fonctionnalité graduée, le libellé traduit et la description de chaque niveau autorisé — pas seulement celui actuellement sélectionné.
- Plus aucun code brut (`base-price`, `price-lists`, etc.) visible à l'écran.
- `pnpm run typecheck` et `pnpm run lint` passent.

## Agent recommandé

`next-admin-ui-builder` pour le composant, `prisma-architect` non nécessaire (pas de migration).
