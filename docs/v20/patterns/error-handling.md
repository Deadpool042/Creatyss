# Pattern — Gestion des erreurs

## Principe global

Le code actuel suit un pattern simple :

- les erreurs Prisma connues sont absorbées au niveau repository
- elles sont re-mappées vers une erreur publique de domaine quand le domaine en expose une
- les erreurs inconnues sont relancées

## Erreurs publiques de domaine

Exemples présents dans le code :

- `AdminBlogRepositoryError`
- `AdminCategoryRepositoryError`
- `AdminHomepageRepositoryError`
- `OrderRepositoryError`
- `AdminProductRepositoryError`
- `AdminProductVariantRepositoryError`
- `AdminProductImageRepositoryError`

## Codes Prisma réellement absorbés

### `P2002`

Utilisé pour les conflits d'unicité.

Exemples :

- blog : `slug_taken`
- category : `slug_taken`
- product : `slug_taken` ou `sku_taken` selon `meta.target`
- product variant : `sku_taken`

### `P2003`

Utilisé pour les violations de clés étrangères.

Exemples :

- blog : `blog_post_referenced`
- category : `category_referenced`
- product : `product_referenced`

### `P2025`

Utilisé comme “ligne non trouvée” dans plusieurs mutations.

Pattern actuel :

- souvent converti en `null` ou `false`
- pas toujours transformé en erreur publique

## Conventions observables

### `null`

Retourne `null` quand :

- l'id fourni est invalide
- la ligne n'existe pas
- le domaine choisit une absence silencieuse contrôlée

### `false`

Retourne `false` quand :

- une suppression ciblée ne trouve rien
- un update ciblé ne touche aucune ligne

### throw

Lance une erreur publique quand :

- le domaine doit remonter une incohérence métier ou relationnelle observable
- la validation transactionnelle échoue

## Domaines particuliers

### `payment`

`payment.repository.ts` n'expose pas d'erreur publique dédiée. Le domaine reste plus proche d'un flux technique contrôlé.

### `guest-cart`

`guest-cart.repository.ts` utilise surtout `null` et `false`, sans erreur publique dédiée.

### `admin-category`

Le domaine garde encore son erreur publique dans `admin-category.types.ts`, mais le repository la ré-exporte encore.

## Lecture V20

Toute modularisation future doit préserver :

- les mêmes erreurs publiques
- les mêmes codes publics
- les mêmes choix entre `null`, `false` et exception

Un refactor interne ne doit pas transformer silencieusement une absence en exception, ni l'inverse.
