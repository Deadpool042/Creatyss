# V21-4B — `products` : variantes et images

## Summary

V21-4B est le lot prévu pour modulariser les deux façades publiques techniques du domaine `products` :

- [admin-product-variant.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product-variant.repository.ts)
- [admin-product-image.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product-image.repository.ts)

## Objectif

Clarifier les règles internes liées aux variantes et aux images sans modifier :

- les contrats publics admin
- les règles `is_default`
- les règles `is_primary`
- le scope de l'image primaire produit vs variante
- la compatibilité admin existante

## Audit de départ / contexte réel

État réel actuel :

- `admin-product-variant.repository.ts` : 303 lignes
- `admin-product-variant.types.ts` : 50 lignes
- `admin-product-image.repository.ts` : 345 lignes
- `admin-product-image.types.ts` : 50 lignes

Les responsabilités actuellement portées par ces façades sont :

- gestion du variant par défaut
- validation des règles de création/suppression de variante selon le type produit
- synchronisation de l'offre simple native depuis la variante legacy
- gestion des images dans deux scopes distincts :
  - scope produit
  - scope variante

## Périmètre exact

V21-4B doit couvrir :

- la modularisation interne de `admin-product-variant.repository.ts`
- la modularisation interne de `admin-product-image.repository.ts`
- l'introduction de queries/helpers/types internes si le gain est lisible

## Hors périmètre exact

V21-4B ne doit pas couvrir :

- une modification de `simple-product-compat.ts`
- une modification des façades publiques produits déjà stabilisées en V21-4A
- une modification des contrats publics admin variantes ou images
- un changement de logique de publication produit

## Fichiers potentiellement concernés

- `db/repositories/products/admin-product-variant.repository.ts`
- `db/repositories/products/admin-product-variant.types.ts`
- `db/repositories/products/admin-product-image.repository.ts`
- `db/repositories/products/admin-product-image.types.ts`
- nouveaux fichiers internes sous `db/repositories/products/queries/`
- nouveaux fichiers internes sous `db/repositories/products/helpers/`
- nouveaux fichiers internes sous `db/repositories/products/types/`

## Invariants à préserver

Invariants critiques :

- unicité du variant `is_default` par produit
- règles de suppression/création de variante selon le type produit
- unicité de `is_primary` dans le bon scope
- séparation stricte entre scope produit et scope variante pour les images
- compatibilité admin sur les signatures et contrats d'image/variante

## Risques principaux

Risques principaux :

- casser la remise à zéro du variant par défaut
- casser la remise à zéro des images primaires dans le mauvais scope
- casser la validation d'appartenance variante ↔ produit
- casser la synchronisation de compatibilité simple produit

## Vérifications obligatoires

- `pnpm run typecheck`
- `pnpm run lint`
- vérification ciblée des façades variantes et images
- vérification ciblée des invariants `is_default` et `is_primary`

## Critères de fin

V21-4B est considéré terminé quand :

- les repositories variantes et images sont sensiblement allégés
- les règles de scope et de priorité restent inchangées
- les façades publiques restent strictement stables
- `typecheck` et `lint` passent

## Compatibilité publique

Compatibilité attendue :

- mêmes chemins publics
- mêmes exports publics
- mêmes signatures runtime
- aucune adaptation nécessaire côté admin

## Décisions ou ambiguïtés connues

Décisions déjà retenues :

- la règle `is_default` ne doit pas être redéfinie
- la règle `is_primary` ne doit pas changer de scope

Ambiguïtés connues :

- la granularité exacte des futurs helpers variantes/images dépendra du gain réel de lisibilité au moment du lot
