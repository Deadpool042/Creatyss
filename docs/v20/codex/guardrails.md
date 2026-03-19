# Guardrails V20

## Invariants absolus

- aucun changement de comportement
- aucun changement de contrat public
- aucune modification des signatures runtime exportées
- aucune régression de performance évidente
- aucun raw Prisma
- aucun changement de schéma

## Frontières à respecter

- `db/` : persistance, transactions, assemblage de read models
- `entities/` : règles métier et validations métier
- `features/` : actions, schemas, composants, mappers UI

## Interdictions

- pas de couche service
- pas d'imports de types publics depuis un repository si un `*.types.ts` existe
- pas de queries publiques consommées directement par `features/`
- pas de changement opportuniste hors domaine demandé
- pas de suppression massive de fichiers sans lot explicite

## Garde-fous spécifiques

### Catalogue

- préserver la règle unique d'image primaire
- préserver les orderings actuels
- préserver le filtrage `onlyAvailable` après dérivation

### Commande et paiement

- préserver `Serializable`
- préserver les remappings d'erreurs existants
- préserver les flows idempotents de webhook

### Produits admin

- ne pas casser la compatibilité `simple-product-compat.ts`
- ne pas exposer de vocabulaire interne en dehors des zones techniques

## Vérifications minimales

- `pnpm run typecheck`
- `pnpm run lint`
- vérification ciblée des imports si des types bougent
- vérification explicite de l'absence de N+1 si un flux de lecture change

## Gestion des exceptions

Si une exception structurelle réelle existe déjà dans le code, il faut :

1. la constater
2. la documenter
3. la traiter seulement si le lot le demande explicitement

Exemples actuels :

- ré-exports publics résiduels dans `catalog.repository.ts`
- ré-exports publics et inputs inline dans `admin-category.repository.ts`
- `features/homepage/types.ts` encore branché sur `catalog.repository.ts`
