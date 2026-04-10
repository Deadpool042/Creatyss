# AGENTS.md

## Identité du projet

Creatyss est un socle e-commerce custom.

Le projet est conçu pour être :

- local-first via Docker Compose
- maintenable
- lisible
- strictement typé
- documenté
- déployable ensuite sur un VPS OVH
- réutilisable pour d’autres projets e-commerce au-delà du seul cas Creatyss

Creatyss est un **codebase unique** avec une **architecture modulaire réutilisable**.

Creatyss n’est pas, à ce stade :

- une site-factory
- une plateforme multi-tenant
- un moteur de provisioning de boutiques
- un système de plugins runtime
- un orchestrateur générique de sites clients

## Stack cible

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker / Docker Compose
- Makefile

---

## Source de vérité

Lire par défaut, dans cet ordre :

1. `AGENTS.md`
2. `README.md`
3. `docs/architecture/README.md`
4. `docs/architecture/00-introduction/00-vue-d-ensemble-du-systeme.md`
5. `docs/architecture/00-introduction/01-glossaire.md`
6. `docs/architecture/00-introduction/02-guide-de-lecture.md`
7. `docs/architecture/10-fondations/10-principes-d-architecture.md`
8. `docs/architecture/10-fondations/11-modele-de-classification.md`
9. `docs/architecture/10-fondations/12-frontieres-et-responsabilites.md`
10. `docs/architecture/20-structure/20-cartographie-du-systeme.md`
11. `docs/architecture/20-structure/21-domaines-coeur.md`
12. `docs/architecture/20-structure/22-capacites-optionnelles.md`
13. `docs/architecture/20-structure/23-systemes-externes-et-satellites.md`
14. `docs/architecture/20-structure/24-preoccupations-transverses.md`
15. `docs/domains/README.md`
16. `docs/testing/` si la demande touche validation, robustesse ou stratégie de tests

Ensuite seulement, lire la documentation ciblée par la demande :

- fiche précise dans `docs/domains/`
- document précis dans `docs/testing/`
- document de lot explicitement visé
- ancienne documentation seulement si la demande la vise explicitement

Les anciennes docs `docs/v*` et les anciens chemins plats de `docs/architecture/` ne sont plus la source de vérité courante.

---

## Doctrine repo

Le repo est structuré autour d’une doctrine explicite portée par `docs/architecture/`.

La colonne vertébrale documentaire est :

- `00-introduction/`
- `10-fondations/`
- `20-structure/`
- `30-execution/`
- `40-exploitation/`
- `90-reference/`

La documentation détaillée des domaines se trouve dans `docs/domains/`.

La stratégie de validation se trouve dans `docs/testing/`.

---

## Taxonomie canonique

La taxonomie canonique reconnue dans le repo est :

- `core`
- `optional`
- `cross-cutting`
- `satellites`

Cette taxonomie s’applique à la fois à :

- `docs/domains/{core, optional, cross-cutting, satellites}`
- `prisma/{core, optional, cross-cutting, satellites}`

Les regroupements métier internes comme :

- `foundation`
- `catalog`
- `commerce`
- `content`
- `engagement`
- `platform`
- `ai`

sont des sous-structures locales.
Ils ne remplacent pas la taxonomie canonique.

Ne jamais confondre :

- catégorie documentaire
- criticité architecturale
- activabilité
- source de vérité

Points doctrinaux stabilisés :

- `availability` porte la disponibilité vendable
- `inventory` porte la vérité de stock
- `fulfillment` porte l’exécution logistique
- `shipping` porte l’expédition et le suivi de livraison
- `auth`, `users`, `roles`, `permissions` relèvent d’un coeur structurel
- `customers` porte le client métier
- un domaine `events` éventuel dans `cross-cutting/` désigne un domaine métier transverse explicite
- les `domain-events` internes désignent les événements applicatifs liés à l’exécution du système
- ces deux notions ne doivent jamais être mélangées

---

## Règles absolues

- Toujours rester dans le périmètre demandé.
- Toujours proposer un plan avant un lot non trivial.
- Ne jamais faire de refactor opportuniste hors périmètre.
- Ne pas ajouter de dépendance sans nécessité explicite.
- Ne pas modifier le comportement métier sans demande explicite.
- Ne pas changer les contrats publics ou signatures runtime sans l’annoncer explicitement.
- Ne pas introduire de nouvelle abstraction si une extraction locale suffit.
- Ne pas utiliser `any` sauf justification explicite.
- Toujours privilégier de petits lots sûrs.
- Ne jamais faire dériver la doctrine courante à partir d’un ancien document isolé sans validation explicite.
- Ne jamais contourner `docs/architecture/` au nom de la vitesse.
- Ne jamais traiter Creatyss comme une site-factory ou une plateforme multi-tenant si la demande ne l’exige pas explicitement.

---

## Doctrine architecture

- Le métier passe avant la technique.
- Le coeur doit rester identifiable.
- Les capacités optionnelles doivent rester bornées.
- Les dépendances externes doivent être encapsulées.
- La source de vérité doit être explicite.
- Les événements expriment des faits ; ils ne corrigent pas une mauvaise modélisation.
- Les préoccupations transverses doivent être traitées explicitement.
- Les frontières doivent être compréhensibles.
- Le système doit rester testable par responsabilité.
- La documentation doit refléter la structure réelle.

Séparer clairement :

- domaine métier
- structure d’accès
- intégration
- exécution
- données
- UI

Ne pas mélanger logique métier et composants de présentation.

---

## Doctrine Prisma

Le dossier `prisma/` doit refléter la taxonomie canonique :

- `prisma/core/**`
- `prisma/optional/**`
- `prisma/cross-cutting/**`
- `prisma/satellites/**`

### Propriété des modèles

Dans `prisma/**` :

- chaque `model` doit avoir un propriétaire unique
- chaque `enum` doit avoir un propriétaire unique
- chaque `type` doit avoir un propriétaire unique
- aucune duplication silencieuse n’est acceptable

### Discipline après déplacement

Après tout déplacement structurel dans `prisma/**` :

- vérifier les relations
- vérifier les enums
- vérifier les références croisées
- exécuter `pnpm prisma validate`

### Fichiers vides

Ne pas conserver de fichier `.prisma` vide comme placeholder.

Un fichier Prisma ne doit exister que s’il contient au moins un vrai élément Prisma :

- `model`
- `enum`
- `type`

Si un domaine n’a pas encore de matérialisation DB réelle, sa place est dans `docs/domains/**`, pas dans `prisma/**`.

### Metadata minimales Prisma

Quand une demande touche la classification d’un domaine ou d’un fichier Prisma, utiliser uniquement des metadata documentaires minimales :

- `Feature`
- `Category`
- `Level`
- `DependsOn`

Format attendu :

`/// Feature: <domain>.<feature>`
`/// Category: core | optional | cross-cutting | satellite`
`/// Level: core | L1 | L2 | L3 | L4`
`/// DependsOn: <feature>, <feature>`

Ces metadata servent à clarifier la structure du repo.
Elles ne constituent pas, à ce stade, un moteur runtime d’activation des fonctionnalités.

---

## Doctrine documentation

- La documentation doit refléter le code réel.
- Ne jamais documenter une architecture future comme si elle existait déjà.
- Toujours distinguer :
  - état réel actuel
  - cible visée
  - hors périmètre

Toute fiche domaine doit rester cohérente avec :

- `docs/architecture/`
- `docs/domains/README.md`
- `docs/domains/_template.md`
- `docs/domains/_migration-audit.md` si le lot touche une zone en migration

Toute doc de lot doit préciser :

- objectif
- périmètre
- hors périmètre
- invariants
- risques
- vérifications
- critères de fin

Si une modification touche la doctrine, vérifier la cohérence entre :

- `README.md`
- `AGENTS.md`
- `.claude/CLAUDE.md`
- `docs/architecture/`
- `docs/domains/`
- `docs/testing/`

### Metadata minimales docs

Dans `docs/domains/**`, quand la demande le justifie, utiliser un bloc metadata minimal cohérent avec Prisma :

- `feature`
- `category`
- `level`
- `dependsOn`

Ne pas introduire de matrice de gouvernance complexe sans besoin immédiat du projet.

---

## Contraintes projet

- Next.js App Router
- TypeScript strict
- Server Components par défaut
- Client Components seulement si nécessaire
- pas de logique métier dans les composants UI
- pas de `any` sauf justification explicite
- pas de dépendance inutile
- pas de sur-architecture
- pas de WordPress, WooCommerce, Shopify, Supabase, Vercel

---

## Structure de code

Respecter d’abord la structure réellement observée dans le repo.

Repères généraux :

- `app/` : routes, layouts, pages, handlers
- `features/` : verticales / cas d’usage
- `entities/` ou `domain/` : types, règles métier, validations métier
- `components/` : UI
- `core/` : infrastructure et primitives partagées si présent
- `db/` : uniquement si le repo courant l’utilise encore explicitement pour cette responsabilité
- `lib/` : helpers techniques seulement, pas zone fourre-tout
- `scripts/` : scripts techniques
- `public/` : assets et uploads locaux

Ne jamais imposer un template fixe de feature si le repo réel n’utilise pas cette structure.

Ne jamais réintroduire `db/repositories` ou une architecture legacy sans validation explicite de la doctrine courante.

---

## Méthode de travail

Avant de modifier :

- auditer le périmètre réel
- identifier les fichiers réellement concernés
- identifier les imports, contrats et docs impactés
- expliciter les invariants à préserver
- signaler les ambiguïtés avant exécution

Pendant le lot :

- faire les changements les plus locaux possibles
- préserver la compatibilité publique
- éviter le churn inutile
- éviter les renommages si le gain n’est pas net

Après le lot :

- exécuter les vérifications pertinentes :
  - `pnpm run typecheck`
  - `pnpm run lint`
  - tests ciblés si pertinent
  - e2e ciblés si le lot touche l’UI ou un parcours critique
- rendre un compte-rendu précis :
  - fichiers modifiés
  - ce qui a changé
  - ce qui n’a pas changé
  - risques ou écarts éventuels
  - résultat des vérifications

Après un refactor structurel touchant `docs/**` ou `prisma/**`, vérifier explicitement :

- la cohérence des chemins
- la cohérence des liens documentaires internes
- la cohérence entre taxonomie doc et taxonomie Prisma
- l’absence de référence Prisma orpheline
- l’absence de fichier Prisma vide

---

## Règle de prudence

En cas de doute :

- préférer la solution la plus simple
- préférer la compatibilité au redesign
- préférer une extraction interne locale à une refonte publique
- revenir à `docs/architecture/`
- clarifier la source de vérité
- clarifier la frontière du domaine
- demander validation avant tout changement de sémantique ou de contrat

---

## Relation avec `.claude/CLAUDE.md`

`AGENTS.md` porte la doctrine projet canonique.

`.claude/CLAUDE.md` est sa déclinaison opérationnelle pour Claude Code :
- plus détaillée
- plus prescriptive sur le routage
- plus orientée exécution

En cas d’écart, réaligner les deux documents.
