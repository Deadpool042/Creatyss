# Lot — Décision information architecture admin

## Statut

À faire — bloqué par `lot-audit-navigation-admin.md`

Ce lot n'est explicitement PAS un lot de code. Aucune implémentation ne doit démarrer sur la base de ce document sans validation humaine préalable.

## Objectif

À partir de la cartographie produite par `lot-audit-navigation-admin.md`, proposer 2 à 3 options concrètes de restructuration de l'information architecture de la navigation admin. Ces options sont des pistes à arbitrer, pas une décision actée.

Pistes à documenter (exemples, non exhaustifs, non actés) :

- Fusionner les pages "Réglages" dans les pages domaine correspondantes via un onglet "Configuration" plutôt qu'un groupe séparé.
- Réduire le nombre de groupes top-level.
- Renommer les "Vue d'ensemble" pour qu'elles soient différenciables par domaine (ex. "Vue d'ensemble — Catalogue", "Vue d'ensemble — Commerce").

## Périmètre

- Analyse comparative des options proposées : impact sur le nombre de clics, impact sur les capabilities/flags existants, impact sur les redirects nécessaires.
- Formulation d'une recommandation argumentée parmi les options, sans l'imposer.
- Présentation des options à l'humain pour validation explicite.

## Hors périmètre

- Toute implémentation de code.
- Toute modification de `features/admin/navigation/**` ou de `app/admin/(protected)/**`.
- Toute décision actée sans validation humaine explicite.

## Invariants

- Aucune capability ou feature flag existant ne doit être supprimé ou modifié dans les options proposées — seule la structure de présentation/regroupement est en jeu.
- Les options doivent rester compatibles avec le pattern de navigation existant (`AdminNavigationItem`, `AdminNavigationGroupDefinition`) sans proposer une refonte du modèle de données de navigation, sauf si l'audit démontre un blocage structurel.

## Risques

- Risque de sur-ingénierie si les options proposées introduisent une abstraction de navigation non justifiée par le besoin observé.
- Risque de decision paralysis si trop d'options sont proposées sans recommandation claire — se limiter à 2-3 options argumentées.

## Critères de fin

- 2 à 3 options concrètes sont documentées avec leurs avantages/inconvénients respectifs.
- Une recommandation est formulée mais explicitement présentée comme non actée.
- [ ] Validation humaine explicite obtenue avant tout démarrage de `lot-implementation-nav-admin.md`.

## Agent recommandé

`architect-review` pour la proposition des options. Validation humaine ensuite, obligatoire avant toute suite.
