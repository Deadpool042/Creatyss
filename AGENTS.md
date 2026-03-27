# AGENTS.md

## Identité du projet

Creatyss est un **socle e-commerce custom** pour Creatyss.

Le projet doit être pensé comme :

- un **codebase unique**
- avec une **architecture modulaire réutilisable**
- mais **pas** comme une site-factory, un moteur multi-tenant, ni une plateforme de provisioning de boutiques.

L’objectif est de construire une base :

- locale d’abord
- maintenable
- strictement typée
- sobre
- modulaire
- déployable ensuite sur un VPS OVH

---

## Ce que Creatyss n’est pas

Ne pas traiter Creatyss comme :

- une site-factory
- une plateforme multi-tenant
- un moteur de provisioning
- un système de plugins runtime
- un orchestrateur générique de sites clients

Ne pas introduire de complexité "plateforme SaaS" sans besoin direct du repo actuel.

---

## Taxonomie canonique

Toute structuration architecture / docs / Prisma doit suivre cette taxonomie :

- `core`
- `cross-cutting`
- `optional`
- `satellites`

### core

Le `core` porte les vérités métier ou structurelles indispensables.

Exemples :

- foundation
- catalog
- commerce
- content

### cross-cutting

Le `cross-cutting` porte les préoccupations transverses structurantes.

Exemples :

- audit
- observability
- jobs
- domain-events
- feature-flags

### optional

Le `optional` porte les capacités activables qui enrichissent le système sans redéfinir le coeur.

Exemples :

- payments
- shipping
- loyalty
- analytics
- workflow
- AI

### satellites

Le `satellites` porte les projections, sous-systèmes périphériques, espaces de publication ou modèles dérivés non coeur.

Exemples :

- channels
- documents
- search

---

## Règles Prisma

### Arborescence

Le dossier `prisma/` doit refléter la taxonomie canonique :

- `prisma/core/**`
- `prisma/cross-cutting/**`
- `prisma/optional/**`
- `prisma/satellites/**`

Les sous-dossiers peuvent raffiner le regroupement métier :

- foundation
- catalog
- commerce
- content
- engagement
- platform
- ai

### Propriété des modèles

Chaque modèle Prisma doit avoir **un seul fichier propriétaire**.

Interdits :

- duplication silencieuse de modèles
- duplication silencieuse d’enums
- frontières floues entre fichiers

### Discipline après déplacement

Après tout déplacement de fichiers Prisma :

- vérifier les relations
- vérifier les enums
- vérifier les références croisées
- exécuter `pnpm prisma validate`

### Fichiers vides

Un fichier `.prisma` ne doit exister que s’il contient au moins un vrai élément Prisma :

- `model`
- `enum`
- `type`

Un placeholder vide doit vivre en documentation, pas dans `prisma/`.

### Metadata Prisma

Les metadata Prisma sont **documentaires uniquement** à ce stade.

Format autorisé :

`/// Feature: <domain>.<feature>`
`/// Category: core | optional | cross-cutting | satellite`
`/// Level: core | L1 | L2 | L3 | L4`
`/// DependsOn: <feature>, <feature>`

Ne pas transformer ces metadata en moteur runtime tant que ce besoin n’est pas explicitement demandé.

---

## Règles documentation

### Sources de vérité

La doctrine d’architecture vit dans :

- `docs/architecture/**`

La cartographie et les fiches domaine vivent dans :

- `docs/domains/**`

La stratégie de validation vit dans :

- `docs/testing/**`

### Alignement docs / Prisma

Tout bloc important du schéma doit être cohérent avec :

- sa catégorie documentaire
- sa place dans l’arborescence Prisma
- sa description dans la doc domaine

La doc ne doit pas décrire comme `core` un bloc clairement placé en `optional`, et inversement.

### Metadata docs

Dans `docs/domains/**`, utiliser un bloc metadata minimal cohérent avec Prisma :

- `feature`
- `category`
- `level`
- `dependsOn`

Ne pas introduire de matrices de gouvernance complexes sans besoin immédiat du projet.

---

## Règles de modularité

Creatyss est modulaire **par architecture**, pas par marketplace de modules runtime.

Cela signifie :

- les capacités optionnelles sont documentées et modélisées
- mais il n’existe pas encore de moteur d’activation dynamique avancé
- aucune hypothèse multi-tenant ne doit fuiter dans le codebase
- aucune abstraction "factory" ne doit être introduite par anticipation

---

## Style de conception attendu

Toujours privilégier :

- code explicite
- petits incréments sûrs
- frontières stables
- typage strict
- noms précis
- architecture métier d’abord

Éviter :

- abstractions spéculatives
- couches plateforme trop générales
- systèmes runtime inutiles
- complexité de gouvernance prématurée

---

## Discipline de modification

Quand une modification touche l’architecture, Prisma ou la doc :

1. classifier le bloc en `core`, `cross-cutting`, `optional` ou `satellite`
2. garder docs et Prisma alignés
3. valider Prisma après refactor structurel
4. séparer nettoyage structurel et évolution métier quand possible
5. préférer des changements petits, lisibles, réversibles

---

## Validation minimale attendue

Avant de considérer une modification structurelle comme terminée, vérifier au minimum :

- `pnpm prisma validate`
- la cohérence des chemins docs
- l’absence de référence Prisma orpheline
- l’absence de fichier Prisma vide
- la cohérence de la taxonomie avec `docs/domains/**`
