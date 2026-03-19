# Dos and don'ts

## DO

- utiliser Prisma uniquement dans `db/`
- garder les signatures publiques dans les repositories
- garder les contrats publics dans `*.types.ts`
- faire des `select` ciblés et explicites
- batcher les lectures dès qu'une boucle créerait un N+1
- mapper explicitement `bigint` et `Decimal` vers les contrats publics
- laisser la logique métier dans `entities/`
- importer les erreurs et types publics depuis `*.types.ts`
- documenter explicitement toute exception structurelle réelle

## DON'T

- réintroduire `$queryRaw`
- réintroduire `$executeRaw`
- réintroduire `Prisma.sql`
- mélanger logique métier et persistance
- importer des types publics depuis un `*.repository.ts` quand un `*.types.ts` existe
- faire des `include` profonds par défaut
- multiplier les abstractions génériques sans pression réelle
- transformer un refactor interne en changement de contrat public

## Exceptions réelles à connaître

Le code actuel a encore deux exceptions structurelles :

- `admin-category.repository.ts` ré-exporte encore des types publics
- `catalog.repository.ts` ré-exporte encore des types publics

Une exception feature reste également en place :

- `features/homepage/types.ts` ré-exporte encore `FeaturedCategory` depuis `catalog.repository.ts`

Ces exceptions doivent être traitées comme de la dette existante, pas comme des patterns à reproduire.
