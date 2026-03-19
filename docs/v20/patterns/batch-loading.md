# Pattern — Batch loading

## Pourquoi ce pattern existe dans le code

Le batch loading a été introduit pour deux raisons concrètes :

- remplacer les requêtes SQL historiques qui faisaient des jointures complexes
- éviter les boucles de requêtes par produit, catégorie ou commande

Le pattern est visible surtout dans :

- `catalog.repository.ts`
- `admin-category.repository.ts`

## Forme actuelle du pattern

Le code suit généralement cette séquence :

1. collecter les ids à partir d'une première lecture
2. dédupliquer les ids
3. exécuter une ou plusieurs lectures Prisma batchées avec `in: [...]`
4. reconstruire un index en mémoire (`Map`)
5. assembler le read model final sans nouvelle requête

## Exemples réels

### Catalogue

Helpers réels :

- `loadPrimaryProductImagesByProductIds`
- `loadRepresentativeImagesByCategoryIds`
- `loadPublishedVariantOffersByProductIds`

Ces helpers servent à :

- homepage
- listing boutique
- détail produit
- produits récents

### Catégories admin

Helper réel :

- `loadRepresentativeImagesByCategoryIds`

Ce helper reconstruit `representativeImage` à partir de trois lectures batchées.

## Règles strictes

- aucun N+1 toléré sur une boucle produit, catégorie ou ligne de panier
- `select` minimal uniquement
- déduplication des ids avant lecture
- `Map` explicite pour l'assemblage
- valeur `null` explicite si aucun candidat n'existe

## Ce qui n'est pas du batch loading

- un simple `Promise.all` de deux lectures indépendantes
- un `include` profond qui charge trop de données sans contrôle
- une boucle `for` qui appelle Prisma à chaque itération

## Lecture V20

Quand un domaine volumineux sera découpé, les helpers batch devront être parmi les premiers candidats à sortir du repository.

Ils restent cependant des helpers de persistance, pas des règles métier.
