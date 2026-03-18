# V17 — Structure des features et introduction de Zod

## Objectif

Stabiliser l’organisation de `features/` avant toute migration plus large de la couche d’accès aux données, en posant une structure explicite et durable, puis introduire `zod` proprement sur les premiers cas utiles.

## Contexte

Le projet a déjà commencé à structurer les fonctionnalités par namespaces, avec une base saine autour de `features/admin/`. En revanche :

- `lib/` reste encore trop souvent un dossier par défaut
- `schemas/` est absent de la plupart des features
- la validation des entrées est encore principalement portée par des validators TypeScript manuels côté `entities/`
- `zod` n’était pas encore introduit
- la future migration vers Prisma 7+ doit arriver sur une base plus claire et plus stable

## Intention de V17

V17 ne cherche pas à refondre toute l’application.

V17 cherche à :

1. clarifier la structure de `features/`
2. introduire `zod`
3. brancher `zod` sur quelques cas réels prioritaires
4. documenter explicitement les schémas encore préparatoires
5. préparer un terrain propre pour les prochains lots

## Documents de référence

Pour ce lot, les sources de vérité sont :

- `AGENTS.md`
- les markdown pertinents de `.claude/`
- les skills et documents pertinents de `.agents/`
- `docs/v6/` pour les fondations métier et le langage admin
- `docs/v8/` pour la cohérence design system admin
- `docs/v10/` pour les vues admin et les flux actuels
- `docs/v17/features-structure-and-zod-doctrine.md`
- `docs/v17/features-structure-and-zod-roadmap.md`

## Périmètre

Ce lot couvre :

- la structure de `features/`
- l’introduction de `zod`
- la création de `schemas/` feature-local quand c’est pertinent
- la migration progressive des validations sur quelques features admin prioritaires
- la mise à jour des imports et actions concernés

## Hors périmètre

Ce lot ne couvre pas :

- Prisma
- la refonte ORM
- une migration complète de toutes les features
- une abstraction “service” générique supplémentaire
- une refonte globale du domaine métier
- le déplacement complet des features storefront hors de leur structure actuelle si cela élargit trop le lot

## État atteint après V17-1

### Zod introduit

- dépendance `zod` ajoutée

### Cas réellement branchés

- `features/admin/auth`
- `features/admin/categories`

### Cas préparatoires documentés

- `features/admin/products/schemas/product-form-schema.ts`
- `features/admin/blog/schemas/blog-post-form-schema.ts`
- `features/admin/homepage/schemas/homepage-form-schema.ts`

## Ordre de progression recommandé

1. V17-1 — introduction de Zod et premiers branchements réels
2. V17-2 — branchement Zod sur `products`
3. V17-3 — branchement Zod sur `blog`
4. V17-4 — branchement Zod sur `homepage`
5. V17-5 — recul progressif de `lib/` au profit de dossiers explicites
6. lot Prisma séparé, uniquement après stabilisation

## Vérifications attendues

- `pnpm run typecheck`
- build Next.js dans Docker
- vérification manuelle des pages admin concernées
- absence de régression fonctionnelle
