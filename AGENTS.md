# AGENTS.md

## Statut de ce document

`AGENTS.md` est la doctrine canonique du repo.

Tous les autres fichiers d’instructions du projet doivent s’y aligner, notamment :

- `.claude/CLAUDE.md`
- `.github/copilot-instructions.md`
- les skills projet
- les instructions contextuelles
- les agents spécialisés

Ces fichiers peuvent compléter `AGENTS.md` pour leur outil ou leur périmètre, mais ne doivent ni le contredire ni le remplacer.

---

## Identité du projet

Creatyss est un socle e-commerce custom.

Le projet est conçu pour être :

- local-first ;
- strictement typé ;
- documenté ;
- déployable sur VPS OVH ;
- réutilisable pour d’autres projets e-commerce.

Creatyss est un codebase unique destiné à une boutique e-commerce artisanale.

Ne pas traiter le projet comme :

- un SaaS multi-tenant ;
- une marketplace.

---

## Stack cible

- Next.js App Router
- TypeScript strict
- PostgreSQL — local natif sur `localhost:5434`, variables dans `.env.local`
- Prisma — scripts locaux via `pnpm run db:*`
- pnpm pour le développement local courant
- Docker Compose pour les vérifications prod-like locales uniquement
- Makefile pour les commandes prod-like et utilitaires si conservé
- déploiement futur sur VPS OVH

---

## Modes d’exécution

Le développement courant est local natif.

Par défaut :

- utiliser `pnpm dev` pour lancer l’application en local ;
- utiliser PostgreSQL local sur `localhost:5434` comme base de données de développement ;
- utiliser les scripts `pnpm run db:*` pour les opérations Prisma et le seed local ;
- utiliser les scripts `pnpm run ...` pour les vérifications courantes (typecheck, lint, test) ;
- réserver Docker Compose aux validations prod-like locales, aux vérifications d’intégration et à la préparation au déploiement ;
- ne pas remplacer le flux local natif par Docker sauf demande explicite.

Le projet distingue trois modes :

1. développement local natif via `pnpm dev` ;
2. prod-like local via Docker Compose ;
3. production future sur VPS OVH.

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

---

## Règle de factualité

Toujours distinguer :

- Observé
- Documenté
- Déduit
- Inconnu

La documentation permet d'affirmer :

- documenté
- décrit
- spécifié

Elle ne permet pas d'affirmer :

- implémenté
- actif
- utilisé
- opérationnel

sans preuve complémentaire.

Les preuves recevables sont :

- code observé
- modèle Prisma observé
- route observée
- feature observée
- test observé
- commit observé

La présence d'un dossier seul ne constitue pas une preuve d'implémentation.

Si une information n'est pas démontrable :

"Inconnu"

Ne jamais présenter une hypothèse, une extrapolation ou une intention future comme un fait.

---

## Doctrine repo

La doctrine du projet est portée par :

- AGENTS.md
- docs/architecture/
- docs/domains/

Ordre de priorité :

1. AGENTS.md
2. docs/architecture/
3. docs/domains/
4. documentation locale concernée

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

- catégorie documentaire ;
- criticité architecturale ;
- activabilité ;
- source de vérité.

Points doctrinaux stabilisés :

- `availability` porte la disponibilité vendable ;
- `inventory` porte la vérité de stock ;
- `fulfillment` porte l’exécution logistique ;
- `shipping` porte l’expédition et le suivi de livraison ;
- `auth`, `users`, `roles`, `permissions` relèvent d’un coeur structurel ;
- `customers` porte le client métier ;
- un domaine `events` éventuel dans `cross-cutting/` désigne un domaine métier transverse explicite ;
- les `domain-events` internes désignent les événements applicatifs liés à l’exécution du système ;
- ces deux notions ne doivent jamais être mélangées.

---

## Règles absolues

Toujours :

- rester dans le périmètre demandé ;
- partir de la structure réellement observée dans le repo ;
- préserver les contrats publics sauf demande explicite ;
- privilégier les plus petits changements sûrs ;
- préférer la solution la plus simple compatible avec l’évolution future.

Ne jamais :

- modifier le comportement métier sans demande explicite ;
- ajouter une dépendance sans nécessité explicite ;
- utiliser `any` sans justification ;
- contourner la doctrine portée par `docs/architecture/`.

---

## Principes architecturaux

Toujours respecter la doctrine décrite dans `docs/architecture/`.

Invariants majeurs :

- métier avant technique ;
- frontières explicites ;
- source de vérité explicite ;
- logique métier hors UI ;
- séparation claire entre domaine, données, exécution et présentation ;
- documentation alignée sur la structure réelle du système.

---

## Doctrine Prisma

Le dossier `prisma/` doit refléter la taxonomie canonique :

- `prisma/core/**`
- `prisma/optional/**`
- `prisma/cross-cutting/**`
- `prisma/satellites/**`

### Propriété des éléments Prisma

Dans `prisma/**` :

- chaque `model` doit avoir un propriétaire unique ;
- chaque `enum` doit avoir un propriétaire unique ;
- chaque `type` doit avoir un propriétaire unique ;
- aucune duplication silencieuse n’est acceptable.

### Discipline après déplacement

Après tout déplacement structurel dans `prisma/**` :

- vérifier les relations ;
- vérifier les enums ;
- vérifier les références croisées ;
- exécuter `pnpm run db:validate`.

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
`/// Category: core | optional | cross-cutting | satellites`
`/// Level: core | L1 | L2 | L3 | L4`
`/// DependsOn: <feature>, <feature>`

Ces metadata servent à clarifier la structure du repo.
Elles ne constituent pas, à ce stade, un moteur runtime d’activation des fonctionnalités.

---

## Doctrine documentation

La documentation doit :

- refléter le code réel ;
- ne jamais présenter une architecture future comme si elle existait déjà ;
- toujours distinguer :
  - état réel actuel ;
  - cible visée ;
  - hors périmètre.

Toute fiche domaine doit rester cohérente avec :

- `docs/architecture/`
- `docs/domains/README.md`
- `docs/domains/_template.md`
- `docs/domains/_migration-audit.md` si le lot touche une zone en migration

Toute doc de lot doit préciser :

- objectif ;
- périmètre ;
- hors périmètre ;
- invariants ;
- risques ;
- vérifications ;
- critères de fin.

Si une modification touche la doctrine, vérifier explicitement la cohérence entre :

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
- pas de WordPress, WooCommerce, Shopify, Supabase ou Vercel

---

## Structure de code

Respecter d’abord la structure réellement observée dans le repo.

Repères généraux :

- `app/` : routes, layouts, pages, handlers
- `features/` : verticales et cas d’usage
- `entities/` ou `domain/` : types, règles métier, validations métier
- `components/` : UI
- `core/` : infrastructure et primitives partagées si présent
- `db/` : uniquement si le repo courant l’utilise encore explicitement pour cette responsabilité
- `lib/` : helpers techniques seulement, pas zone fourre-tout
- `scripts/` : scripts techniques
- `public/` : assets et uploads locaux

Ne jamais imposer un template fixe si le repo réel n’utilise pas cette structure.

Ne jamais réintroduire `db/repositories` ou une architecture legacy sans validation explicite de la doctrine courante.

---

## Méthode de travail

Avant de modifier :

- auditer le périmètre réel ;
- identifier les fichiers réellement concernés ;
- identifier les imports, contrats et docs impactés ;
- expliciter les invariants à préserver ;
- signaler les ambiguïtés structurantes avant exécution.

Pendant le lot :

- faire les changements les plus locaux possibles ;
- préserver la compatibilité publique ;
- éviter le churn inutile ;
- éviter les renommages si le gain n’est pas net.

Après le lot :

- exécuter les vérifications pertinentes en local natif :
  - `pnpm run typecheck`
  - `pnpm run lint`
  - `pnpm run test` ou tests ciblés si pertinent
  - e2e ciblés si le lot touche l’UI ou un parcours critique
- utiliser Docker Compose uniquement si le lot nécessite une validation prod-like ou une vérification d’intégration conteneurisée
- rendre un compte-rendu précis :
  - fichiers modifiés ;
  - ce qui a changé ;
  - ce qui n’a pas changé ;
  - risques ou écarts éventuels ;
  - résultat des vérifications.

Après un refactor structurel touchant `docs/**` ou `prisma/**`, vérifier explicitement :

- la cohérence des chemins ;
- la cohérence des liens documentaires internes ;
- la cohérence entre taxonomie doc et taxonomie Prisma ;
- l’absence de référence Prisma orpheline ;
- l’absence de fichier Prisma vide.

---

## Règle de prudence

En cas de doute :

- préférer la solution la plus simple ;
- préférer la compatibilité au redesign ;
- préférer une extraction interne locale à une refonte publique ;
- revenir à `docs/architecture/` ;
- clarifier la source de vérité ;
- clarifier la frontière du domaine ;
- demander validation avant tout changement de sémantique ou de contrat.

---

## Relation avec les autres couches d’instructions

AGENTS.md est la doctrine canonique du repo.

Les autres couches complètent AGENTS.md mais ne le remplacent pas.

En cas de conflit, réaligner les autres couches sur AGENTS.md.
