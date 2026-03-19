# Depuis V19

## Ce que V19 a déjà verrouillé

V19 a atteint les points suivants :

- Prisma comme seule couche d'accès aux données
- zéro raw Prisma runtime
- contrats publics majoritairement explicites dans `*.types.ts`
- batch loading pour les lectures complexes
- frontières `db` / `entities` / `features` plus nettes

## Ce que V20 ne change pas

V20 ne rouvre pas :

- la migration Prisma
- le schéma SQL
- les contrats publics
- les signatures runtime des repositories
- la séparation métier vers `entities/`

V20 est une étape de documentation et de doctrine structurelle.

## Différence principale V19 → V20

### V19

V19 documente surtout :

- ce qui a été migré
- les lots historiques
- l'état final de la couche `db/`

### V20

V20 documente surtout :

- comment lire `db/`
- comment le faire évoluer sans régression
- où extraire `queries`, `helpers` et `types/`
- quelles règles transverses sont déjà stabilisées par le code

## Ce qui doit rester stable pendant un refactor V20

- aucun changement de comportement
- aucun changement de contrat public
- aucune régression d'ordre ou de tie-break
- aucune régression de transaction
- aucune réintroduction de raw Prisma

## Points d'entrée V20 prioritaires

Les besoins de modularisation les plus nets sont visibles dans :

- `catalog.repository.ts`
- `order.repository.ts`
- `products/admin-product.repository.ts`
- `admin-homepage.repository.ts`
- `admin-category.repository.ts`

## Dette structurelle explicite héritée de V19

- `catalog.repository.ts` ré-exporte encore ses types
- `admin-category.repository.ts` garde encore des inputs publics inline et des ré-exports publics
- `features/homepage/types.ts` importe encore un type depuis un repository
- `products/**` existe déjà comme sous-arborescence, mais sans doctrine interne suffisamment détaillée

## Lecture V20

La réussite de V20 ne sera pas “plus de Prisma”.

La réussite de V20 sera :

- moins de gros fichiers opaques
- plus de frontières internes lisibles
- moins d'exceptions structurelles
- aucune régression fonctionnelle ni publique
