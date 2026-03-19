# Repository admin `category`

## Rôle

`admin-category.repository.ts` gère :

- listing admin des catégories
- détail admin
- création
- mise à jour
- suppression
- mise à jour de l'image de catégorie
- comptage des produits liés

## Structure actuelle

Fichiers :

- `admin-category.repository.ts`
- `admin-category.types.ts`

Contrat public principal :

- `AdminCategory`

Erreur publique :

- `AdminCategoryRepositoryError`

## Fonctions publiques actuelles

- `listAdminCategories()`
- `findAdminCategoryById(id)`
- `createAdminCategory(input)`
- `updateAdminCategory(input)`
- `deleteAdminCategory(id)`
- `updateAdminCategoryImage(input)`
- `countProductsForCategory(id)`

## Comportement clé : `representativeImage`

Le domaine reconstruit `representativeImage` sans N+1.

Règle actuelle :

1. partir des liens `product_categories`
2. ne garder que les produits `published`
3. ne garder que les images produit primaires :
   - `is_primary = true`
   - `variant_id = null`
4. choisir le produit le plus récent par :
   - `created_at DESC`
   - puis `productId DESC`
5. retourner `null` si aucun candidat n'existe

Cette logique est utilisée à la fois sur la liste et sur le détail.

## Points complexes réels

### Tri admin

`listAdminCategories()` trie en mémoire par :

- `name.toLowerCase() ASC`
- puis `id ASC`

### Batch loading

`loadRepresentativeImagesByCategoryIds()` :

- lit `product_categories`
- lit les produits publiés concernés
- lit les images primaires produit
- construit le meilleur candidat par catégorie

## Limitations et dette actuelle

Ce domaine est l'une des exceptions structurelles restantes :

- le repository ré-exporte encore `AdminCategoryRepositoryError`
- le repository ré-exporte encore `AdminCategory`
- les inputs publics `CreateAdminCategoryInput`, `UpdateAdminCategoryInput`, `UpdateAdminCategoryImageInput` restent inline dans le repository

Cette dette ne change pas le comportement runtime, mais elle n'est pas alignée avec la doctrine générale.

## Lecture V20

Le domaine `admin-category` est déjà propre côté Prisma et batch loading.

Le vrai travail V20 sur ce domaine est structurel :

- sortir les inputs publics dans `admin-category.types.ts`
- supprimer les ré-exports publics du repository
- garder le helper batch tel quel ou l'extraire en `helpers` si le gain est net
